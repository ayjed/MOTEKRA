# Phase 09 — engineering and QA checkpoint

2026-10-26. **Open / not accepted.** The user interrupted the active run. The 24-route profiler finished before cleanup; the owned production preview was stopped. No release phase or deployment was started.

## Implemented

Shared media-query subscriptions; near-viewport GSAP scope initialization with a setup queue; separate Home section ownership; hidden-timeline pause and live reduced-motion cleanup; compositor hero typography coordinated by GSAP; stable hero supporting copy; asynchronous Motion features; fine-pointer-only nearby tactile controllers; native drawer close fallback; one route announcement; disabled speculative Link prefetch. Server content and ordinary navigation remain available independently of animation.

High scene DPR is reduced from 1.5 to 1.25 (about 31% fewer drawing pixels at the same CSS size), balanced remains 1. Rounded geometry is reduced, balanced UI textures are smaller, and flat UI textures no longer generate mip chains. Scene initialization waits for initial paint/idle opportunity. Posters, conditional capability checks, demand rendering and hidden/offscreen controls remain in place. This does not eliminate all startup long tasks.

Contact receipt hashes no longer incorporate the private recipient. No new infrastructure, dependency, paid plan or content claim was introduced. See `PHASE_09_SECURITY_REVIEW.md` and `PERFORMANCE_BUDGETS.md`.

## Verified evidence

- `evidence/phase-09/validation.txt`: strict typecheck, lint, 55 unit tests and production build pass. All main routes remain static; contact is the only dynamic endpoint. `final-lint.txt` also passes after audit tooling edits.
- `evidence/phase-09/playwright-results.json`: **43 passed, zero failed/skipped/flaky**, 10.6 minutes. Includes route/form/filter/history checks, keyboard skip/focus trap/Escape, 320px touch, no JavaScript, live reduced motion, WebGL failure/context loss and route-back cleanup.
- `axe-all-*.json`: **24 full axe audits**, 12 routes at 1440/390, zero violations. Additional page regression audits pass. Automated checks do not certify WCAG conformance.
- `contact-accessibility-tree.json`: Chromium AX names/required fields inspected. Duplicate route announcement removed. This is not a real screen-reader speech test.
- `dependency-audit-final.json`: zero known advisories across all severity levels at capture. No absence-of-vulnerability guarantee.
- `after-profile.json`: **24 completed profiles**, 12 routes × desktop/mobile. Local GSAP ownership/target/init times, long tasks, Event Timing samples, shifts, RAF samples, resources and WebGL counts are retained. No disconnected trigger owners were reported where profiling was initialized.
- Ten `final-*.report.html/json` Lighthouse reports completed serially. No browser regression or build workload ran alongside them. All five mobile reports flag the host CPU as slower than Lighthouse expects.
- Refreshed screenshots and Home/Services recordings are in `evidence/phase-09/regression/`. Recordings were captured by passing tests, but final playback/viewport review was not completed. A tall Home screenshot showed a repeated compositor strip during inspection; do not use it as final visual acceptance. The prepared viewport/orientation script has not run.

## Lighthouse results

| Route | Mobile score | Mobile LCP | Mobile TBT | Desktop score | Desktop LCP | Desktop TBT |
|---|---:|---:|---:|---:|---:|---:|
| Home | 63 | 3.74 s | 819 ms | 60 | 0.96 s | 1,694 ms |
| Work | 73 | 3.55 s | 693 ms | 99 | 0.87 s | 47 ms |
| Services | 71 | 3.33 s | 851 ms | 98 | 0.89 s | 53 ms |
| About | 74 | 3.62 s | 621 ms | 98 | 0.90 s | 58 ms |
| Contact | 64 | 4.12 s | 818 ms | 62 | 1.03 s | 2,080 ms |

Accessibility/best-practices scores are 100 on these ten reports. SEO is 66 because this is deliberately a noindex preview, not an approved deployed origin. CLS is zero except Contact: approximately 0.000075 mobile / 0.00326 desktop. These are lab observations, not field p75 CWV.

The independent 4× CPU, 1.6 Mbps/100 ms mobile profile was substantially worse: LCP **3.58–8.46 s**, maximum initial tasks **1.42–3.82 s**, sampled maximum interaction duration **720–1,848 ms**. These Event Timing samples are **not field INP**. Mobile Home median RAF callback rate was approximately **20/s**, with p95 interval about **666 ms**. Other mobile medians were approximately 60/s but p95 intervals were 50–316 ms; a favorable median conceals stalls. Desktop medians were approximately 60/s with p95 intervals 17–633 ms. Desktop Home initial LCP was not captured in that profiler window; use its separate Lighthouse report, not a fabricated zero.

Software WebGL scene counters: hero 10 draws / 6,504 triangles per clear (baseline 7,080 triangles); mobile flow 6 / 3,444; Contact 5 / 2,729. These meet scene geometry/draw budgets but do not establish GPU time, VRAM, physical presentation FPS or acceptable startup cost. Baseline and intermediate failed measurements remain saved; no reliable aggregate speedup is claimed across changing host conditions.

## Remaining work / acceptance gates

1. Fix remaining mobile main-thread/interaction stalls and desktop Home/Contact 3D startup blocking. LCP/INP/long-task acceptance is **not met**. Inspect saved startup/event/resource/GSAP timing rather than treating every delay as animation work. Re-profile on a calibrated host and a real mid-range phone; do not dismiss failures solely because a CPU warning exists.
2. Run `scene-lifecycle.mjs` to complete per-family high/balanced idle/hidden/offscreen draw and disposal evidence. The shared lifecycle browser tests passed, but the six-scene instrumented memory/disposal matrix has **not run**. Approximate authored texture bytes in budgets are estimates, not measured VRAM.
3. Run `viewport-quality.mjs`, inspect actual viewport captures/orientation, decode/review final recordings and resolve the tall-screenshot compositor artifact before visual acceptance. Scripts were prepared, not executed.
4. Rerun `seo-audit.mjs preview` into Phase 09 evidence. Current server-HTML regression tests pass and Phase 08 audit evidence is preserved, but the standalone Phase 09 audit was **not run**.
5. Real screen-reader speech acceptance is unverified: Windows Computer Use stopped before Narrator launch because it could not determine the browser URL confidently enough to enforce policy. The guard was not bypassed. Actual touch-device and field p75 INP/LCP/CLS verification also remain unavailable.
6. Existing domain/content/portrait/project permissions/service approval/private contact delivery/host abuse/CSP/privacy gates remain open. Performance work does not approve publication facts.

`summarize-quality.mjs` requires the unrun lifecycle matrix, so the combined summary/gallery has not been generated. Phase 09 must remain open; do not advance to Phase 10 from this checkpoint.

Implementation references: [R3F demand rendering/scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Motion LazyMotion](https://motion.dev/docs/react-lazy-motion), [INP measurement definition](https://web.dev/articles/inp).

## Later live design-review checkpoint — 2026-10-26

The unfinished audit tasks above describe the interrupted checkpoint. Subsequent owner-requested review completed ten main-page desktop/mobile viewport captures, three emulated orientation/navigation checks, six scene lifecycle cases, a fresh 12-route/15-link/six-404 no-JS HTML audit and selected recording-frame inspection. `metrics-summary.json` is now generated. All settled-idle/hidden scene draw deltas are zero; two offscreen cases recorded one extra scene frame. All unmounted contexts were lost; raw remaining resource counters are not measured VRAM or automatic proof of a leak.

The tall-screenshot repeated-strip artifact did not reproduce in actual viewport captures. A suspected cold process-anchor jump did not reproduce in three widths. A **late headline replay** did reproduce in recorded frames: fully visible at 1–2 s, hidden around 3 s when delayed intro starts, then restored. Device poster/live framing and UI mismatch, scene fidelity, short-viewport demo layout and existing performance/content/delivery gates require correction.

See `DESIGN_IMPLEMENTATION_REVIEW.md`, `CODEX_CORRECTION_PROMPT.md` and `evidence/design-review/index.html`. No application implementation was changed in this review. Physical-device performance and real screen-reader speech remain unverified. Phase 09 remains OPEN; this is not permission for Phase 10 or release.
