# Phase 02 — shared cinematic architecture

2026-10-25 · Owner: Codex · Local implementation; no deployment, paid service or new client content. Review checkpoint required before Phase 03.

## 1. Completed features

- Installed GSAP 3.15.0, React Three Fiber 9.8.2, Drei 10.7.9, Three 0.186.1 and Motion 14.6.0. Lockfile preserves the resolved versions; the existing strict Next.js/TypeScript setup remains.
- `SplitHeading` builds semantic heading/line markup on the server. `Reveal` supplies line masks, perspective image masks and directional staggers. Content is visible before JavaScript; entrances begin on actual viewport entry and temporary styles are cleared at completion.
- `useGsapScope` owns asynchronous imports, cancellation guards, scoped contexts, matchMedia, font-ready refresh and visibility listeners. Returned cleanup, nested contexts, tweens, observers and media subscriptions are reverted on teardown. It never calls global `killAll`.
- `HeroHandoff` provides a native-scroll, desktop visual reframe with a connective energy line. It does not pin, intercept wheel/touch or transform the semantic heading. Smaller/reduced-motion layouts stay static.
- Motion owns bounded magnetic links, pointer tilt, hover/focus preview overlays and a brief incoming route treatment. GSAP and Motion use separate nested nodes rather than competing for the same transform. Keyboard focus recenters pointer effects; previews have a focus equivalent and keep essential descriptions in ordinary HTML.
- Shared navigation now has exact/nested active-route indicators, staggered entry and a 90vw × 100dvh mobile drawer. A native modal dialog plus explicit boundary wrapping traps Tab/Shift+Tab; Escape, close button and backdrop close it; focus returns to the trigger. Route changes unmount it and restore body scroll. The original native disclosure remains the no-JavaScript fallback.
- Route enhancement preserves normal Next links, browser back and scroll restoration; main receives focus without a forced scroll and page titles are announced politely. It does not defer payloads or retain a stale client-side page tree.
- Footer retains the original mark and semantic links; the enhanced Back to top anchor honors reduced motion and restores focus to the header brand. Native anchor behavior remains available without JavaScript.
- The supplied brand raster is unchanged. No logo geometry, founder portrait, case study, client result, personal identity or statistic was invented.

## 2. Optional product scene and private lab

`SceneBoundary` accepts server-rendered poster content. It observes proximity and visibility, checks capability policy, probes WebGL only on eligible devices, then dynamically imports the R3F scene with SSR disabled. The poster remains until the current canvas instance renders; it returns for unsupported WebGL, renderer/import errors or context loss. Switching to a poster or another quality tier disposes the previous scene and does not reuse stale readiness.

The fallback currently uses the semantic CSS device poster from Phase 01, not an exported raster asset. That keeps it visible without JavaScript and avoids inventing a production screenshot. Final authored poster/video assets can replace this slot in Phase 03 without changing the content or fallback contract.

The procedural laptop/phone scene uses meaningful, explicitly conceptual interface screens. Viewport-aware bounds fit the camera on resize so both devices remain in view at tablet aspect ratios; the poster waits for the fit frames. Keyboard-accessible external controls switch the interface state or force the static visual. No navigation or business copy lives only in canvas. Textures, renderer event listeners and R3F-owned geometry/material resources are cleaned on teardown.

Policy: reduced motion, width below 768px, data-saving, memory hints at/below 2 GB or CPU hints at/below two cores select the poster. Eligible desktop uses balanced DPR 1 or high DPR 1.5, with adaptive interaction DPR. The scene renders on demand and settles; offscreen or hidden scenes use a stopped frame loop. Capability hints are heuristics, not a claim that all weak GPUs have been measured.

`/motion-lab` is an isolated evaluation page with no client project content. It returns an actual HTTP 404 unless `MOTION_LAB_ENABLED=true`, is always noindex and is absent from navigation/sitemap. Enable only on a loopback/controlled preview: this environment flag is not authentication. `.env.example` leaves it disabled. No hosted/private Site or external account was created.

Lenis and Rive are intentionally absent. Native scrolling already satisfies the interaction; another scrolling runtime is not justified.

## 3. Working effects versus remaining production work

Working in the lab: line entrances, image surface masks, directional staggers, pointer device depth, stateful product UI, hover/focus previews, magnetic links, scroll-driven visual handoff and energy line. Working across the shell: navigation entry/active indicator, modal drawer, incoming route transition, focus/title management and enhanced scroll-to-top.

Phase 03 still owns the authentic-logo hero assembly, final cinematic Home typography/device choreography, production hero-to-portfolio handoff and full eight-section animation composition. Real portfolio imagery/roles, founder identity and service confirmation remain owner inputs. The demo is not a claim that the final Home, case studies or service narratives are complete.

## 4. SEO, accessibility and performance evidence

- Server-generated headings, text and anchors remain in the response. Primary pages and the lab are exercised with JavaScript disabled. No universal opacity-zero style hides content pending hydration.
- A regression exposed the root App Router loading boundary putting Home inside a hidden streamed swap fragment. The loading UI was moved to `components/layout/loading-state.tsx` for optional visual-only use. Essential content now renders without that global Suspense fallback; the final no-JavaScript public-page test passes. Do not reintroduce a root loading boundary over essential business text without this check.
- Completed reveal styles are cleared, offscreen text is not pre-hidden, and 3D perspective is reserved for image/depth wrappers. A dedicated hero viewport capture and heading-style audit complement full-page captures.
- Production tests verify live reduced-motion reversion, no canvas on mobile/low-memory/no-WebGL modes, synthetic document-visibility pause, offscreen pause, context-loss fallback, quality-tier changes, poster toggling, keyboard previews, drawer focus/escape and active navigation/back behavior.
- Three lab/work/back roundtrips leave zero owned scroll triggers outside the lab and restore the same baseline on return. A separate development-server check repeats this under React Strict Mode; its clean result is in `strict-mode-final.json`.
- The public regression checks all five pages at 1440/1024/768/390/320, real 404s, meaningful HTML, metadata/security headers, skip navigation and native no-JavaScript navigation. Drawer width is additionally checked at 320px and 767px.
- Browser QA uses installed Chrome with software-WebGL flags for reproducibility. The recording is a demonstration, not an observed GPU FPS or Web Vitals benchmark. Real-device GPU/memory/FPS, Lighthouse, axe and assistive-technology certification remain Phase 09. The visibility test dispatches the browser visibility event with a controlled hidden value; real OS/tab behavior still belongs in device QA.

## 5. Verification and artifacts

All paths below are under `docs/evidence/phase-02/`:

| Check | Evidence |
|---|---|
| Production build | `build.txt` — pass, all requested route patterns plus gated lab |
| Strict typecheck | `typecheck.txt` — pass |
| ESLint | `lint.txt` — pass, no errors/warnings |
| Unit safeguards | `unit-tests.txt` — 26 tests pass across three files |
| Production motion suite | `motion-tests.txt`, `playwright-results.json` — eight browser tests, including recording |
| Public-page regression | `foundation-regression.txt`, `regression/foundation-results.json` — five tests pass, with 27 responsive/fallback captures |
| Development Strict Mode | `strict-mode-final.txt`, `strict-mode-final.json` — route/lifecycle test passes |
| Disabled lab | `lab-disabled.json` — HTTP 404, no demo content |
| Review gallery and recording | `index.html`, `motion-walkthrough.webm`, `artifact-manifest.json` — 12 lab captures plus 27 public regression captures |
| Served content and visual audit | `lab-server.html`, `title-style-audit.json`, `lab-hero-1440.png` |
| Native recording playback | `video-playback.json` — 18.8 seconds, 1280 × 800; Chrome decoding/playback passes |

The silent walkthrough shows the device state change, native scroll handoff, interface preview/focus, route navigation/back and reduced-motion fallback. Recording metadata is verified separately from any runtime FPS claim. Additional captures show the balanced tier, 320px poster, drawer at two widths, focus preview, reduced motion, disabled WebGL, low-memory and context-loss states. Earlier development reports may retain resolved failures; use the final report files listed above for acceptance evidence.

Reproduce with `pnpm build`, then a loopback `pnpm start --hostname 127.0.0.1` with the lab flag enabled for motion tests. Run `pnpm test:motion`; run public regression with `EVIDENCE_DIR=docs/evidence/phase-02/regression` and `pnpm test:smoke`. Recording uses Playwright's FFmpeg helper. `node scripts/capture-motion-hero.mjs` and `node scripts/motion-evidence.mjs` prepare the visual audit/gallery against the enabled local server. Leave the lab flag false for ordinary/public deployment.

## 6. Remaining issues and decisions

- No verified founder/project/service/contact inputs were added; Phase 00 publication decisions remain open. No form delivery or deployment has been attempted.
- A dependency currently emits a `THREE.Clock` deprecation notice in development. Owned code does not instantiate that clock; track the Fiber/Three upstream migration instead of patching or suppressing it. ESLint 9 remains pinned for the documented plugin compatibility constraint; final peer checks have no conflicts.
- Final product visual fidelity, full Home narrative, route-specific compositions, real hardware performance and full accessibility certification are not covered by this shared-system checkpoint.
- Next dev generated repository `AGENTS.md`; the bundled Next server/client, lazy-loading, navigation and loading documentation was consulted. Only the loopback dev hostname was added to `allowedDevOrigins` for automated review.

## 7. Review boundary

Review the gallery/video and architecture before Phase 03. This phase adds the shared systems and isolated lab, not new production case content. No Git repository was supplied; no commit/PR was created. Local QA servers are stopped after evidence capture.
