import { isEmail } from "./schema";

export interface ContactConfig {
  origin: string;
  allowedOrigins?: string[];
  apiKey: string;
  from: string;
  recipient: string;
  trustProxy: boolean;
}

export function contactConfig(
  env: Readonly<Record<string, string | undefined>> = process.env
): ContactConfig | null {
  try {
    const rawOrigin = env.CONTACT_ORIGIN ?? env.SITE_URL ?? "";
    const origin = new URL(rawOrigin);
    const local = ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname);

    if (
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash ||
      origin.username ||
      origin.password ||
      (origin.protocol !== "https:" && !(local && origin.protocol === "http:"))
    ) {
      return null;
    }

    const apiKey = env.RESEND_API_KEY ?? "";
    const from = env.CONTACT_FROM ?? "";
    const recipient = env.CONTACT_EMAIL ?? "";

    if (
      env.CONTACT_DELIVERY_ENABLED !== "true" ||
      !apiKey.startsWith("re_") ||
      apiKey.length < 10 ||
      !isEmail(from) ||
      !isEmail(recipient)
    ) {
      return null;
    }

    const allowed = new Set<string>();
    allowed.add(origin.origin);

    if (local) {
      allowed.add("http://localhost:3000");
      allowed.add("http://127.0.0.1:3000");
    } else {
      const isWww = origin.hostname.startsWith("www.");
      const apexHostname = isWww ? origin.hostname.slice(4) : origin.hostname;
      const wwwHostname = isWww ? origin.hostname : `www.${origin.hostname}`;
      const portPart = origin.port ? `:${origin.port}` : "";

      allowed.add(`${origin.protocol}//${apexHostname}${portPart}`);
      allowed.add(`${origin.protocol}//${wwwHostname}${portPart}`);
    }

    return {
      origin: origin.origin,
      allowedOrigins: Array.from(allowed),
      apiKey,
      from,
      recipient,
      trustProxy: env.CONTACT_TRUST_PROXY === "true",
    };
  } catch {
    return null;
  }
}
