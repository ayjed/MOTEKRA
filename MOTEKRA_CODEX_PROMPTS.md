# MOTEKRA — Codex Implementation Prompts

**Instruction:** Send these prompts to Codex **one phase at a time**. Copy the common system instruction first. Give Codex the Master Blueprint, Tracker, references and supplied brand assets in the repository. Do not ask it to build everything in one undifferentiated prompt.

## A. Persistent Codex instruction (paste at the start of your agent session)

> You are the lead creative developer, Next.js architect and accessibility/SEO engineer for MOTEKRA. Read `MOTEKRA_MASTER_BLUEPRINT.md` as the primary source of truth and `MOTEKRA_PHASE_TRACKER.md` as the execution ledger before coding. The user approved Design 02: premium white, cyan/electric-blue, ice blue and navy with high-end 3D product visuals, cinematic motion, excellent professional UI/UX and a real supplied MOTEKRA logo. Build ONE website that functions both as the corporate lead-generation site and the founder's personal professional portfolio. The five main routes are Home, Work, Services, About and Contact, supplemented with SEO-specific project cases, service detail, founder and Insights pages.
>
> **HEAVY ANIMATION IS A HARD REQUIREMENT**, not something to add after conventional static development. The hero needs authentic logo assembly, kinetic typography, cinematic device motion, cursor depth and hero-to-portfolio choreography; work needs rich reveal and transition language; services need meaningful interactive 3D UI demos; the five-step process must animate as a scroll narrative; about/contact/navigation need sophisticated transitions and microinteractions. Implement with GSAP/ScrollTrigger + React Three Fiber + Motion for React; optional Lenis/Rive only if justified. However, every headline, project link, service description and CTA must remain accessible, visible and indexable without motion/WebGL; provide reduced-motion, mobile poster and error fallbacks. Avoid gimmicky repetitive fade-ins and generic agency templates.
>
> Never fabricate client work, testimonials, performance numbers, partner logos, years of experience, company address, founder name/title or achievements. Distinguish client-company work, founder-independent work, concept work and in-development items. Treat source screenshots/mockups as inspiration, not factual verification. Do not replace the official logo. Use React Server Components for crawlable content, strictly minimize `use client`, and validate production HTML/SEO/performance.
>
> Before making changes, report the phase and planned files briefly. After each phase: summarize changes, attach/test screenshots or recordings when available, run typecheck/lint/tests/build, report remaining issues, and update the tracker only for verifiably completed tasks. Do not start a subsequent phase without a review checkpoint; if content is missing, use clear internal TODO data and visible non-deceptive labels rather than invented production content.

## B. Input package Codex should receive

- `MOTEKRA_MASTER_BLUEPRINT.md`
- `MOTEKRA_PHASE_TRACKER.md`
- This `MOTEKRA_CODEX_PROMPTS.md`
- MOTEKRA symbol and banner PNGs from the upload.
- Approved long homepage and five-frame UI/UX PNG designs.
- Six PDF project/profile screenshots (listed in the Master Blueprint).
- Actual owner-approved project screenshots / URLs when available.

**Avoid copying** the reference agencies' proprietary art, UI, motion implementations or text.

## Phase 00 Prompt — audit and freeze sources

> Read every supplied document and inspect the actual image/PDF references. Create `docs/ASSET_MANIFEST.md`, `docs/CONTENT_VERIFICATION.md` and a clear project inventory. Derive the site structure from the approved five-page composition. Mark unknown facts as unverified, especially the founder's publishing name and role, phone/address, contact email, project ownership/completion, awards, company statistics and client permissions. Establish company vs personal portfolio attribution rules. Recommend a simple cost-conscious deployment/contact solution without silently choosing paid dependencies. Update Phase 00 in the tracker with findings and evidence. **Do not generate an invented founder portrait, client result, case study or replacement logo.**

## Phase 01 Prompt — initialize production-grade foundation

> Build a clean Next.js App Router project with strict TypeScript, Tailwind, ESLint, testing scripts and consistent file structure from the blueprint. Set responsive grid, palette tokens, typography, UI primitives and accessible layout. Use the supplied MOTEKRA mark accurately. Scaffold routes for `/`, `/work`, `/services`, `/about`, `/contact`, `/work/[slug]`, `/services/[slug]`, `/team/[slug]`, `/insights`, `/insights/[slug]`, sitemap/robots, error/404 pages. Main content must be server-rendered, with no hard-coded fake project data. Preserve all approved copy and design sections. Run build/typecheck/lint and capture scaffold screenshots. Update tracker with proof.

## Phase 02 Prompt — cinematic motion system + shell

> Build the shared high-end motion architecture before filling pages. Integrate GSAP/ScrollTrigger for staged typography/image reveals and timeline orchestration; R3F/Three/Drei for selectively lazy-loaded product-relevant 3D scenes; Motion for React for tactile microinteractions and basic transitions. Implement reusable hooks/components for split lines, masked reveals, 3D scene wrappers, pointer tilt, magnetic buttons, hover/focus previews, active nav, accessible 90%-width mobile slide-over, page/route transitions and hero-to-section handoffs. Scope/clean GSAP, reconcile ScrollTrigger with any optional Lenis, pause scenes when hidden, support `prefers-reduced-motion`, poster fallback, keyboard operation and 320px screens. Create a private `/motion-lab` or isolated demo to evaluate effects; do not copy hero from an unrelated SaaS template. Provide a short recorded walkthrough and update tracker.

## Phase 03 Prompt — HOME: the signature cinematic experience

> Implement the full **eight-section Home page** precisely aligned to Design 02 and the storyboard in the Master Blueprint. Start with authentic MOTEKRA logo geometry resolving into place and a coordinated navigation reveal. Kinetic line/word/letter hero heading: “Digital Products for what’s Next.” Use the approved supporting text and CTAs. The hero's center-right is an interactive R3F 3D laptop + phone **showing recognizable product UI**; device assembly, glass depth, soft electric-blue light and subtle pointer parallax. Choreograph the 3D scene to reframe into Work as the user scrolls. Build navy featured Work with cinematic hover/focus previews and honest labels; five interactive 3D/animated service modules; the five-stage scroll-responsive Discover/Define/Design/Develop/Launch story with luminous sequence; authentic editorial founder teaser; status-labeled Creative Lab; sculptural contact CTA; fully functional footer. Make animations substantial and varied, not merely fade-up cards; limit continuous unnecessary movement. Prioritize meaningful UI depth over abstract floating objects. Build responsive/mobile/reduced-motion fallbacks. Capture 1440px and 390px screenshots plus a desktop animation recording. Run accessibility/HTML/performance checks and update tracker.

## Phase 04 Prompt — WORK / CASE STUDIES

> Build `/work` in the approved cinematic white/cyan-blue visual system with the heading “Real Ideas. Real Impact.” Distinguish shipped/company work, founder work, UI/UX concepts and in-development experiments. Implement accessible categories, progressive staggered masked image reveals, intentional varying card scale, performant hover/focus detail overlays, page transitions and deep `/work/[slug]` case studies. Use only confirmed evidence from supplied Spotlight Contest, LAD Global Travels, TOG Africa and ConnectAPI screenshots or other verified sources. If ownership/details are unknown, do NOT add invented achievements or results; use clearly marked draft records not published as completed client successes. Case studies require problem/role/process/solution/technology/results only when true. Ensure semantic DOM and metadata. Review screenshot/video and update tracker.

## Phase 05 Prompt — SERVICES / DEEP DIVES

> Build `/services` with the approved headline “End-to-end Digital Solutions.” Present UI/UX Design, Web Development, Mobile App Development, Product Strategy, Brand & Visual Design as provisional until confirmed. Make five differentiated, high-production-value scene modules with service-specific product visuals and 3D interaction: interface design morphing, app window transitions, mobile UI prototypes, strategic roadmap visualization, brand system composition. Use GSAP with scroll choreography and R3F where beneficial—not arbitrary spinning shapes. Each service should link to an SEO-friendly detailed `/services/[slug]` with clear genuine copy, deliverables, related case studies and CTA. Ensure WebGL is optional, not the main content. Test mobile + reduced motion and update tracker.

## Phase 06 Prompt — ABOUT + FOUNDER ON THE SAME DOMAIN

> Build `/about` as a premium editorial layout with “A Studio for What’s Next.” Place company mission, approach, confirmed values, authentic founder photo and experience, and relevant work naturally. Build `/team/[slug]` for the founder's personal profile under MOTEKRA's domain; include only verified personal biography, skill list, external profiles (Behance, Dribbble, GitHub, LinkedIn) and projects accurately credited by role. Use sophisticated cinematic portrait masking, parallax, text stagger and subtle interface-based background visuals. No fake years, employee counts, achievements, or conflicting names; maintain placeholders where verification is pending. Update tracker.

## Phase 07 Prompt — CONTACT / REAL LEADS

> Build `/contact` from approved frame with kinetic “Have Something in Mind?” heading, sculptural cyan-blue 3D artwork, clear contact details **only if verified**, approachable service inquiry form, helpful FAQ, and polished responsive CTA. Implement backend validation, anti-spam, rate limiting and actual configured email delivery; secrets in environment variables and documented configuration. Include success and error states that accurately reflect real submission outcomes. Use accessible field labels, error summary and keyboard-friendly behavior. Test both positive and failed submissions, capture mobile/desktop designs and update tracker.

## Phase 08 Prompt — INSIGHTS + SEO SYSTEM

> Complete Insights list and article template, service/project structured content, schema and full SEO. Use Next.js Metadata API, metadata templates, canonicals, Open Graph, Twitter cards, sitemap, robots, breadcrumbs, real Organization/Person/Service/Article JSON-LD when substantiated. Cross-link company services and projects with founder work appropriately; establish useful content briefs/target intents without keyword stuffing or invented search volumes. Check that server-generated page HTML includes copy/links even without client JS and WebGL. Add only actually written, reviewed posts; otherwise leave Insights out of primary navigation until ready. Report route audits and update tracker.

## Phase 09 Prompt — animation performance/accessibility optimization

> Treat the heavy-animation experience as a premium engineering problem, not as permission for slow pages. Profile every major 3D scene and GSAP trigger on desktop and mid-range mobile. Optimize 3D geometry, textures, materials, DPR and lazy loads; pause offscreen renders; use fallback posters and conditional rendering; prevent long tasks and layout shift. Verify reduced-motion disables pinning, autoplay and intense movement without hiding content. Run axe, Lighthouse, Playwright, keyboard, touch and screen reader checks; verify SEO rendered HTML and basic browser-back navigation. Document LCP/INP/CLS, observed FPS, vulnerabilities and remaining issues. Fix before progress is marked complete.

## Phase 10 Prompt — release and handover

> Deploy only after all acceptance criteria pass. Choose configured, affordable hosting compatible with the actual Next.js runtime needs; configure real domain, SSL, email delivery and secrets. Verify robots/sitemap/canonical/OG metadata and contact messages in production; set up analytics and Search Console with owner credentials. Check social links, accurate project attribution and asset licensing. Provide `DEPLOYMENT.md`, `OPERATIONS.md`, `CONTENT_EDITING.md` and rollback guidance; final screenshots of all five approved frames, responsive views, and animation videos plus the completed QA checklist. Update tracker with actual verification results—never mark work complete merely because it compiled.

## C. Mandatory review / follow-up prompt after every phase

> Before continuing: compare implementation to MOTEKRA approved five-page designs and the Master Blueprint. List exactly: (1) completed features, (2) motion effects actually working vs only planned, (3) SEO/accessibility/performance evidence, (4) assets/content needing owner confirmation, (5) any deviations or technical debt, (6) tests executed and results, (7) screenshots/video artifacts. Update `MOTEKRA_PHASE_TRACKER.md` accurately. Do not proceed to the next phase until this checkpoint is reviewed.

## D. Creative acceptance checklist for Codex

- [ ] Viewer can tell this is MOTEKRA instantly from exact symbol/wordmark, disciplined colors, distinct layout language.
- [ ] Home hero has **custom cinematic typography + substantial product-centered 3D animation**.
- [ ] Portfolio uses immersive, identifiable projects and status labels, not recycled visual stock.
- [ ] Service animations show *real transformations connected to the service*, not five copy-pasted cube scenes.
- [ ] Process is genuinely scroll-responsive, visually explains the five stages.
- [ ] About integrates founder identity but does not misattribute personal projects to MOTEKRA.
- [ ] Contact captures real leads successfully and does not invent contact data.
- [ ] Every effect has reduced-motion/mobile fallback and keyboard access.
- [ ] SEO, crawlable DOM, Core Web Vitals and responsiveness are tested in the final implementation.
