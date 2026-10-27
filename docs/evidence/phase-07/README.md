# Phase 07 — Contact and static-first architecture

2026-10-26 · Local implementation/review. The owner explicitly clarified static-first architecture and a private personal Gmail recipient during this phase. No external account, email, subscription or deployment was created. Phase 08 has not started.

## Result

`/contact` uses the approved Design 02 composition: kinetic “Have Something in Mind?”, an assembling/pointer-responsive cyan-blue R3F message sculpture, a code-native mobile/reduced/error poster, inquiry panel, honest contact availability, founder profile links, six native FAQs and a responsive closing CTA. No personal email, phone, address, response-time promise or invented business fact is published. All essential text/fields/links exist in static HTML.

The form validates name/email/proposed project area/message, focuses an accessible linked error summary, locks pending submissions and preserves input on failure. Native HTML POST works without JavaScript. Provider acceptance, configuration failure, validation, honeypot, quota, network and rejection states remain distinct. Success means provider acceptance, explicitly not confirmed inbox arrival. Success/error evidence uses synthetic UI simulations.

The permitted minimal `/api/contact` endpoint uses native fetch to the proposed Resend Free service. `CONTACT_EMAIL`, API key and sender remain server-only. A blank, ignored `.env.local` and documented `.env.example` are prepared; the actual Gmail address/API key have not been supplied. Same-origin checks, bounded input, honeypot, best-effort per-instance quotas, provider idempotency and timeout/error handling are implemented. No database, SMTP dependencies, authentication, dashboard, CMS or traditional backend remains. Persistent/distributed quotas are not claimed. See `CONTACT_SETUP.md` for current official references, sender restrictions and configuration.

All five main pages are SSG. Work filtering now enhances one statically rendered collection, maintaining URL/history and keyboard focus; unverified company/founder filters stay empty. Runtime draft-case/evidence image routes were retired under the new architecture instruction. Approved case routes use build-time params; candidate assets/data and historical Phase 04 review evidence are retained outside public assets. The motion lab is build-time gated. Runtime image optimization is disabled for prepared local images. `/api/contact` is the only dynamic feature in the build table.

## Verified evidence

- Typecheck, lint, 47 unit tests (including 11 contact tests) and production build pass; `docs/evidence/phase-07/validation.txt`.
- Two additional public HTML/draft-route regressions pass.
- Nine Contact/static-Work browser tests pass: five widths (1440/1024/768/390/320), semantic fields, keyboard FAQs/summary/focus, pending/success/rejection UI, live reduced motion, forced WebGL failure, no JavaScript, public 404 boundaries and static URL filters/history.
- Four expanded WCAG axe reports (1440/390 Contact + accepted/error states) have zero violations. A full assistive-technology audit remains separate.
- Provider contract tests cover actual HTTP requests to a local synthetic provider fixture for acceptance/rejection; other cases include malformed response, timeout and rate exhaustion. They do not contact Resend or prove inbox receipt.
- The SSG manifest confirms all five main pages. A scan of 28 public JS chunks found no `CONTACT_EMAIL`, `RESEND_API_KEY` or synthetic secret/recipient markers. No mailto is exposed.
- Desktop R3F reaches ready with one canvas and pauses offscreen. Mobile/reduced motion retains the poster; forced WebGL failure is usable. Owned textures/geometries/timelines/listeners clean up. The recorded walkthrough is playback-verified; screenshot/video review corrected envelope fold geometry that initially obscured the message.
- Mobile Lighthouse: performance 80, accessibility 100, best practices 100, SEO 66 (intentional noindex), FCP 2.7 s, LCP 3.7 s, TBT 140 ms, CLS 0; no run warnings. One local simulated run, not a field CWV or performance acceptance pass. The geometry refinement is desktop-only and does not alter mobile policy.

The 19.96-second, 1440 × 960 walkthrough and 20 PNG captures are saved. The local gallery at `docs/evidence/phase-07/index.html` includes desktop/mobile layouts, real 3D and static fallbacks, simulated status states and the recorded walkthrough. Static captures, live recording and an extracted frame were visually inspected. Refer to `video-playback.json` for final duration and `artifact-manifest.json` for hashes.

## Open gates

Actual Gmail value in private `CONTACT_EMAIL`, owner-controlled provider credentials/account, permitted From sender, real staging/production origin, a received inbox test and Reply-To confirmation remain pending. No actual delivery is marked complete. Rate limits reset across cold starts/instances; host-level abuse protection and free-plan quotas need review before enabling public sending. No paid service/storage is introduced to address that limit. Privacy/legal copy matched to the chosen provider and host remains pending. Performance acceptance, previous content/portrait/project approvals and owner review remain open. Phase 08/release has not started.
