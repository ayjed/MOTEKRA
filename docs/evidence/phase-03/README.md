# Phase 03 evidence

Local production build, Chrome, 2026-10-25. No deployment or live contact delivery.

## Checks

- `build.txt`, `typecheck.txt`, `lint.txt`: production Next.js build, strict TypeScript and ESLint.
- `unit-tests.txt`: 26 passing tests in three files.
- `playwright-results.json`: seven passing Home tests — initial HTML/content/logo fingerprint, desktop scene/handoff/process, keyboard service interactions, live preference/route lifecycle, mobile/reduced/no-JS, axe at two widths, desktop recording.
- `scene-refinement-results.json`: targeted desktop scene/process/recording rerun after adding an instanced keyboard; an intermediate scene-only check; superseded by the final seven-test report.
- `axe-1440.json`, `axe-390.json`: zero automated WCAG-tagged violations in reduced-motion mode. Incomplete/manual checks remain documented in the reports; this is not certification.
- `home-server.html`: actual served production HTML. All eight storyboard sections, primary CTAs and process descriptions are present without animation. Preview `noindex` is deliberate.
- `html-audit.json`, `internal-links.json`: semantic heading/section inventory and HTTP status of rendered internal links.
- `hero-1440.png`, `hero-390.png`: primary requested desktop/mobile viewport captures. Section captures and process-1 through process-5 show the rest of the composition. Very tall mobile full-page images are retained as diagnostics outside the gallery: one headless capture contains repeated raster tiles. Viewport section captures and the recording are the reliable visual review.
- `home-walkthrough.webm`, `home-mobile-walkthrough.webm`: desktop cinematic interaction and mobile poster/scroll/service walkthrough. `video-playback.json` records Chrome decoding, dimensions, duration and successful playback.
- Lighthouse reports and `performance-summary.json`: local simulated measurements, not deployed/field Core Web Vitals. SEO is intentionally affected by staging `noindex`.
- `artifact-manifest.json`: file lengths and SHA-256 fingerprints for captured artifacts.

## Scope and limits

Final Lighthouse laboratory results:

| Measurement | Desktop | Simulated mobile |
|---|---:|---:|
| Performance | 58 | 47 |
| Accessibility / Best practices | 100 / 100 | 100 / 100 |
| SEO | 66 | 66 |
| FCP | 0.6 s | 2.4 s |
| LCP | 1.2 s | 4.5 s |
| Total blocking time | 1,760 ms | 1,580 ms |
| CLS | 0 | 0 |
| Transferred resources | 594 KiB | 344 KiB |

**Performance is not signed off.** Main-thread execution, forced reflow, unused JavaScript and mobile LCP remain optimization priorities. The mobile report warns that this computer's CPU is slower than Lighthouse expects. Desktop uses software WebGL; these results cannot predict real hardware performance. Initial scores were 59 desktop / 45 mobile; single-run differences are not proof of improvement. Keep heavy purposeful motion while profiling hydration, reveal setup and scene initialization in the performance phase. SEO 66 reflects the deliberate preview indexing block; do not remove it merely to improve a report.

Desktop scene checks use software WebGL (`swiftshader`) and a 1440×960 viewport. Mobile is touch emulation at 390px and 320px; the responsive capability policy selects the semantic CSS poster and creates no canvas. GSAP typography and scroll effects remain available where motion is allowed. No real low-end handset, hardware GPU memory, screen-reader matrix or production p75 metrics are claimed. Lighthouse is run after recordings to reduce concurrent browser load.

Keyboard tests open all five native service demonstrations and follow their links. Scroll tests check each process stage and its active semantic state. Shared navigation/context loss/preference/lifecycle evidence from Phase 02 remains in that phase's separate folder. The Home tests do not claim that every inner page is finished.

The original founder photograph, permissions/roles/status for candidate projects, active service scope and contact delivery remain content gates. The confirmed name/title/profile links are used; no unverified client case or invented portrait is published. Phase 04 remains unstarted pending review.


Final walkthrough playback: desktop 1440×960, 34.68 seconds; mobile 390×844, 16.04 seconds. Both decoded, advanced beyond one second and reported no playback error in Chrome. The gallery contains 19 review captures and two videos; three very tall mobile diagnostic images remain outside the gallery.

