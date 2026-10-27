# MOTEKRA

Next.js App Router project for the single-domain company website and founder portfolio. The foundation and shared motion architecture remain non-indexable previews, not a launch-ready site.

## Local development

Use Node 22.13+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Open http://localhost:3000.

- `pnpm typecheck`: generate route types and run strict TypeScript.
- `pnpm lint`: ESLint with Next.js core web vitals and TypeScript rules.
- `pnpm test`: publication and SEO configuration safeguards.
- `pnpm build`: production build.
- `pnpm start`: serve that build.
- `pnpm test:smoke`: with production server running on port 3000, run Chromium/Chrome smoke tests and capture five routes at five widths. Uses installed Chrome (`channel: chrome`). If absent, install the Playwright Chrome channel explicitly or change the test config to an available browser.
- `pnpm test:motion`: with `MOTION_LAB_ENABLED=true` at build time for local review, evaluate 3D, motion, cleanup, mobile/reduced-motion/no-JS fallbacks and record a short walkthrough. Recording needs Playwright's FFmpeg helper (`pnpm exec playwright install ffmpeg`). The test browser uses software-WebGL flags for reproducibility; these are not site runtime requirements.

## Content and launch safety

Candidate project evidence lives in `docs/PROJECT_INVENTORY.json`; it is not imported into the site. `src/content` contains typed public collections. Projects and articles remain unpublished until verified; the founder identity and supplied Phase 06 biography/skills have explicit review states. Draft service descriptions are visibly provisional; unknown detail slugs return 404. Do not enable indexability until approved content and all release gates pass.

Copy `.env.example` to `.env.local` when needed. `SITE_URL` requires an approved HTTPS origin. Missing origin or `SITE_INDEXABLE=false` gives noindex metadata, blocked robots and an empty sitemap. No invented domain, email, biography or structured-data claims are emitted.

## Architecture

`src/app` owns statically generated server-component pages, metadata and status routes. All five main routes are SSG; `/api/contact` is the only request-time email feature. `src/components` contains shell, sections, UI primitives, optional motion wrappers and the lazy 3D boundary. Content passed as children through motion wrappers remains server-owned HTML. Small client boundaries own navigation, gestures, route enhancement and scene lifecycles; do not convert business sections into client-rendered pages. Shared motion components live in `src/components/motion` and `src/lib/animations`. No Lenis is used; scrolling stays native.

## Internal motion lab

`/motion-lab` returns 404 unless the build has `MOTION_LAB_ENABLED=true`. It is always noindex and is never included in sitemap or public navigation. Enable it only for local/controlled review; the environment gate is not authentication and must not be enabled on a public deployment. Its copy and concept interface are engineering demonstrations, not client projects.

`SceneBoundary` takes a server-rendered poster and lazy-loads the device scene only near the viewport on eligible devices, after an initial paint/idle opportunity. Reduced motion, width below 768px, data-saving or low hardware hints use the poster. High quality is capped at DPR 1.25; balanced at DPR 1, with adaptive interaction DPR. Pointer settling runs on demand; offscreen/hidden scenes pause. Context loss or render/import errors retain the poster. Keyboard controls demonstrate interface states without making canvas essential.

Camera bounds observe the viewport so both devices stay framed. Loading feedback is scoped to optional visuals; there is no root loading boundary that can hide essential streamed text from a JavaScript-disabled browser. The retained `LoadingState` helper is available for visual-only Suspense slots.

See the phase review documents for the implemented Home choreography and service narratives. Phase 09 adds near-viewport GSAP ownership, shared media-query subscriptions, asynchronous Motion features, and nearby fine-pointer spring controllers. Native browser scrolling remains in use. Speculative Link prefetch is disabled to avoid competing with initial rendering; ordinary route navigation and back caching remain available.

The original supplied X-profile mark is copied byte-for-byte to `public/assets/brand/motekra-mark.png`; no geometry was redrawn. Original filename discrepancy remains in the Phase 00 ledger. Display font: locally served Manrope Variable Latin (SIL Open Font License); body: Arial/Helvetica system stack. See `docs/PHASE_01_REVIEW.md` for evidence and remaining gates.

Hosting must support a Next.js Node server; no deployment or paid service is configured. Contact is a disabled, clearly labelled preview and cannot claim successful delivery. Security headers are foundational; CSP and production policy review remain launch work.

## Static-first architecture / Phase 07

No database, authentication, CMS, admin dashboard or traditional backend. Portfolio, services, cases and future articles stay in local TypeScript/MDX. Main pages are SSG; Work filters enhance server-rendered cards through URL/history state. Candidate screenshots remain unpublished. The previous runtime draft/evidence handlers are retired; Phase 04 source files and saved review evidence remain intact outside public assets. The motion lab is a build-time gated static demo. Image optimization is local/prepared, with no runtime optimizer.

Contact uses one minimal email endpoint and Resend's proposed Free plan. Store the personal recipient privately in `CONTACT_EMAIL` in ignored `.env.local`; never render that address. No recipient/API key is currently provided, so delivery remains pending. See [CONTACT_SETUP.md](docs/CONTACT_SETUP.md) for configuration, free-plan constraints, Reply-To, provider idempotency, best-effort serverless quotas and real-inbox verification. No email SDK or mail-server dependency remains installed. No external account or paid plan is created.

`pnpm test:contact` checks contact UI/accessibility and static Work behavior; `pnpm test:contact-delivery` tests validation/provider contracts using synthetic/local fixtures. These do not prove real inbox delivery. Fully static hosting would need a separately configured form provider/function; the current build keeps one permitted serverless email endpoint. Phase 07 evidence: `docs/evidence/phase-07/index.html`.

## Insights and SEO / Phase 08

Metadata API helpers provide per-route canonical/Open Graph/Twitter tags once an approved `SITE_URL` exists. Static social cards live in `public/assets/social`; no runtime image/social service is added. Visible breadcrumbs and conservative JSON-LD use shared helpers. Sitemap entries follow approved local content; robots does not permanently exclude future approved services/profiles/articles.

The real article collection stays empty. `ArticleTemplate` supports genuine reviewed local TypeScript sections, bylines/dates, sources, a contents list, code blocks and approval-aware related links. No article is published just to fill a template; synthetic fixture screenshots are outside the app/content collection. Insights remains out of navigation until ready.

Run `pnpm test:seo` against the normal local production preview. `scripts/seo-audit.mjs preview` audits 12 served routes without JavaScript. The separately recorded configured-mode audit uses example.test solely as a local fixture; final environment/build remains noindex. See [SEO_OPERATIONS.md](docs/SEO_OPERATIONS.md), [SEO_CONTENT_BRIEFS.md](docs/SEO_CONTENT_BRIEFS.md), and `docs/evidence/phase-08/index.html`. Domain ownership, deployed indexing/structured-data/social-scraper checks and Search Console remain pending.

## Phase 09 verification

With the production preview on port 3000, run `pnpm test:quality` for cross-route browser, axe, keyboard, touch, no-JS, reduced-motion, lifecycle and back-navigation checks. Set `EVIDENCE_DIR=docs/evidence/phase-09/regression` to keep phase history intact; the isolated article fixture and social manifest must already be present in that directory.

Run the following serially, without concurrent builds, recordings or other browser tests: `node scripts/performance-profile.mjs after`, `node scripts/scene-lifecycle.mjs`, and `node scripts/lighthouse-quality.mjs`. Then run `node scripts/summarize-quality.mjs`. `node scripts/viewport-quality.mjs` captures viewport designs/orientation checks; `EVIDENCE_DIR=docs/evidence/phase-09 node scripts/seo-audit.mjs preview` saves the current server-HTML audit. PowerShell sets environment variables with `$env:EVIDENCE_DIR='...'` before the command.

See [PERFORMANCE_BUDGETS.md](docs/PERFORMANCE_BUDGETS.md) for targets and measurement limits. Emulated CPU/network and software WebGL are reproducible laboratory diagnostics; they cannot establish physical-phone FPS, actual GPU VRAM or field p75 INP. Do not mark those acceptance gates complete based only on these scripts.
