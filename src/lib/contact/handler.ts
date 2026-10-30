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
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry ${data.ok ? "status" : "error"
    } | MOTEKRA</title><style>body{max-width:640px;margin:12vh auto;padding:24px;font:18px/1.6 Arial;color:#08152b;background:#edf7ff}a{color:#075db6}h1{line-height:1.1}</style><main><h1>${data.ok ? "Inquiry status" : "Your inquiry was not confirmed"
    }</h1><p>${safe(data.message)}</p>${data.errors
      ? `<ul>${Object.entries(data.errors)
        .map(
          ([key, value]) =>
            `<li><a href="/contact#${safe(key)}">${safe(value!)}</a></li>`
        )
        .join("")}</ul>`
      : ""
    }${data.reference ? `<p>Reference: ${safe(data.reference)}</p>` : ""
    }<p><a href="/contact">Return to the contact form</a></p>${data.ok ? "" : "<p>Your browser’s Back button may retain your form text.</p>"
    }</main></html>`,
    { status, headers }
  );
}

async function readBody(request: Request) {
  const type = request.headers.get("content-type")?.split(";")[0];
  if (!["application/json", "application/x-www-form-urlencoded"].includes(type ?? "")) {
    throw { status: 415 };
  }

  if (Number(request.headers.get("content-length") ?? 0) > 32768) {
    throw { status: 413 };
  }

  const reader = request.body?.getReader();
  if (!reader) throw { status: 400 };

  let bytes = 0;
  const parts: Uint8Array[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 32768) {
        await reader.cancel();
        throw { status: 413 };
      }
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const raw = Buffer.concat(parts).toString("utf8");
  let values: Record<string, unknown>;

  if (type === "application/json") {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw { status: 400 };
    }
    values = parsed as Record<string, unknown>;
  } else {
    const params = new URLSearchParams(raw);
    const keys = [...params.keys()];
    if (new Set(keys).size !== keys.length) throw { status: 400 };
    values = Object.fromEntries(params);
  }

  if (
    Object.keys(values).some(
      (key) => !["name", "email", "projectType", "message", "companyWebsite"].includes(key)
    )
  ) {
    throw { status: 400 };
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
  const config = options.config === undefined ? contactConfig() : options.config;
  if (!config) {
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
    return result(request, 403, {
      ok: false,
      message:
        "This request could not be verified. Open the contact page and try again.",
    });
  }

  const limiter = options.limiter ?? contactLimiter;
  const globalQuota = limiter.take([{ key: "global", limit: 30, windowMs: 3600000 }]);
  if (!globalQuota.allowed) {
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
    const status = (error as { status?: number }).status ?? 400;
    return result(request, status, {
      ok: false,
      message:
        status === 413
          ? "This inquiry is too large. Keep your message within 5,000 characters."
          : "The inquiry format could not be read. Please use the contact form.",
    });
  }

  if (typeof values.companyWebsite !== "string" || values.companyWebsite.trim()) {
    return result(request, 422, {
      ok: false,
      message:
        "This inquiry could not pass the spam check. No message was sent.",
    });
  }

  const { data, errors } = validateInquiry(values);
  if (Object.keys(errors).length) {
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

  try {
    await deliverInquiry(config, data, reference, options.fetchApi);
    return result(request, 200, {
      ok: true,
      reference: reference.slice(0, 16),
      message:
        "Your inquiry was accepted by our email provider for delivery. Inbox arrival is not yet confirmed.",
    });
  } catch (error) {
    if (error instanceof DeliveryError && error.status === 429) {
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
}
