# Temporary preview — 2026-10-26

- Public browser preview: https://administrators-planes-marilyn-alabama.trycloudflare.com
- Local preview on this computer: http://127.0.0.1:3000
- Existing production build runs on loopback port 3002. A temporary preview proxy on 3000 forwards it; no application source, content approval or production SEO setting was changed.
- All five main public routes returned HTTP 200 through the Cloudflare link. The pages retain noindex. This is a temporary review URL, not a release or an approved production domain.
- Keep this computer online and the preview processes running. The URL expires when the tunnel stops; a new tunnel produces another URL. No account, paid plan, domain purchase, Windows service installation or permanent hosting was configured.
- ChatGPT text-fetch access is **not verified**: the external web tool rejected the URL. Cloudflare inserts managed robots rules blocking ChatGPT-User/OAI-SearchBot alongside the preview's own allow rules. A public browser link is not a guarantee of access through ChatGPT's basic web reader. Use an actual browser-capable review session; reliable ordinary web-fetch access needs a host whose bot policy can be controlled.
- The fallback localhost.run tunnel was stopped. Its rotating URLs from commentary are obsolete. Cloudflare API DNS connectivity required a temporary loopback CONNECT relay to its reachable published address; TLS remains end-to-end. Helpers are in the system temp directory, not in site source or deployment output.
- Preview process sessions at handoff: Next 18981, preview proxy 39468, API connection relay 41705, Cloudflare 58185. These are tool session identifiers for cleanup, not credentials. Stop the tunnel and owned preview processes when review is finished. Do not stop unrelated Node/Chrome processes.

Phase 09 performance/manual acceptance and all existing content/contact/domain gates remain open. Contact delivery is still unconfigured; the personal inbox is not exposed.
