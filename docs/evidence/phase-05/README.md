# Phase 05 — Services evidence

2026-10-25 · Local production build. No deployment, paid dependency or confirmed commercial offering.

## Validation

- `build.txt`, `typecheck.txt`, `lint.txt`, `unit-tests.txt`: production build, strict TypeScript, ESLint and **33 unit tests**.
- `playwright-results.json`: **nine passing Services tests** covering six initial-HTML routes/metadata; five keyboard transformations; optional R3F state/offscreen/hidden/context-loss behavior; live reduced motion and mobile canvas removal; responsive layouts; no-JS/low-memory fallback; twelve axe audits; shared Home scene/navigation regression; recorded walkthrough.
- `foundation-results.json`: two additional public HTML and unknown-detail 404 regression tests.
- Twelve `axe-*.json` files audit the landing and five details at **1440px and 390px**, with WCAG A/AA tags including WCAG 2.1 A label matching. **Zero violations** in the final runs. This does not certify WCAG conformance or replace assistive-technology testing.
- `services-server.html` and five detail `*-server.html` files contain real served production HTML. Headings, descriptions, potential deliverables, methods, FAQs, links and CTAs are present without animation/WebGL. Unsupported active Service schema is absent.
- `metadata-audit.json`, `html-audit.json`, `internal-links.json`, `prototype-states.json`: distinct detail titles, semantic heading/main inventory, real link statuses and observed CSS before/after states.
- Gallery captures cover **1440 / 1024 / 768 / 390 / 320**, all five chapter interfaces, five detail heroes at desktop/mobile, native FAQ/no-JS states, reduced motion and graphics fallback. Process/scope captures verify retained page sections. `cta-320-audit.json` and the longest-name CTA capture verify actual button bounds at 320px.
- `services-walkthrough.webm`, `video-playback.json`, `visual-refinement-results.json`: a desktop walkthrough of all five native transformations and an optional real R3F explore/detail change, with a separate recording check and Chrome decode/playback validation.
- `artifact-manifest.json` fingerprints root evidence artifacts. `video-frames/` contains extracted frames for visual QA.

## Default-page performance

Lighthouse simulated mobile, default `/services` with **WebGL not enabled**: **64 performance**, **100 accessibility**, **100 best practices**, **66 SEO**. FCP **1.6 s**, LCP **3.6 s**, total blocking time **1,300 ms**, CLS **0**, transferred resources **350 KiB**. The report warns that the host CPU is slower than Lighthouse expects. SEO 66 reflects the intentional preview noindex policy.

**Performance is not signed off.** Mobile LCP and main-thread execution remain optimization priorities. A single local run is not a field/p75 Core Web Vitals result. Optional 3D is tested separately with software WebGL, not represented by the default mobile score. No hardware GPU memory, battery or real handset FPS measurement is claimed. Prior Home/Work performance gaps remain open.

## Behavior and limits

All five native details controls work without JavaScript. CSS perspective is part of the visual design; transitions are disabled for reduced motion. The real 3D mobile-flow module is a dynamic import, enabled only by user choice on eligible devices. It uses the shared mobile/reduced/data-saving/low-capability poster policy, demand rendering, bounded/adaptive DPR and hidden/offscreen pause. Only one optional canvas exists on Services; no canvas is mounted by default. The shared Home device scene still works after the wrapper extension.

Initial QA corrected an HTML-escaping test expectation and a text selector that included a decorative arrow. A visibility assertion originally targeted a section already on screen; it now navigates clearly past the scene. One small roadmap caption needed stronger contrast. The existing five-step process section was restored before the final build. No accessibility rule was disabled.

Recording review also caught a brief poster/canvas overlap while the renderer warmed up. The canvas now stays invisible until readiness, and a browser mutation observer checks that both visual layers are never visible together. The shared Home regression still passes. Final small-screen review added room around headline descenders and adjusted type scales to keep “End-to-end” on one line; `visual-refinement-results.json` records the focused responsive/recording recheck after that CSS change.

All services, deliverables and methods are proposed. Active scope/availability need owner confirmation. No related client case is fabricated: explicit approved project/service association and display permission are required. Candidate project roles/status/permissions, original portrait, contact delivery/domain and release gates remain unresolved. Phase 06 has not started.


Final review: 45 captures; walkthrough 1440×960 / 27.32 seconds, decoded and played in Chrome without error. Four extracted frames at 4.10, 12.29, 19.12 and 24.59 seconds were visually inspected; the mobile frame shows one pair of phones after the corrected readiness handoff. The full nine-test report and focused two-test visual refinement report are retained separately. An intermediate recording report is also retained for provenance.


