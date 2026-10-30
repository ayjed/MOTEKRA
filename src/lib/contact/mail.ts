import type { ContactConfig } from "./config";
import type { Inquiry } from "./schema";

export class DeliveryError extends Error {
  constructor(
    public status: number,
    public providerCode?: string,
    message?: string
  ) {
    super(message ?? `Email provider rejected delivery with status ${status}`);
    this.name = "DeliveryError";
  }
}

export const projectTypeLabels: Record<string, string> = {
  "ui-ux-design": "UI/UX Design",
  "web-development": "Web Development",
  "mobile-app-development": "Mobile App Development",
  "product-strategy": "Product Strategy",
  "brand-visual-design": "Brand & Visual Design",
  "not-sure": "General / Exploratory Inquiry",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]!));
}

export function formatInquiryEmail(
  data: Inquiry,
  reference: string
): { subject: string; text: string; html: string } {
  const serviceLabel = projectTypeLabels[data.projectType] ?? data.projectType;
  const subject = `MOTEKRA Inquiry — ${serviceLabel} from ${data.name}`;
  const shortRef = reference.slice(0, 16);

  const text = [
    `MOTEKRA WEBSITE INQUIRY`,
    `Reference: ${reference}`,
    ``,
    `Name: ${data.name}`,
    `Reply Email: ${data.email}`,
    `Project Area: ${serviceLabel}`,
    ``,
    `Message:`,
    data.message,
    ``,
    `---`,
    `Delivered securely via MOTEKRA (https://motekra.com)`,
  ].join("\n");

  const escapedName = escapeHtml(data.name);
  const escapedEmail = escapeHtml(data.email);
  const escapedService = escapeHtml(serviceLabel);
  const escapedMessage = escapeHtml(data.message).replace(/\n/g, "<br />");
  const escapedRef = escapeHtml(shortRef);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #050508; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f4; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #0e0f14; border: 1px solid #232530; border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #13151f 0%, #0a0b10 100%); border-bottom: 1px solid #232530;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <span style="font-size: 20px; font-weight: 800; letter-spacing: 0.12em; color: #ffffff; text-transform: uppercase;">MOTEKRA</span>
              <p style="margin: 4px 0 0; font-size: 13px; color: #7f8699; letter-spacing: 0.04em;">Production Inquiry Dispatch</p>
            </td>
            <td align="right">
              <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-family: monospace; color: #00e5ff; background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 6px;">#${escapedRef}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="padding: 8px 0; color: #8e95a5; width: 120px; vertical-align: top;">From:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600; vertical-align: top;">
              ${escapedName} &lt;<a href="mailto:${escapedEmail}" style="color: #00e5ff; text-decoration: none;">${escapedEmail}</a>&gt;
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8e95a5; vertical-align: top;">Project Area:</td>
            <td style="padding: 8px 0; color: #e2e4ea; vertical-align: top;">
              <span style="display: inline-block; padding: 2px 8px; font-size: 12px; font-weight: 500; color: #f0f0f4; background: #1a1c26; border: 1px solid #2c2f3f; border-radius: 4px;">${escapedService}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 32px 28px;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #697082; margin-bottom: 10px;">Message</div>
        <div style="padding: 20px; background-color: #141620; border: 1px solid #232634; border-radius: 8px; font-size: 15px; line-height: 1.65; color: #f0f0f4; word-break: break-word;">
          ${escapedMessage}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 32px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #00e5ff;">
              <a href="mailto:${escapedEmail}?subject=Re:%20MOTEKRA%20Inquiry%20%E2%80%94%20${encodeURIComponent(serviceLabel)}" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 700; color: #050508; text-decoration: none; border-radius: 6px;">
                Reply Directly to ${escapedName} &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #090a0e; border-top: 1px solid #1c1d26; font-size: 12px; color: #585e70; text-align: center;">
        Inquiry submitted via <a href="https://motekra.com/contact" style="color: #7f8699; text-decoration: none;">motekra.com/contact</a> &bull; Reference ID: ${escapeHtml(reference)}
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

export async function deliverInquiry(
  config: ContactConfig,
  data: Inquiry,
  reference: string,
  fetchApi: typeof fetch = fetch
) {
  const { subject, text, html } = formatInquiryEmail(data, reference);

  // Cloudflare Workers workerd compatibility:
  // Do NOT pass `redirect: "error"` — workerd explicitly forbids "error" and throws TypeError.
  // Standard "follow" or omitting redirect allows normal edge HTTPS traversal.
  const response = await fetchApi("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `motekra-inquiry/${reference}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.recipient],
      reply_to: data.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    let providerCode = "provider_error";
    try {
      const errPayload: unknown = await response.json();
      if (errPayload && typeof errPayload === "object") {
        const payloadRecord = errPayload as Record<string, unknown>;
        if (typeof payloadRecord["name"] === "string") {
          providerCode = payloadRecord["name"];
        } else if (typeof payloadRecord["message"] === "string") {
          const clean = payloadRecord["message"]
            .replace(/[^a-zA-Z0-9_]/g, "_")
            .slice(0, 32);
          if (clean) providerCode = clean;
        }
      }
    } catch {
      // Body was not JSON
    }
    throw new DeliveryError(response.status, providerCode);
  }

  const payload: unknown = await response.json();
  if (
    !payload ||
    typeof payload !== "object" ||
    !("id" in payload) ||
    typeof payload.id !== "string" ||
    !payload.id
  ) {
    throw new DeliveryError(502, "malformed_provider_payload");
  }
}
