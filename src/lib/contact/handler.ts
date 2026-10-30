import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { contactConfig, type ContactConfig } from "./config";
import { deliverInquiry, DeliveryError } from "./mail";
import { validateInquiry, type FieldErrors } from "./schema";
import { contactLimiter, type createContactLimiter } from "./rate-limit";

const privateKey = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export interface ContactResult {
  ok: boolean;
  message: string;
  errors?: FieldErrors;
  reference?: string;
}

const safe = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]!)
  );

export function isAllowedOrigin(
  origin: string | null,
  config: ContactConfig
): boolean {
  if (!origin) return false;
  if (origin === config.origin) return true;
  if (config.allowedOrigins && config.allowedOrigins.includes(origin)) return true;

  try {
    const originUrl = new URL(origin);
    const configUrl = new URL(config.origin);
    if (originUrl.protocol === configUrl.protocol && originUrl.port === configUrl.port) {
      const h1 = originUrl.hostname.replace(/^www\./, "");
      const h2 = configUrl.hostname.replace(/^www\./, "");
      if (h1 && h1 === h2 && h1.includes(".")) return true;
    }
  } catch {
    return false;
  }
  return false;
}

function result(
  request: Request,
  status: number,
  data: ContactResult,
  retryAfter?: number
) {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
  };

  if (request.headers.get("accept")?.includes("application/json")) {
    return Response.json(data, { status, headers });
  }

  headers["Content-Type"] = "text/html; charset=utf-8";
  headers["Content-Security-Policy"] =
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'";

  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry ${
      data.ok ? "status" : "error"
    } | MOTEKRA</title><style>body{max-width:640px;margin:12vh auto;padding:24px;font:18px/1.6 Arial;color:#08152b;background:#edf7ff}a{color:#075db6}h1{line-height:1.1}</style><main><h1>${
      data.ok ? "Inquiry status" : "Your inquiry was not confirmed"
    }</h1><p>${safe(data.message)}</p>${
      data.errors
        ? `<ul>${Object.entries(data.errors)
            .map(
              ([key, value]) =>
                `<li><a href="/contact#${safe(key)}">${safe(value!)}</a></li>`
            )
            .join("")}</ul>`
        : ""
    }${
      data.reference ? `<p>Reference: ${safe(data.reference)}</p>` : ""
    }<p><a href="/contact">Return to the contact form</a></p>${
      data.ok ? "" : "<p>Your browser’s Back button may retain your form text.</p>"
    }</main></html>`,
    { status, headers }
  );
}

function logDiagnostics(
  event: "failed" | "accepted",
  data: {
    stage: string;
    status: number;
    durationMs: number;
    reference?: string;
    providerCode?: string;
    errorName?: string;
    errorMessage?: string;
  }
) {
  const logObject = {
    log_source: "motekra_contact",
    event: `contact_inquiry_${event}`,
    stage: data.stage,
    status: data.status,
    providerCode: data.providerCode ?? "none",
    durationMs: data.durationMs,
    reference: data.reference ?? "none",
    ...(data.errorName ? { errorName: data.errorName } : {}),
    ...(data.errorMessage ? { errorMessage: data.errorMessage } : {}),
  };

  if (event === "failed") {
    console.error(JSON.stringify(logObject));
  } else {
    console.log(JSON.stringify(logObject));
  }
}

async function readBody(request: Request) {
  const type = request.headers.get("content-type")?.split(";")[0]?.trim();
  if (!["application/json", "application/x-www-form-urlencoded"].includes(type ?? "")) {
    throw { status: 415, stage: "unsupported_content_type" };
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32768) {
    throw { status: 413, stage: "payload_too_large" };
  }

  const raw = await request.text();
  if (raw.length > 32768) {
    throw { status: 413, stage: "payload_too_large" };
  }

  let values: Record<string, unknown>;
  if (type === "application/json") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw { status: 400, stage: "invalid_json" };
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw { status: 400, stage: "malformed_json_shape" };
    }
    values = parsed as Record<string, unknown>;
  } else {
    const params = new URLSearchParams(raw);
    const keys = [...params.keys()];
    if (new Set(keys).size !== keys.length) {
      throw { status: 400, stage: "duplicate_form_keys" };
    }
    values = Object.fromEntries(params);
  }

  if (
    Object.keys(values).some(
      (key) => !["name", "email", "projectType", "message", "companyWebsite"].includes(key)
    )
  ) {
    throw { status: 400, stage: "unknown_fields" };
  }

  return values;
}

export async function handleContact(
  request: Request,
  options: {
    config?: ContactConfig | null;
    fetchApi?: typeof fetch;
    limiter?: ReturnType<typeof createContactLimiter>;
  } = {}
) {
  const startTime = Date.now();
  const config = options.config === undefined ? contactConfig() : options.config;

  if (!config) {
    logDiagnostics("failed", {
      stage: "config_missing",
      status: 503,
      durationMs: Date.now() - startTime,
    });
    return result(request, 503, {
      ok: false,
      message:
        "Inquiry delivery is awaiting verified configuration. No message was sent.",
    });
  }

  if (
    !isAllowedOrigin(request.headers.get("origin"), config) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    logDiagnostics("failed", {
      stage: "origin_forbidden",
      status: 403,
      durationMs: Date.now() - startTime,
    });
    return result(request, 403, {
      ok: false,
      message:
        "This request could not be verified. Open the contact page and try again.",
    });
  }

  const limiter = options.limiter ?? contactLimiter;
  const globalQuota = limiter.take([{ key: "global", limit: 30, windowMs: 3600000 }]);
  if (!globalQuota.allowed) {
    logDiagnostics("failed", {
      stage: "global_rate_limited",
      status: 429,
      durationMs: Date.now() - startTime,
    });
    return result(
      request,
      429,
      {
        ok: false,
        message:
          "The inquiry channel is receiving too many requests. Please try again later.",
      },
      globalQuota.retryAfter
    );
  }

  let values: Record<string, unknown>;
  try {
    values = await readBody(request);
  } catch (error) {
    const err = error as { status?: number; stage?: string };
    const status = err.status ?? 400;
    logDiagnostics("failed", {
      stage: err.stage ?? "body_read",
      status,
      durationMs: Date.now() - startTime,
    });
    return result(request, status, {
      ok: false,
      message:
        status === 413
          ? "This inquiry is too large. Keep your message within 5,000 characters."
          : "The inquiry format could not be read. Please use the contact form.",
    });
  }

  if (typeof values.companyWebsite !== "string" || values.companyWebsite.trim()) {
    logDiagnostics("failed", {
      stage: "spam_honeypot",
      status: 422,
      durationMs: Date.now() - startTime,
    });
    return result(request, 422, {
      ok: false,
      message:
        "This inquiry could not pass the spam check. No message was sent.",
    });
  }

  const { data, errors } = validateInquiry(values);
  if (Object.keys(errors).length) {
    logDiagnostics("failed", {
      stage: "validation_errors",
      status: 422,
      durationMs: Date.now() - startTime,
    });
    return result(request, 422, {
      ok: false,
      message: "Please check the highlighted fields.",
      errors,
    });
  }

  const quotas = [{ key: `email:${privateKey(data.email)}`, limit: 3, windowMs: 3600000 }];

  if (config.trustProxy) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (!ip || !isIP(ip)) {
      logDiagnostics("failed", {
        stage: "proxy_ip_unverifiable",
        status: 503,
        durationMs: Date.now() - startTime,
      });
      return result(request, 503, {
        ok: false,
        message:
          "The inquiry channel could not verify its network configuration. No message was sent.",
      });
    }
    quotas.push({ key: `ip:${privateKey(ip)}`, limit: 5, windowMs: 900000 });
  }

  const quota = limiter.take(quotas);
  if (!quota.allowed) {
    logDiagnostics("failed", {
      stage: "client_rate_limited",
      status: 429,
      durationMs: Date.now() - startTime,
    });
    return result(
      request,
      429,
      {
        ok: false,
        message: "Please wait before sending another inquiry.",
      },
      quota.retryAfter
    );
  }

  // Stable key lets the provider deduplicate retries for 24 hours without a database.
  const reference = privateKey(JSON.stringify(data));
  const refShort = reference.slice(0, 16);

  try {
    await deliverInquiry(config, data, reference, options.fetchApi);
    logDiagnostics("accepted", {
      stage: "provider_delivery",
      status: 200,
      durationMs: Date.now() - startTime,
      reference: refShort,
    });
    return result(request, 200, {
      ok: true,
      reference: refShort,
      message:
        "Your inquiry was accepted by our email provider for delivery. Inbox arrival is not yet confirmed.",
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;

    if (error instanceof DeliveryError) {
      logDiagnostics("failed", {
        stage: "provider_rejection",
        status: error.status,
        providerCode: error.providerCode,
        durationMs,
        reference: refShort,
        errorName: error.name,
        errorMessage: `Provider returned HTTP ${error.status} (${error.providerCode ?? "unknown"})`,
      });

      if (error.status === 429) {
        return result(
          request,
          429,
          {
            ok: false,
            message:
              "The email service has reached a sending limit. Please try again later.",
          },
          60
        );
      }

      return result(request, 502, {
        ok: false,
        message:
          "We could not confirm email delivery. Your text is still in the form. Please wait before trying again.",
      });
    }

    // Runtime or network error (e.g. TypeError, network connection abort)
    const err = error as Error | undefined;
    logDiagnostics("failed", {
      stage: "dispatch_runtime_error",
      status: 502,
      durationMs,
      reference: refShort,
      errorName: err?.name ?? typeof error,
      errorMessage: err?.message ? err.message.slice(0, 120) : "Runtime dispatch error",
    });

    return result(request, 502, {
      ok: false,
      message:
        "We could not confirm email delivery. Your text is still in the form. Please wait before trying again.",
    });
  }
}
