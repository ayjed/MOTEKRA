import { beforeEach, expect, it } from "vitest";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { contactConfig, type ContactConfig } from "@/lib/contact/config";
import { validateInquiry } from "@/lib/contact/schema";
import { createContactLimiter } from "@/lib/contact/rate-limit";
import { handleContact } from "@/lib/contact/handler";

let config: ContactConfig, limiter: ReturnType<typeof createContactLimiter>;
const values = {
  name: "Test Person",
  email: "person@example.test",
  projectType: "web-development",
  message: "A synthetic inquiry for automated testing only.",
  companyWebsite: "",
};

beforeEach(() => {
  config = {
    origin: "https://example.test",
    allowedOrigins: ["https://example.test", "https://www.example.test"],
    apiKey: "re_synthetic_test_key",
    from: "sender@example.test",
    recipient: "private-recipient@example.test",
    trustProxy: false,
  };
  limiter = createContactLimiter();
});

function request(
  data: Record<string, unknown> = {},
  headers: Record<string, string> = {}
) {
  return new Request("https://example.test/api/contact", {
    method: "POST",
    headers: {
      origin: config.origin,
      accept: "application/json",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ ...values, ...data }),
  });
}

const accepted: typeof fetch = async () =>
  Response.json({ id: "synthetic-provider-id" });

it("validates fields and rejects email/header injection and unknown services", () => {
  expect(validateInquiry(values).errors).toEqual({});
  expect(
    Object.keys(
      validateInquiry({
        ...values,
        name: "a\r\nBcc: x",
        email: "x@example.test\r\nBcc:x@example.test",
        projectType: "invented",
        message: "short",
      }).errors
    )
  ).toHaveLength(4);
  expect(
    validateInquiry({ ...values, email: "a..b@example.test" }).errors.email
  ).toBeDefined();
});

it("requires explicit delivery enablement and private recipient/provider configuration", () => {
  expect(contactConfig({})).toBeNull();
  const env = {
    CONTACT_ORIGIN: "https://example.test",
    CONTACT_DELIVERY_ENABLED: "true",
    RESEND_API_KEY: config.apiKey,
    CONTACT_FROM: config.from,
    CONTACT_EMAIL: config.recipient,
  };
  expect(contactConfig(env)?.recipient).toBe(config.recipient);
  for (const override of [
    { CONTACT_DELIVERY_ENABLED: "false" },
    { CONTACT_EMAIL: "" },
    { RESEND_API_KEY: "" },
    { CONTACT_ORIGIN: "http://public.example.test" },
    { CONTACT_ORIGIN: "https://example.test/path" },
  ]) {
    expect(contactConfig({ ...env, ...override })).toBeNull();
  }
  expect(
    contactConfig({ ...env, CONTACT_ORIGIN: "http://127.0.0.1:3000" })
  ).not.toBeNull();
});

it("limits per warm instance and expires counters without any database", () => {
  expect(limiter.take([{ key: "test", limit: 1, windowMs: 1000 }], 100).allowed).toBe(true);
  expect(limiter.take([{ key: "test", limit: 1, windowMs: 1000 }], 101)).toEqual({
    allowed: false,
    retryAfter: 1,
  });
  expect(limiter.take([{ key: "test", limit: 1, windowMs: 1000 }], 1101).allowed).toBe(true);
  expect(
    createContactLimiter().take([{ key: "test", limit: 1, windowMs: 1000 }], 101).allowed
  ).toBe(true);
});

it("fails closed without config or same-origin request", async () => {
  let calls = 0;
  const fetchApi: typeof fetch = async () => {
    calls++;
    return accepted("");
  };
  expect((await handleContact(request(), { config: null, fetchApi, limiter })).status).toBe(503);
  expect(
    (await handleContact(request({}, { origin: "https://other.test" }), {
      config,
      fetchApi,
      limiter,
    })).status
  ).toBe(403);
  expect(
    (await handleContact(request({}, { "sec-fetch-site": "cross-site" }), {
      config,
      fetchApi,
      limiter,
    })).status
  ).toBe(403);
  expect(calls).toBe(0);
});

it("rejects malformed, oversized, duplicate-key and unsupported bodies", async () => {
  for (const [body, type, status] of [
    ["{", "application/json", 400],
    ["x".repeat(33000), "application/json", 413],
    ["name=a&name=b", "application/x-www-form-urlencoded", 400],
    ["text", "text/plain", 415],
  ] as const) {
    const response = await handleContact(
      new Request("https://example.test/api/contact", {
        method: "POST",
        headers: {
          origin: config.origin,
          accept: "application/json",
          "content-type": type,
        },
        body,
      }),
      { config, limiter }
    );
    expect(response.status).toBe(status);
  }
});

it("returns honeypot and field errors without contacting provider", async () => {
  let calls = 0;
  const fetchApi: typeof fetch = async () => {
    calls++;
    return accepted("");
  };
  expect(
    (await handleContact(request({ companyWebsite: "bot" }), {
      config,
      fetchApi,
      limiter,
    })).status
  ).toBe(422);
  const response = await handleContact(request({ message: "short" }), {
    config,
    fetchApi,
    limiter,
  });
  expect(response.status).toBe(422);
  expect((await response.json()).errors.message).toBeDefined();
  expect(calls).toBe(0);
});

it("passes a fixed private recipient, visitor Reply-To, HTML body and stable provider idempotency key", async () => {
  const captured: RequestInit[] = [];
  const fetchApi: typeof fetch = async (url, init) => {
    expect(url).toBe("https://api.resend.com/emails");
    captured.push(init!);
    return accepted("");
  };
  for (let i = 0; i < 2; i++) {
    const response = await handleContact(request(), { config, fetchApi, limiter });
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.message).toContain("Inbox arrival is not yet confirmed");
    expect(JSON.stringify(result)).not.toContain(config.recipient);
    expect(JSON.stringify(result)).not.toContain(config.apiKey);
  }
  const payload = JSON.parse(String(captured[0]!.body));
  expect(payload.to).toEqual([config.recipient]);
  expect(payload.reply_to).toBe(values.email);
  expect(payload.from).toBe(config.from);
  expect(payload.subject).toContain("Web Development");
  expect(payload.html).toContain("MOTEKRA");
  expect(payload.html).toContain("Test Person");
  expect(payload.text).toContain("Test Person");
  expect(captured[0]!.headers).toEqual(captured[1]!.headers);
  expect(new Headers(captured[0]!.headers).get("Idempotency-Key")).toMatch(
    /^motekra-inquiry\/[a-f0-9]{64}$/
  );
});

it("permits both apex and www origins while rejecting unauthorized origins", async () => {
  const apexConfig = contactConfig({
    CONTACT_ORIGIN: "https://motekra.com",
    CONTACT_DELIVERY_ENABLED: "true",
    RESEND_API_KEY: "re_synthetic_test_key_valid",
    CONTACT_FROM: "inquiries@motekra.com",
    CONTACT_EMAIL: "recipient@motekra.test",
  });
  expect(apexConfig).not.toBeNull();
  expect(apexConfig?.allowedOrigins).toContain("https://motekra.com");
  expect(apexConfig?.allowedOrigins).toContain("https://www.motekra.com");

  // Submit from apex origin
  const apexReq = new Request("https://motekra.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://motekra.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(values),
  });
  expect(
    (
      await handleContact(apexReq, {
        config: apexConfig,
        limiter: createContactLimiter(),
        fetchApi: accepted,
      })
    ).status
  ).toBe(200);

  // Submit from www origin
  const wwwReq = new Request("https://www.motekra.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://www.motekra.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(values),
  });
  expect(
    (
      await handleContact(wwwReq, {
        config: apexConfig,
        limiter: createContactLimiter(),
        fetchApi: accepted,
      })
    ).status
  ).toBe(200);

  // Submit from foreign / unauthorized origin
  const foreignReq = new Request("https://motekra.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://phishing-domain.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(values),
  });
  expect(
    (
      await handleContact(foreignReq, {
        config: apexConfig,
        limiter: createContactLimiter(),
        fetchApi: accepted,
      })
    ).status
  ).toBe(403);
});

it("never reports success for provider rejection, invalid response, timeout or exhausted quota", async () => {
  for (const [fetchApi, status] of [
    [async () => Response.json({ error: "denied" }, { status: 403 }), 502],
    [async () => Response.json({ error: "limit" }, { status: 429 }), 429],
    [async () => Response.json({}), 502],
    [
      async () => {
        throw Error("timeout");
      },
      502,
    ],
  ] as const) {
    const response = await handleContact(request(), {
      config,
      limiter: createContactLimiter(),
      fetchApi: fetchApi as typeof fetch,
    });
    expect(response.status).toBe(status);
    expect((await response.json()).ok).toBe(false);
  }
});

it("sets Retry-After and accepts a trusted proxy address only when explicitly enabled", async () => {
  for (let i = 0; i < 3; i++) {
    expect((await handleContact(request(), { config, limiter, fetchApi: accepted })).status).toBe(200);
  }
  const response = await handleContact(request(), { config, limiter, fetchApi: accepted });
  expect(response.status).toBe(429);
  expect(response.headers.get("retry-after")).toBeTruthy();
  expect(
    (
      await handleContact(request({ email: "other@example.test" }), {
        config: { ...config, trustProxy: true },
        limiter,
        fetchApi: accepted,
      })
    ).status
  ).toBe(503);
});

it("supports native HTML form errors and success without exposing recipient or reflecting input", async () => {
  const failed = await handleContact(
    request({ message: "secret short" }, { accept: "text/html" }),
    { config, limiter }
  );
  expect(failed.status).toBe(422);
  const html = await failed.text();
  expect(html).toContain("/contact#message");
  expect(html).not.toContain("secret short");
  expect(html).not.toContain(config.recipient);
  expect(failed.headers.get("cache-control")).toBe("no-store");

  const body = new URLSearchParams(values);
  const response = await handleContact(
    new Request("https://example.test/api/contact", {
      method: "POST",
      headers: {
        origin: config.origin,
        accept: "text/html",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
    }),
    { config, limiter, fetchApi: accepted }
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Inquiry status");
});

it("exercises real HTTP transport to a local provider stub for acceptance and rejection", async () => {
  const captures: unknown[] = [];
  const server = createServer(async (req, res) => {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const payload = JSON.parse(raw);
    captures.push({
      to: payload.to,
      reply_to: payload.reply_to,
      hasAuthorization: Boolean(req.headers.authorization),
      idempotency: req.headers["idempotency-key"],
    });
    res.setHeader("content-type", "application/json");
    if (payload.text.includes("REJECT_TEST")) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "Synthetic rejection" }));
    } else {
      res.end(JSON.stringify({ id: "local-provider-fixture" }));
    }
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const port = (server.address() as AddressInfo).port;
    const fetchApi: typeof fetch = (_url, init) => fetch(`http://127.0.0.1:${port}`, init);
    expect((await handleContact(request(), { config, limiter, fetchApi })).status).toBe(200);
    expect(
      (
        await handleContact(
          request({
            message: "REJECT_TEST — synthetic failure for a local transport fixture.",
          }),
          { config, limiter, fetchApi }
        )
      ).status
    ).toBe(502);
    expect(captures).toHaveLength(2);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

it("never derives the public receipt from the private recipient address", async () => {
  const first = await handleContact(request(), {
    config,
    limiter: createContactLimiter(),
    fetchApi: accepted,
  });
  const second = await handleContact(request(), {
    config: { ...config, recipient: "another-private-recipient@example.test" },
    limiter: createContactLimiter(),
    fetchApi: accepted,
  });
  expect((await first.json()).reference).toBe((await second.json()).reference);
});
