# MOTEKRA — Master Blueprint / Source of Truth

**Version:** 1.0  
**Status:** Approved design direction; implementation planning  
**Updated:** 2026-10-25  
**Authority:** This file is the primary source of truth. The phase tracker controls progress; the Codex prompts control execution. In a conflict, follow this document and request a decision rather than silently changing scope.

## Owner architecture amendment — 2026-10-26

The latest direct owner instruction governs architecture: static-first Next.js App Router with SSG wherever possible; projects/services/cases/articles in local TypeScript or MDX. No traditional backend, database, authentication, admin dashboard or CMS. Only a minimal serverless contact email endpoint is permitted, or a hosted form service for fully static hosting. Earlier optional CMS/SMTP/persistent storage examples below are not selected requirements. Preserve all approved cinematic motion, 3D, SEO and accessibility.

The company has no company email currently. Use a private personal Gmail recipient in `CONTACT_EMAIL` in ignored `.env.local`; never publish it. Actual address/provider credentials remain pending. Prefer a free-tier email/form solution, visitor Reply-To and honest outcomes; no paid account or recurring expense is authorized. Current implementation proposes Resend Free through native fetch and keeps delivery pending until configured and tested.

## 1. Mission and scope
Build **one premium MOTEKRA website** serving simultaneously as (1) a business-generating corporate website for a professional digital product/software development company and (2) the founder's credible professional portfolio. The site must be **visually cinematic, unusually interactive, heavily animated, fast, accessible, SEO-first and easy to maintain**.

**DO NOT** split the founder into a second website or require a second domain. Keep company achievements and founder's personal work clearly attributed; distinguish production work, concept work, experiments, and work in development. Avoid fake client endorsements, projects, metrics, awards, partner logos, team members, testimonials and invented case-study results.

**Positioning:** MOTEKRA is a creative technology/software and digital products company—**not merely a graphic design agency**. Brand language: clear, sophisticated, confident, technically credible, outcome-focused; avoid bloated startup clichés.

### Priority hierarchy
1. Brand trust, authentic project evidence, conversion.
2. Exceptional art direction, content hierarchy and purpose-driven high-intensity animations.
3. Accessible semantic HTML, SEO/indexability, performance and responsive usability.
4. Sustainable deployment and editing without expensive external services.

## 2. Locked design decisions

- Approved direction: **Design 02 — premium white, ice-blue, cyan/electric-blue, interactive 3D**. Do not restart exploration or introduce a different theme.
- Use the **actual supplied cyan-blue geometric MOTEKRA symbol**, not a redrawn approximated logo. Asset: `MOTEKRA_LinkedIn_Profile_400x400.png`; use supplied banner `MOTEKRA_LinkedIn_Company_Banner_1128x191.png` as a color/shape reference, not as the full web hero.
- Core palette: White `#FFFFFF`; Ice Blue `#EDF7FF`; Cyan `#12CDE4`; Electric Blue `#1688F7`; Dark Navy `#08152B`. Dark navy full-width interludes balance bright white sections. Subtle white-to-ice-blue atmospheric transitions.
- Strong contemporary display typography, controlled editorial hierarchy, spacious grids, variable scale, meticulous baseline alignment; deliberate asymmetric composition where appropriate.
- Realistic 3D **product mockups, browser windows, phones and UI states**; dramatic but restrained dimensional lighting; recognizable UI content rather than random floating objects. Blue sculptural/ribbon shapes are supporting material only.
- Use the approved five-page concept (`a_wide_ui_ux_website_mockup_layout_image_a_clean.png`) and long homepage reference (`a_clean_modern_corporate_product_agency_landing_pa.png`) as composition directions, **not pixel-perfect facts or copy sources**. Improve fidelity, spacing and consistency as actual implementation develops.
- No generic SaaS template, excessive repeated cards, stock-image founder portraits, fabricated content, meaningless icon cubes, unreadable blur, motion for motion's sake, or hard-coded mockup text that looks like a real client result.

### Design-system starter tokens
- Grid: max content width around 1320–1440px; responsive gutters; consistent 8px-derived spacing scale.
- Type: one strong display family and one highly legible body family (choose performant/licensed or open fonts; document selection). Avoid heavy font payload.
- Radius: restrained (cards 16–24px), pill buttons optional; product screens use authentic device/browser radii.
- Surface styles: crisp white, occasional frosted glass, subtle edge treatments and layered shadows; don't wash out text.
- Buttons: primary electric blue; secondary white/blue outline; clearly-visible focus rings and pointer-free operation.
- Navigation: Home, Work, Services, About, Contact; main CTA “Start a Project”; room for Insights and founder profile via footer/submenus.
- Responsive: design and review at 1440, 1024, 768, 390 and 320 widths; prevent clipped 3D, horizontal overflow and tiny touch targets.

## 3. Information architecture / sitemap

### Primary five design frames (must receive dedicated full-page implementation)
| Page | URL | Purpose | Conversion |
|---|---|---|---|
| Home | `/` | Positioning, immersive showcase, proof, service discovery | See Our Work / Start a Project |
| Work | `/work` | Filterable real work and clearly marked concepts | View Case Study |
| Services | `/services` | Service offering, capabilities, methods, service discovery | Discuss a Project |
| About | `/about` | Company story, leadership/founder, credibility and values | Work With Us |
| Contact | `/contact` | Inquiries, expectations, direct contact routes, FAQs | Submit Inquiry |

### SEO-supporting pages (not optional for final launch)
| Page | URL pattern | Notes |
|---|---|---|
| Case studies | `/work/[slug]` | Problem, role, solution, work, implementation, verified outcomes; honest attribution |
| Service detail | `/services/[slug]` | Relevant search intent, service deliverables, FAQs, contextual case studies |
| Insights listing | `/insights` | Editorial content hub; only launch with genuine content |
| Article | `/insights/[slug]` | Useful technical/product articles with byline, dates, genuine value |
| Founder profile | `/team/[slug]` | Verified founder bio/roles/skills, experience, founder-attributed work, LinkedIn/GitHub/Behance/Dribbble |
| Legal and status | `/privacy`, `/terms` as applicable; `/not-found` | Real policies; don't fabricate legal claims |

**Single-domain rule:** company services and individual expertise share one domain but maintain distinct labels and structured data. A founder's personal independent project should not be described as a MOTEKRA client engagement unless the attribution is established.

## 4. Homepage experience — cinematic storyboard

### 01 — Navigation & immersive hero
**Headline locked:** “Digital Products / for what’s / Next.”

**Supporting copy locked:** “We design and build high-performance web and mobile applications that help ambitious businesses grow, scale, and create real impact.”

- On load: symbol draws/assembles using actual MOTEKRA geometry; wordmark resolves; staggered nav entrance; letter/line-masked title sequence; buttons reveal.
- Right-side hero: photorealistic/product-accurate 3D laptop + phone with polished **actual or clearly conceptual UI**, floating capability labels, volumetric blue gradients, subtle cursor-responsive tilt and light.
- User-driven 3D hero object rotates/translates on scroll and hands visual focus to the featured portfolio. Avoid scroll-jacking that hides content.
- Mobile: lighter two-dimensional/video/poster fallback rather than full heavy WebGL if needed.
- Primary CTAs: “See Our Work” and “Start a Project”; optional subtle scroll cue.
- Do **not** claim brands are customers or show testimonial avatars unless confirmed.

### 02 — Featured work
**Headline locked:** “Real Projects. Real Impact.”
- Navy section/contrast treatment; oversized split headline; filter chips for All, Web Apps, Mobile Apps, UI/UX Design, Branding (filter only populated categories).
- Desktop project cards: cinematic image masks, depth/scale on scroll, focus/hover overlays with role/category and status, keyboard-accessible “View Project” action; a restrained horizontal carousel is acceptable if all projects remain discoverable.
- Project screenshots must correspond to actual projects; no invented product names/metrics in imagery. Every card links to an implemented case study or explicitly marked external artifact.

### 03 — Services
**Headline locked:** “What We / Bring to Life.”
- Five provisional services: **UI/UX Design, Web Development, Mobile App Development, Product Strategy, Brand & Visual Design**; confirm company service scope before publishing.
- Distinct, interactive product-centered 3D illustration per service: design tokens/wireframe to final UI; animated browser; device transition; roadmap; visual identity modules.
- Numbered cards or editorial vertical showcases, progressive visual depth and clear text; all services link to detailed accessible pages.

### 04 — Development process
**Headline locked:** “From Idea / to Impact.”
- Five steps: **Discover → Define → Design → Develop → Launch**.
- A prominent deep-navy scene; on-scroll sequential milestones; animated connective energy line; stage-specific wireframe/product states; progression and visible active stage.
- The steps and explanatory text exist as semantic DOM text independent of WebGL/animation.

### 05 — Founder / About teaser
**Headline locked:** “A Studio / for What’s Next.”
- Authentic portrait only; polished editorial mask reveal and parallax depth; genuine short bio and verified capability chips; real social links.
- Founder identity is **pending final confirmation**: uploaded LinkedIn screenshot appears to use “Akinwumi Ayomiposi,” while earlier chat also used “Michael Akinwumi”; **do not silently choose between them**. Name and title must be signed off before publishing.
- CTA to `/about` and verified `/team/[slug]`.

### 06 — Creative Lab
**Headline locked:** “Experiments / in the Making.”
- Distinct interactive motion cards for real prototypes, motion studies, UI concepts, R3F explorations.
- Each item is explicitly tagged **Completed / Concept / In Development**. Do not present image-generation concepts as shipped products.

### 07 — Contact CTA
**Headline locked:** “Have Something / in Mind?”
- Sculptural cyan-blue 3D composition with subtle scroll illumination; oversized kinetic typography; strong “Let’s Talk” CTA and accessible email alternative; CTA not obstructed by ornament.

### 08 — Footer
- Real MOTEKRA logo; meaningful grouped links (company, services, work, insights, founder), social links, legal and dynamic copyright year; magnetic/upward scroll button as enhancement.

## 5. Inner page composition

### Work frame
- Hero: “Real Ideas. Real Impact.”; introductory explanation; easy multi-category filters; cards with varied, controlled editorial sizing; case-study previews and honest statuses.
- Separate **Client & Shipped Work**, **Personal / Independent Work**, **UI/UX Concepts** (drill-down filters or sections), while maintaining a single portfolio.
- Case-study format: hero proof image; overview; context/problem; contribution and ownership; services/stack; constraints; process; visual gallery; solution; **verified results only**; outbound links; next project; CTA.
- Case studies are indexable text pages, not animations alone.

### Services frame
- Hero: “End-to-end Digital Solutions.”; five immersive stacked/alternating service modules with UI-based 3D demos and clear deliverables; corresponding deep-dive pages; process and CTA.
- Only assert offerings that the business confirms.

### About frame
- Hero: “A Studio for What’s Next.”; company story; real founder biography/portrait; values/working approach; principles; global collaboration if verified; CTA.
- Company history, employee count, years, project counts and founder title are **unverified**; do not invent statistics such as “6+ projects”, “3+ years” or “4+ industries.”
- Personal portfolio: founder profile and selected projects, each with contribution label (Designed / Developed / Led / Concept).

### Contact frame
- Hero: “Have Something in Mind?”; practical form with name, email, project type, message and optional budget/timeline (only if useful); validated states and spam controls; contact methods from confirmed real data; concise relevant FAQs; strong final CTA.
- Do not invent a phone number, office address, social handle or operating hours. Email in mockups (e.g. `hello@motekra.com`) is **provisional until validated**.

## 6. Assets and authenticity inventory

### Provided visual sources
- `MOTEKRA_LinkedIn_Profile_400x400.png` — official symbol/image source.
- `MOTEKRA_LinkedIn_Company_Banner_1128x191.png` — official abstract banner inspiration.
- `image(20261024-234656).png` — initial detailed single-page storyboard/design with motion notes.
- `a_clean_modern_corporate_product_agency_landing_pa.png` — refined full-length homepage visual.
- `a_wide_ui_ux_website_mockup_layout_image_a_clean.png` — 5-page mockup, **layout reference**, not production copy proof.
- Six supplied PDF screenshots (one page each, image-only):
  - `18f8400e-473b-45df-b71d-216ad14f4e9b.pdf` — TOG Africa site screenshot.
  - `1836ab98-1426-4fca-b9fa-adb23268b2fd.pdf` — Spotlight Contest site screenshot.
  - `205d73c3-66c4-4918-9643-b0eadfcb3032.pdf` — LAD Global Travels site screenshot.
  - `b700f82e-b8c5-43e1-a3fe-64dc1fa1e32e.pdf` — MOTEKRA LinkedIn company page.
  - `eb4d75b3-7a73-4ba7-bfc6-876fba4f6315.pdf` — ConnectAPI design presentation.
  - `31e0817a-7526-47ec-b164-8e4c31e04d40.pdf` — founder professional LinkedIn profile screenshot.

### Candidate project catalog — require verification before launch
| Project | Evidence visible | Suggested bucket | Publishing guardrail |
|---|---|---|---|
| Spotlight Contest | Website screenshot | Web platform | Verify ownership, completion, live URL and role |
| LAD Global Travels | Website screenshot | Website / travel platform | Verify deployed status and role |
| TOG Africa | Website screenshot | Corporate website | Verify role and availability |
| ConnectAPI | Design presentation screenshot | UI/UX concept or product work | Label correctly; don't imply production integration without proof |
| Additional projects on Behance/Dribbble/GitHub | User-provided URLs | Selected design/development work | Curate only after checking specific artifacts and permissions |

### Supplied public profile links
- Behance: https://www.behance.net/akinwumayomipo/projects
- Dribbble: https://dribbble.com/meekmesh
- GitHub: https://github.com/ayjed
- LinkedIn: https://www.linkedin.com/in/akinwumi-ayomiposi/
- Company LinkedIn screenshot is supplied; obtain canonical current company URL before linking.

### Inspiration, not copying
- https://www.magika.studio/
- https://cubex.design/
- https://www.eloqwnt.com/
- https://www.davka.design/
- https://builder.atheros.ai/
- https://gapsystudio.com/
- Prompt inspiration only: https://promptsite.tiiny.site/

## 7. Locked technology and implementation architecture

- **Next.js (current stable, App Router) + TypeScript (strict)**; React Server Components by default.
- Tailwind CSS + CSS custom properties/design tokens; semantic reusable components.
- **GSAP + ScrollTrigger** = hero sequences, kinetic typography, scroll narratives and pinning (measured, scoped and safely reverted).
- **Three.js + React Three Fiber + Drei** = purposeful WebGL 3D interactive device/product scenes.
- **Motion for React** = microinteractions and simple route/element transitions; avoid duplicate animation responsibility with GSAP.
- **Lenis optional**, only if it does not undermine native scrolling, anchors, accessibility, touch or performance; skip if no tangible UX improvement.
- **Rive optional**, for small authored state machines only; do not depend on paid runtime/tooling.
- Next.js Image and Font optimizations; dynamic import client-only WebGL; asset caching; static generation/ISR as appropriate.
- Content initially typed MDX/JSON/TypeScript collections in repo to avoid CMS cost; choose simple editing approach. Only introduce a CMS/database if scope proves it is needed.
- Contact form: accessible server-side handler/API route with schema validation, rate limiting, honeypot/anti-spam, CSRF/origin checks as appropriate, and trusted delivery provider or verified SMTP; never expose secrets.
- Deployment: choose a Node-capable provider (e.g., Vercel or Node VPS); traditional static-only cPanel deployment is not equivalent to a full Next server. Document limitations before choosing hosting.

### Suggested folders
```text
src/
  app/
    (marketing)/page.tsx
    work/page.tsx
    work/[slug]/page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    team/[slug]/page.tsx
    insights/page.tsx
    insights/[slug]/page.tsx
    sitemap.ts
    robots.ts
    manifest.ts
  components/
    layout/ sections/ ui/ motion/ three/ forms/ seo/
  content/
    projects/ services/ articles/ team/
  lib/
    seo/ animations/ validation/ data/
  styles/
public/
  assets/brand/ assets/projects/ assets/3d/ assets/posters/
docs/
```

## 8. Heavy animation specification — mandatory, not optional

**Animation target: cinematic and immersive on capable devices; purpose-driven and respectful elsewhere.** Build coherent scenes, not a pack of generic scroll-fade cards.

| System | Signature effect | Trigger | Graceful fallback |
|---|---|---|---|
| Brand intro | Geometric logo assembly from supplied symbol; wordmark resolves | Page arrival | Immediate static logo |
| Hero title | Line masks + letter stagger + accent illumination | Page arrival | Readable full heading |
| Hero product | Cinematic 3D laptop/phone assembly, focus and cursor parallax | Arrival/pointer | Rendered image/poster |
| Hero-to-work | Product reframes into portfolio reveal; controlled perspective | Scroll | Simple section transition |
| Project gallery | Perspective card/image masks, custom cursor/focus affordance, pinned cinematic showcase on large desktop | Scroll, hover, focus | Normal grid |
| Service demos | Interactive UI state metamorphosis on meaningful service object, material/light changes | Scroll, hover, focus | Stills + readable service text |
| Process | Scroll-driven five-stage visual journey, glowing connection and staged product build | Scroll | Static numbered process |
| About | Editorial portrait reveal + layered biography/skills | Scroll | Static photo/text |
| Creative Lab | 3D card tilt and meaningful prototype loops | Pointer/focus | Accessible gallery |
| Contact | Slow sculptural depth and responsive CTA / form feedback | Scroll, focus | Static composition |
| Navigation | Staggered entrance, active indicator, full-screen mobile slide-over, polished route transition | Nav/open/click | Instant normal navigation |
| Microinteractions | Magnetic hover (pointer only), focus treatment, buttons with restrained optical depth | Hover/focus | Standard clickable buttons |

### Animation implementation constraints
- Avoid fully client-rendering indexable sections; render all business copy, headings, cards and links in semantic HTML **before JavaScript runs**.
- WebGL canvas is a visual layer, never the only source of content or an essential navigation control.
- Animate transforms/opacity where possible; use containment and avoid scroll-linked layout thrashing. Reserve image dimensions to avoid CLS.
- Clean up GSAP timelines, ScrollTriggers, event listeners, observers, and WebGL resources on unmount; account for React Strict Mode.
- `prefers-reduced-motion`: skip cinematic sequences, pinning and inertia; ensure all content/actions remain available.
- Mobile strategy: reduce draw calls, pixel ratio and meshes; use static posters at weak devices/reduced data; avoid battery-heating 3D scenes.
- Keyboard-focus equivalents for critical hover actions; meaningful labels and visible focus states.
- Don't turn scroll into an unescapable timeline; do not block wheel/touch gestures.
- Define measurable FPS and render budgets using real devices; add adaptive quality.
- Avoid endless continuous animation outside deliberate ambiance; pause when offscreen, tab backgrounded or lower-capability.
- Transitions must preserve navigation/back behavior and page titles.

## 9. SEO plan — engineered from day one

1. Render meaningful text and anchor links on server/static output; use SSR/SSG/ISR, not a blank JS-only shell.
2. Unique descriptive `<title>`, metadata descriptions, H1 and heading hierarchy on all pages; no keyword stuffing.
3. Canonical URLs, complete sitemap/robots, share previews, alt text, accessible internal linking, breadcrumb navigation where appropriate.
4. JSON-LD with valid factual `Organization`, `Person`, `WebSite`, `BreadcrumbList`, `Service`, `Article` only where justified; **no fabricated `AggregateRating`, reviews, achievements or fake schema claims**.
5. Service deep dives targeted to distinct commercial intents and genuine useful content, not doorway pages.
6. Case studies with crawlable problem/process/role/outcomes and linked service pages.
7. Insights articles must offer original technical advice; publishing cadence is optional, quality required.
8. Track and optimize LCP, INP, CLS; aim for Core Web Vitals good thresholds at p75 (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) while not treating scores as a ranking guarantee.
9. Verify Google Search Console and submit sitemap after domain setup; analytics consent/configuration consistent with privacy requirements.
10. Test real served HTML and Google indexing behavior, not just animation screenshots.

## 10. Accessibility, performance, security, QA

**Accessibility:** WCAG 2.2 AA target; semantic landmarks, accessible menus/carousels/forms, skip link, reduced motion, correct contrast, touch target sizes, focus management, keyboard-only test, screen-reader review, alt text/captions.

**Performance:** mobile-first responsive experience, lazy-load heavy scenes, selective hydration/client boundaries, compressed 3D assets (`glb`/`gltf`, Draco/Meshopt/KTX2 where practical), scene-level suspense placeholders, AVIF/WebP, image sizes and font subsetting; no unnecessary library duplication.

**Security:** validate/sanitize inputs, safe contact handling, protected secrets, anti-spam, security headers, no direct rendering of untrusted rich HTML. Respect licensed imagery/fonts and project confidentiality.

**Quality gates:** typecheck, lint, unit tests for data/forms, route checks, Playwright smoke tests across critical viewport sizes, axe accessibility, Lighthouse and Web Vitals checks, no broken links, metadata verification, form delivery test, error/404 behavior, network throttling, reduced-motion test.

## 11. Content and verification workflow

For each portfolio entry create a record:
```yaml
slug: ""
title: ""
status: "completed | concept | in-development"
ownership: "motekra | founder-independent | collaborator"
founderRole: []
companyRole: []
projectType: []
services: []
summary: ""
problem: ""
solution: ""
stack: []
resultsVerified: []
clientApproval: false
liveUrl: null
repoUrl: null
screenshots: []
seoTitle: ""
seoDescription: ""
```
No field should be embellished simply to fill a template. If evidence is unavailable, omit the claim or label it accurately.

## 12. Completion criteria

Project counts as launch-ready only if (a) all five approved pages and needed detail templates work, (b) brand and original supplied logo render accurately, (c) heavy animation systems exist on desktop with graceful mobile/fallback behavior, (d) copy and project attribution are verified, (e) SEO/metadata/indexability and page speed are validated, (f) contact process works, (g) keyboard/reduced-motion and responsive tests pass, (h) deployment and handover documented.

## 13. Decisions still requiring authentic inputs

- Final domain, contact email, verified phone/address (if any), hosting deployment target.
- Founder public name and title, authentic portrait, final bio, exact role per project.
- Which services MOTEKRA actively sells; specific service promises and target customers/regions.
- Which portfolio projects are delivered, in development or concepts; client permission to display each.
- Actual videos/interactive 3D assets, content licenses, final font selections.
- Consent/privacy copy, mail delivery and analytics configuration.

**Until confirmed:** build the page structure with clear internal TODOs, never ship invented data as production truth.
