# Phase 05 — Services and proposed detail pages

2026-10-25 · Codex · Local implementation and review. The user's Services request authorizes Phase 05. No deployment, paid dependency or new client claim. Phase 06 has not started.

## Composition and interaction

The Services landing page uses the locked **“End-to-end Digital Solutions.”** heading and Design 02 palette/type/grid. Five numbered chapters alternate white/ice-blue and navy, with large service-specific interface compositions, a chapter index, proposed scope labels, detail links, the existing Discover/Define/Design/Develop/Launch process, scope guidance and the contact CTA.

Each chapter has an actual native-details state transformation:

| Proposed capability | Interface demonstration |
|---|---|
| UI/UX Design | Wireframe becomes a composed interface; tokens settle into a visual system |
| Web Development | Layered app windows reframe from wide to compact composition |
| Mobile App Development | Explore/detail phone states change visual focus and depth |
| Product Strategy | Questions and scattered checkpoints align into staged priorities |
| Brand & Visual Design | Original MOTEKRA mark, type and colour specimens compose into a system |

These are authored website studies, not client projects or deployed products. No API result, metric, performance figure or business outcome is invented inside the visuals. The brand module reuses the unchanged supplied MOTEKRA PNG; it does not draw a replacement mark.

GSAP owns the heading sequence, five distinct scroll poses and chapter energy rules. Each visual's CSS state transformation sits inside a separate choreography wrapper to avoid competing for the same transform. Native scrolling is retained. The chapter index marks the active location during enhanced scrolling. Scoped media/context cleanup reverts animation and listeners on teardown or reduced-motion changes. CSS controls use bounded transitions; no arbitrary spinning objects or endless loops were added.

## Optional mobile R3F enhancement

Only the mobile-flow demonstration has an optional R3F scene. It loads after explicit opt-in on an eligible device and renders two purposeful phone interfaces with finite selection/depth transitions and pointer response. All five CSS 3D/native prototypes work independently. No canvas is mounted by default, and no WebGL scene is created for mobile, reduced motion, data saving or low-capability policy tiers.

The shared `SceneBoundary` adds a scene-kind selector while keeping the existing device scene as its default. The new model is a separate dynamic import. The existing poster/probe/error/readiness policy is retained and now keys readiness by scene kind as well as quality and forced poster state. The new scene uses demand rendering, bounded DPR/adaptive quality and visibility-based pause. Textures, listeners and R3F-owned resources dispose on teardown. Shared Home scene/navigation regression is included because this wrapper is reused there.

Recording review exposed a brief poster/canvas overlap during renderer warm-up. The canvas layer now remains invisible until the current instance has rendered its readiness frames, then replaces the poster in the same update. This avoids duplicated devices while retaining the server fallback and reserved layout dimensions.

WebGL remains a decorative enhancement. Concept graphics, semantic service copy, navigation, prototype controls and CTAs all exist without it. Native prototype changes and FAQs also work with JavaScript disabled. Offscreen/hidden pausing, live preference changes and context-loss fallback are verified separately from visual screenshots.

## Genuine provisional content and SEO

All five service records remain `publication: draft`, with visible provisional/scope/availability labels. Each `/services/[slug]` has a distinct title/description, clear overview, four potential deliverables, a three-stage proposed approach, three genuine FAQs, related-case handling and a contextual CTA. Existing descriptions and service names remain. There are no promised budgets, dates, rankings, technology stacks, active availability or results.

Related cases require the existing project publication/permission/attribution guard **and** an explicit approved `serviceSlugs` relationship. No project has that approval yet, so the pages state that no approved client case is linked and offer the honestly labelled Work collection. Spotlight Contest, LAD Global Travels, TOG Africa and ConnectAPI are not silently linked as delivered service proof.

The pages are server-rendered/static-generated. Client boundaries own choreography, optional scene state and the lazy renderer only. Business copy, deliverables, links and FAQs are server content. Draft service pages use noindex metadata; provisional services and their listing stay out of sitemap discovery even if a future global indexing flag is enabled. Service structured data is emitted only after an offering is approved and the site has a valid approved origin/indexability. No active Service/Offer/rating schema is emitted for the current proposals.

## Implementation map

| Area | Source |
|---|---|
| Landing/detail RSC | `src/components/services/services-page.tsx`, `service-detail.tsx`, App Router service pages |
| Proposed editorial content | `src/content/services/details.ts`; existing five service records unchanged |
| Native prototype artwork | `prototype-art.tsx`, `service-playground.tsx`, `src/styles/services.css` |
| GSAP orchestration | `services-cinema.tsx` |
| Optional real 3D | `mobile-depth.tsx`, `src/components/three/mobile-flow-scene.tsx`, shared `scene-boundary.tsx` |
| Metadata/schema/related work | `src/lib/data/services.ts`, approved-only sitemap logic |
| QA | `tests/unit/services.test.ts`, `tests/smoke/services.spec.ts`, `playwright.services.config.ts`, `scripts/services-review.mjs` |

## Review and remaining gates

Production build, typecheck and lint pass; **33 unit tests**, **nine Services functional/browser checks** and **two shared public HTML/404 regressions** pass. The accessibility check covers all six service pages at desktop and mobile (**12 reports, zero violations**). Focused responsive/recording rechecks follow the final typography correction. Baseline pages create no canvas; the opt-in renderer and native/static states are tested separately.

The final gallery contains **45 captures** and a **27.32-second, 1440×960** playback-verified walkthrough. Extracted frames were visually inspected, including the corrected single-pair phone loading handoff. All five detail CTAs fit inside a 320px viewport. Final simulated-mobile default Services Lighthouse: **64 performance / 100 accessibility / 100 best practices / 66 SEO**, FCP **1.6 s**, LCP **3.6 s**, blocking time **1,300 ms**, CLS **0**, transfer **350 KiB**. The host CPU warning is retained. Mobile paint/main-thread work remains below sign-off; this is not a field Core Web Vitals result. The preview noindex deduction is intentional.

See [the evidence gallery](evidence/phase-05/index.html) and its README for exact checks, screenshots, playback validation, source HTML, resource/link audit and local performance report. Automated tests and emulation are not WCAG certification or real-device/field Core Web Vitals. Real handset/GPU/assistive-technology coverage and prior Home/Work performance gaps remain open.

Owner confirmation of active service scope and deliverables is still required. Related client cases remain unavailable until roles, ownership, delivery status, service association and display permission are approved. Domain/contact delivery, founder portrait and other content/release gates remain unchanged. Review this phase before Phase 06.
