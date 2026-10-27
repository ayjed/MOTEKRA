# Phase 03 — cinematic Home review

2026-10-25 · Codex · Local production preview. Phase 04 has not started.

## Implementation

The Home route now follows the eight-section Design 02 storyboard: immersive navigation/hero, navy featured Work, five service demonstrations, five-stage process, founder editorial, Creative Lab, sculptural contact invitation and shared footer. All locked headings, supporting text and primary CTAs are server-rendered. The route remains a Server Component; client boundaries own animation and capability detection rather than page copy.

- The authentic supplied mark resolves through four complementary raster masks. Its original pixels and SHA-256 remain unchanged. This is not extracted SVG geometry; an editable original is still missing. GSAP coordinates the mark, caption, letter/word/line sequence, supporting text and navigation.
- The R3F laptop and phone assemble over a finite entrance, with glass/clearcoat material, cyan light, bounded pointer depth and meaningful concept-interface textures. The interface is explicitly labelled as a website study. The scene settles instead of running continuously. The desktop hero reframes toward Work during native scrolling; wheel/touch are not intercepted.
- Work uses masked perspective reveals, pointer depth and hover/focus previews. Its featured artwork is a working internal website concept, explicitly labelled. A separate verification panel explains why candidate engagements are withheld. No company/client case is inferred from a reference screenshot.
- Five native keyboard-operable service demonstrations transform a wireframe into a visual system, browser layout into responsive UI, phone screens into a flow, an idea into a roadmap, and identity elements into a system. CSS perspective provides selective depth without mounting five additional canvases. Essential descriptions and detail links remain outside collapsed demonstrations.
- The navy process scene pairs a sticky product-state visual with five semantic steps and an illuminated scroll line. Active milestones use `aria-current="step"`. Mobile keeps a normal-flow visual and readable list; reduced motion keeps the static first illustration and every step.
- The founder section uses the owner-confirmed name, title, company, profile route and four professional links. Its portrait area clearly states that the original photograph is awaited. No mockup portrait is published. Only the approved minimal identity is added to the existing founder template.
- Creative Lab contains three actual studies implemented in this repository, tagged Concept or In Development. Links point to their working demonstrations. The contact sculpture consists of layered interface panels with finite scroll illumination; the CTA leads to the honest contact scaffold.
- Footer links now include the approved founder profile/social URLs, existing service routes, company routes and reduced-motion-aware Back to top. Legal/contact details remain absent until supplied.
- The laptop keyboard uses 52 instanced keys rather than 52 separate draw calls. Supporting hero copy keeps full opacity while translating so its readability and paint timing do not wait for an opacity entrance. Font-ready ScrollTrigger refreshes from separate component scopes are batched into one frame with cancellable ownership.

## Accessibility and fallback contract

Implementation map: `src/components/home/home-page.tsx` owns server-rendered sections and approved copy; `home-cinema.tsx` owns choreography; `hero-product.tsx` bridges the server poster to the shared lazy scene; `process-narrative.tsx` owns milestones; `service-visual.tsx` owns code-native interface visuals; `src/styles/home.css` owns responsive composition. `src/content/team/index.ts` holds approved identity and URLs, `src/content/studies/index.ts` holds the current website experiments, and `src/content/projects/index.ts` intentionally publishes no candidate case.

Headlines, descriptions, links, five process steps and CTAs are visible in the initial HTML. Decorative textures and mirrored text are hidden from assistive technology. No root loading boundary conceals Home until JavaScript executes. The supplied CSS device poster is retained for mobile, reduced motion, data-saving/low-capability policies and WebGL/import/render errors. GSAP media contexts revert on preference changes; the existing scene lifecycle stops offscreen/hidden rendering and disposes resources. Native details and anchors work without JavaScript.

The preview remains deliberately `noindex` with an empty sitemap while the domain and publication decisions are unresolved. Crawlable HTML is verified separately from permission to index. No domain, canonical, Organization claim or client result is guessed.

## Evidence and validation

See [the evidence gallery](evidence/phase-03/index.html), production HTML, Playwright/axe JSON, build/typecheck/lint/unit logs and performance reports in `docs/evidence/phase-03/`. These are local laboratory checks, not a WCAG conformance certification or real-user Core Web Vitals result. Desktop rendering uses Chrome with software WebGL for repeatability; hardware GPU and assistive-technology coverage remain Phase 09 work.

Validation results and measured performance are recorded in the evidence README after the final run. Earlier failed runs identified an initial active-step announcement, one low-contrast decorative note and a test target that crossed the next stage's activation line; those were corrected. Lighthouse also found service summaries whose custom accessible names omitted visible interface words. The summaries now derive their native names from the actual visible content, with hidden service context, and the axe tag set explicitly includes WCAG 2.1 A as well as AA. Initial Lighthouse reports are retained under `initial-performance/`, separately from the final reports.

## Content gates and review checkpoint

Final local Lighthouse: desktop performance **58**, mobile **47**; both accessibility **100**, best practices **100**, SEO **66** (intentional preview `noindex`). Desktop LCP **1.2 s**, mobile **4.5 s**, CLS **0** in both; blocking time remains **1,760 / 1,580 ms** respectively. Main-thread cost and mobile LCP are unresolved. These measurements do not pass the performance gate; initial and final runs are retained without claiming a statistically meaningful improvement. Mobile carries Lighthouse's slower-than-expected CPU warning; desktop uses software WebGL.

The interactive framework is ready for review, but the full authentic-content gate is not complete. Await: the original founder photograph; exact project ownership/contribution/completion/permission; confirmed active service scope; contact email/delivery, phone/address if intended; domain/legal content. Spotlight Contest, LAD Global Travels, TOG Africa, ConnectAPI and individual Dribbble entries remain unpublished drafts. Public project data stays empty. Nothing here claims they were delivered by MOTEKRA.

No deployment, paid dependency, contact-provider selection, invented portrait, client outcome, professional achievement or performance counter was introduced. Keep the review checkpoint before Phase 04.
