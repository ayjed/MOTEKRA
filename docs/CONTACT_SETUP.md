# Contact delivery — minimal serverless configuration

2026-10-26 · Actual delivery is **pending**. No recipient address, provider account or API key has been supplied/verified. No test email has reached the owner's inbox. Local tests use synthetic addresses and a local HTTP provider fixture or browser-response simulation.

## Architecture and cost

The five primary routes are SSG. Content remains in local TypeScript collections (MDX may be introduced for genuinely edited articles). No database, SMTP server, authentication, admin dashboard or CMS is used. `/api/contact` is the only request-time feature: GET returns availability only; POST validates and requests email delivery. It is suitable for a minimal Node serverless function on a compatible Next.js host. Application code does not persist inquiries or recipient addresses.

Resend's Free plan is the proposed provider: the [official pricing page](https://resend.com/pricing), checked 2026-10-26, lists 3,000 emails/month and 100/day. No account, paid plan, add-on or overage setting is created or enabled. Recheck terms/quotas when setting up the actual account. The adapter uses native fetch, so no email SDK or SMTP dependency is installed.

Resend's test sender can send only to the account owner's email; see [sender restrictions](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain). A test sender is not a verified MOTEKRA business mailbox. Use a permitted sender and verify the real deployment domain as required before public launch. Never use a visitor's address or an unverified personal Gmail as the From sender. The visitor is `reply_to`, supported by the [Send Email API](https://resend.com/docs/api-reference/emails/send-email).

A fully static host cannot run this endpoint. For that option, select and configure a hosted form service or deploy this one minimal endpoint separately, then adapt the form target and exact-origin allowlist. That alternative is not configured or claimed tested here. No static-only deployment is silently selected; the current Next build is static-first with one function. The runtime image optimizer is disabled; images are prepared locally. Static host headers/redirects still need host-specific configuration.

## Local secrets

An ignored `.env.local` has blank settings; `.env.example` documents the keys. Fill values locally, never in frontend source or a `NEXT_PUBLIC_` variable:

```dotenv
CONTACT_EMAIL=
RESEND_API_KEY=
CONTACT_FROM=
CONTACT_ORIGIN=
CONTACT_DELIVERY_ENABLED=false
CONTACT_TRUST_PROXY=false
```

- `CONTACT_EMAIL`: the owner's personal Gmail inbox, kept private. It is not published, serialized into page props, returned by the API or added to metadata. The actual address is still missing; no address was invented. The provider receives it solely as the fixed server-side `to` recipient.
- `RESEND_API_KEY`: a sending API key stored only in serverless environment settings / ignored `.env.local`.
- `CONTACT_FROM`: an email address the provider permits for the account. It must not be derived from form input.
- `CONTACT_ORIGIN`: exact site origin, without path/query/credentials. HTTPS is required except loopback HTTP for local testing. Set the real staging/production origin at deployment.
- `CONTACT_DELIVERY_ENABLED`: leave false until the above values are intentionally configured. True enables transport attempts, not proof of inbox delivery. Availability is fetched at runtime by the form; static page content remains SSG.
- `CONTACT_TRUST_PROXY`: enable only when the host/proxy strips and replaces untrusted `X-Forwarded-For`. Otherwise client-provided IP headers are ignored.

Do not display the personal recipient as a public contact alternative. Phone, office address and response-time commitments remain unpublished.

## Validation, spam controls and limits

Client and server validate name (2–100), email, the five proposed project areas plus Not sure, and message (20–5,000). The endpoint accepts bounded JSON or native URL-encoded forms; rejects malformed/duplicate/unsupported fields, control/header injection and bodies over 32 KiB. Only same-origin browser submissions are accepted. Honeypot matches return a real rejection, never fake success.

Best-effort in-process quotas: 30 requests/hour per warm instance, three valid requests/hour per email hash, and five/15 minutes per trusted IP hash when configured. Counters are bounded by the global quota and expire; no database is introduced. **These are not durable or distributed limits**: cold starts and multiple instances reset/separate them. Provider quotas and suitable host-level abuse limits must be reviewed at launch. Do not describe this as complete distributed spam protection or provision paid storage to solve it without a real need.

Provider requests have a 12-second timeout, fixed HTTPS endpoint and no redirects. A stable content-derived [idempotency key](https://resend.com/docs/dashboard/emails/idempotency-keys) lets the provider deduplicate identical retries for 24 hours without a database. Changing the message creates a different request. The app does not automatically retry ambiguous delivery failures.

Success requires an OK provider response containing an email ID. The UI says accepted for delivery and explicitly distinguishes inbox arrival. Rejection, provider quota, bad configuration, network/timeout and malformed provider responses never claim success. Field errors focus a linked summary; entered text is retained on failure. Without JavaScript, native POST opens an accessible HTML outcome/error page. The static form remains visible and readable with all motion/WebGL disabled.

The app has no inquiry database and does not write inquiry bodies to its logs. The provider and recipient email service process/store the message under their policies. A real privacy policy matched to the eventual deployment still needs approval; no legal assurance is fabricated.

## Before marking real delivery complete

1. Owner fills the private Gmail recipient and provider credentials, chooses a permitted sender and exact origin, then intentionally enables delivery.
2. Send a clearly labelled test inquiry through the deployed form. Confirm it arrived in the intended Gmail inbox, check spam and Reply-To by replying, and inspect provider delivery/bounce status.
3. Exercise an actual rejected request and unavailable/quota states without exposing credentials. Confirm failed submissions keep their text and cannot report success.
4. Review host-level abuse controls and current free-plan quotas. Leave paid upgrades/overages disabled.
5. Record recipient-arrival evidence without revealing the personal address or message in public QA artifacts. Only then update the delivery gate.

`pnpm test:contact-delivery` verifies the transport contract with local fixtures, not a real Resend account or inbox. `pnpm test:contact` verifies the UI, accessibility and static Work regression. Deployment and real delivery remain owner-configuration gates.
