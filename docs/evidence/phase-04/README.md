# Phase 04 evidence — Work

2026-10-25 · Local production build · No deployment or paid service.

## Reproduce the review

Run the normal production build with `pnpm build`. For local draft review only, set `WORK_DRAFT_REVIEW_ENABLED=true`, keep `SITE_INDEXABLE=false`, then start the server on loopback port 3000. A second server on loopback port 3001 uses `WORK_DRAFT_REVIEW_ENABLED=false` for the publication-gate tests. Run `pnpm test:work` against these two local servers. Do not enable the review flag on a public host; it is not authentication. Neither draft data nor image assets are put into the approved public portfolio.

`scripts/work-assets.py` reproduces the eight source-derived crops; `WORK_EVIDENCE_ASSETS.json` records provenance/hashes. `scripts/work-review.mjs` captures normal public mode, audits HTML/card dimensions and links, builds the gallery, verifies video playback and fingerprints artifacts. The source PDFs remain unchanged.

## Validation artifacts

- `build.txt`, `typecheck.txt`, `lint.txt`, `unit-tests.txt`: final build, strict typing, lint and 30 unit tests.
- `playwright-results.json`: seven Work tests — public gate, draft source HTML/metadata/images, keyboard categories/focus/preview/route/back, responsive gallery/cases, no-JavaScript/reduced motion, four axe audits, recorded desktop walkthrough.
- `foundation-results.json`: two additional public-route HTML and unapproved-detail 404 regression tests.
- `public-gate.json`: all four draft cases and their images return 404 with the review flag off. The files are also unavailable through a guessed public asset path.
- `work-public-server.html`, `work-review-server.html`, four `*-server.html` cases: actual production HTML with a semantic H1, copy and entry links. Draft pages have noindex metadata and omit unsupported case-study sections/schema.
- `axe-gallery-1440.json`, `axe-gallery-390.json`, `axe-case-1440.json`, `axe-case-390.json`: automated WCAG A/AA-tagged audits, including WCAG 2.1 A visible-label matching. Gallery focus overlay is included.
- `work-*.png`, `collection-*.png`: 1440 / 1024 / 768 / 390 / 320 widths. Case hero captures cover all four drafts at 1440 and 390. Additional captures show keyboard focus, draft category, source artwork, verification and no-JS fallback.
- `work-walkthrough.webm`, `video-playback.json`: desktop reveal/hover/category/case/back walkthrough, with Chrome decode/playback validation. The gallery also includes public-mode captures so review-only candidates cannot be mistaken for released content.
- `html-audit.json`, `public-links.json`, `artifact-manifest.json`: heading/card inventory, actual link HTTP status and artifact fingerprints.

An initial screenshot caught a transient reveal mask rather than its settled state; the capture now waits for the mask to clear. An initial programmatic-focus check exposed reliance on `:focus-visible`; previews now use `:focus-within`. Visual review also caught the outer image entrance clipping an otherwise open focus overlay. Focusing a card now finishes that entrance immediately, or suppresses it if entry has not begun. The browser test verifies this before waiting for other masks to settle. No rule was disabled to make the checks pass.

## Limits and remaining content

No candidate has approved ownership, exact contribution, delivery status, technology, results or display permission. ConnectAPI is treated as a concept; visible interface figures are sample data. These are local evidence reviews, not completed client cases. Normal public mode keeps company/founder sections empty and shows only the existing repository studies.

Viewport emulation and axe do not certify WCAG conformance, screen-reader behavior or real-device performance. There is no new WebGL canvas on Work. Hover effects use bounded transforms/clip masks; no endless animation or animation framework per card. The shared page/CTA Motion enhancements and scoped GSAP choreography remain. Real-device/GPU/field Core Web Vitals checks and the existing Home performance gap remain open.

Review checkpoint: Phase 05 has not started.

## Final local measurement and visual review

Normal public `/work`, Lighthouse simulated mobile: **79 performance**, **100 accessibility**, **100 best practices**, **66 SEO**. FCP **1.5 s**, LCP **3.7 s**, total blocking time **390 ms**, CLS **0**, transferred resources **334 KiB**. The SEO deduction reflects the intentional preview noindex policy. LCP and blocking time still need optimization; this is not a Core Web Vitals sign-off. An earlier run scored 84, illustrating laboratory variability rather than a guaranteed regression/improvement. No real-device p75 is claimed.

The desktop walkthrough decodes and plays in Chrome at **1440×960 / 18.48 seconds**, with no playback error. Extracted frames at 2, 8, 12, 14 and 16 seconds were visually checked for title, original source cards, hover details, concept filtering and the draft case transition. The frames remain in `video-frames/` as QA diagnostics. The main gallery contains **26** responsive/focus/public/case captures and the walkthrough.
