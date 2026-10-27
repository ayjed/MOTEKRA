# Phase 04 — Work and evidence-led cases

2026-10-25 · Codex · Local implementation and review; no deployment or paid service. The user's Work request authorizes Phase 04. Phase 03's portrait/project/performance gates remain open; Phase 05 has not started.

## What changed

`/work` now uses Design 02's white/ice-blue/cyan/navy visual system with the locked “Real Ideas. Real Impact.” headline. A twelve-column editorial gallery alternates large and smaller cards, with controlled vertical offsets rather than uniform rows. GSAP stages masked perspective image reveals and kinetic title lines; a navy credit interlude has a bounded scroll translation. CSS transforms and clip masks provide hover/focus detail overlays, without another WebGL scene or per-card Motion hydration. The existing shared Motion route transition, active navigation and CTA enhancements remain in use.

Category links are real server-rendered URLs. All work, company/shipped, founder/collaborative, UI/UX concepts and in-development views keep stage separate from attribution. The local review also exposes a Draft evidence filter. Filtering needs no JavaScript and preserves keyboard focus in the enhanced navigation. A polite result count announces changes. Server content stays readable before animation; masks only begin at viewport entry, clean up, and revert for reduced motion. Essential title, summary, status, attribution and entry link remain outside hover overlays.

Focusing a card finishes its owned image entrance immediately; an entrance cannot continue clipping the focus preview. Offscreen focus arriving before a reveal suppresses that card's mask entrance. Other cards retain their cinematic progression. Focus listeners and owned tweens are removed on teardown/preference changes.

Normal public mode shows only the three existing repository website studies, tagged Concept / In Development. These are explicitly internal website experiments, not client successes or founder-authored past engagements. Company and founder views have honest empty states because no candidate has approved ownership/contribution/display permission.

## Four draft evidence records

Spotlight Contest, LAD Global Travels, TOG Africa and ConnectAPI have typed draft records and deep `/work/[slug]` evidence-review pages. Source observations describe only what is visibly present in the supplied PDFs. All ownership, exact roles, delivery, technology and results remain unverified. ConnectAPI is treated as design/concept work per the owner decision; its UI figures are labelled sample data beside the artwork, not outcomes.

Each draft detail page includes breadcrumb navigation, a source hero, explicit attribution/stage/contribution/publication facts, an evidence overview, a second source crop, a verification checklist, a next-draft link and the contact CTA. Problem, process, solution, technology and results sections render only when their fields contain verified content. They are not filled with plausible stories. The same server template supports approved records when real evidence is supplied.

The public `projects` collection remains empty. The original `PROJECT_INVENTORY.json` retains `publish: false` for every candidate. No founder/client role, award, technology stack, live deployment, external artifact URL or measured outcome was inferred.

## Review gate and image provenance

`WORK_DRAFT_REVIEW_ENABLED` defaults to false. Draft records and images require an explicit true value **and** a non-indexable site. Draft case routes and image routes return 404 otherwise. The flag is a local preview switch, **not authentication**; never enable it on a public host. There is no hosted preview or publishing action in this phase.

Eight WebP crops are extracted from the supplied PDF raster pages, with original PDF hashes, page/crop coordinates, output sizes and hashes in `WORK_EVIDENCE_ASSETS.json`. Originals remain unchanged. ConnectAPI's surrounding profile controls/comments are excluded. No generated or recoloured project artwork was introduced.

Exports live outside `public/` in `assets/review/work/`. A whitelisted server route returns only recognized candidate/view pairs, with `private, no-store` and `X-Robots-Tag: noindex, nofollow, nosnippet`. Draft Next Images are unoptimized so the image optimizer cannot retain a public cached copy after the gate closes. No untrusted path is joined without the slug/view allowlists. Draft metadata is explicitly noindex/nofollow/nosnippet with no production canonical; drafts do not enter the sitemap. Approved future case URLs use the existing publication guard before sitemap inclusion.

## Source map

| Area | Files |
|---|---|
| Server gallery | `src/app/work/page.tsx`, `src/components/work/work-page.tsx`, `work-card.tsx` |
| Case template | `src/app/work/[slug]/page.tsx`, `src/components/work/project-detail.tsx` |
| Animation | `src/components/work/work-cinema.tsx`, `src/styles/work.css` |
| Typed evidence / publication | `src/content/projects/candidates.ts`, `src/content/models.ts`, `src/lib/data/work.ts` |
| Gated images | `src/app/work/evidence/[slug]/route.ts`, `scripts/work-assets.py` |
| Verification | `tests/unit/work.test.ts`, `tests/smoke/work.spec.ts`, `playwright.work.config.ts`, `scripts/work-review.mjs` |

## Evidence and remaining gates

Final validation: production build, strict typecheck and lint pass; **30 unit tests**, **seven Work browser tests** and **two public route/404 regression tests** pass. Four axe runs (gallery with focused overlay and ConnectAPI case, at 1440 and 390) report zero violations. Responsive gallery checks include 1440/1024/768/390/320; all four draft cases are captured at desktop/mobile. Twenty-six review captures and an 18.48-second playback-verified walkthrough are saved. Extracted recording frames were visually inspected, including the actual case transition.

Final public Work simulated mobile Lighthouse: **79 performance / 100 accessibility / 100 best practices / 66 SEO**, LCP **3.7 s**, blocking time **390 ms**, CLS **0**. No new canvas mounts on Work. The noindex deduction is intentional; mobile paint/main-thread work and real-device/field measurement remain open. The prior 84 score is not treated as proof of a stable change. The existing Home performance gap remains unresolved.

See [the review gallery](evidence/phase-04/index.html) and its README for exact validation results, responsive screenshots, walkthrough playback, source HTML, publication-gate checks and local performance measurements. Automated axe checks and emulated viewports do not certify WCAG conformance or hardware/field performance. No assistive-technology matrix or production p75 result is claimed.

The full real-project publication gate remains open: exact ownership/contribution, completion/deployment, display permission, verified project brief/process/solution/stack and outcomes are still needed. Unknown fields remain absent or labelled. Original portrait/contact/domain/service-scope decisions and Phase 03 performance hardening are unaffected. Stop at this review checkpoint before Phase 05.
