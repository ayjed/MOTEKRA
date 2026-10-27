# MOTEKRA — live implementation review

2026-10-26 · Design 02 · **Review checkpoint; not launch approval.**

The actual production build was navigated interactively in the local in-app browser. The supplied `five frames.png` and Master Blueprint were inspected alongside it. All five routes were captured at 1440×960 and 390×844. Contact navigation was checked at 844×390, 320×568 and 390×844. Home and Services recordings were decoded at selected timestamps. This was a local interactive review, not a claim that an external ChatGPT browsing tool or Cloud Browser accessed the tunnel.

Application code was not changed during this review. Two capture-harness assumptions were corrected: an offscreen, opt-in Services canvas must not be required to become ready, and landscape width 844 correctly uses desktop navigation. The new anchor reproduction script and capture-script changes are audit tooling.

## Confirmed priorities

| Priority | Finding | Evidence / correction direction |
|---|---|---|
| P0 · release gate | Startup and interaction budgets still fail. | Existing serial Lighthouse mobile LCP 3.33–4.12 s, TBT 621–851 ms; independent throttled mobile profile LCP 3.58–8.46 s, interaction samples 720–1,848 ms. Desktop software-WebGL Home/Contact TBT 1,694/2,080 ms. Optimize measured main-thread/hydration/render costs while retaining substantial motion. These interaction samples are not field INP; mobile Lighthouse has slow-host warnings. |
| P0 · owner configuration | Contact cannot currently receive inquiries. | Live form resolves to “Delivery not connected.” The disabled state is correct. Configure the private recipient/provider/sender/origin and verify an actual inbox receipt before release; do not merely enable the button or claim success. |
| P1 · confirmed UX defect | Home re-hides an already visible headline when the delayed intro starts. | `home-intro-review.png`: recording at 1–2 s shows the full headline, 3 s shows its area blank, and 4–5 s restores it. `HomeCinema` adds `data-hero-playing` after GSAP initialization; CSS keyframes use a backwards fill. Keep kinetic letters/logo/nav choreography, but avoid replaying a hidden initial state after first readable paint. |
| P1 · visual fidelity | Poster → WebGL is a visibly different composition. | Poster is large, angled and graph-based; live devices are smaller, more frontal and show different Explore/Define/Create UI. Compare recording at 3/6/11 s and `viewport-home-1440.png`. Match camera bounds, projected device scale/pose and screen content before handing off. The live scene must look at least as intentional as its fallback. |
| P1 · rendering quality | Live hero edges/UI look soft and jagged; Contact’s live envelope has a flat triangular front compared with its crisp poster. | Inspected live and in desktop captures. Review `AdaptiveDpr pixelated`, effective resolution during regression, framing, normals/materials and lighting. Measure proposed changes; do not solve this by unbounded DPR, heavy postprocessing or replacing interactive scenes with static-only visuals. |
| P1 · interaction layout | Short desktop viewports can separate service artwork from its controls. | At 1176×607, activating “Transform the interface” scrolls the control into view while much of the transformed artwork is above the viewport. Keep the control, meaningful visual change and short result explanation observable together. Verify keyboard and touch as well as pointer input. |
| P1 · content gate | The real portfolio and authentic founder imagery remain missing. | Work exposes three internal website studies; company/founder categories each have zero cleared entries. About/Home honestly show a portrait-pending panel. These are owner-evidence dependencies, not permission to fabricate replacements or publish supplied screenshots as completed company work. |
| P2 · composition | Some inner-page heroes spend a large portion of a short laptop viewport on blank vertical spacing; the top of the form/collection is far below the title. | About desktop capture and live 1176×607 review. Rebalance height-aware spacing and artwork scale against the five-frame composition without changing approved headings, palette or editorial character. |
| P2 · narrative polish | Process stages work, but Launch becomes mostly text and an arrow in a large empty panel. | Live scroll changed Discover to Launch with the correct active milestone. Improve the final product state and transition continuity rather than adding unrelated floating objects. |
| P2 · public copy | Repeated verification/implementation paragraphs dominate parts of Work, Services and Contact. | Preserve conspicuous truthful status/attribution, but consolidate repeated explanations into concise notes and meaningful labels. Do not remove pending labels until approval exists. |

## Five-page assessment

**Home:** Exact core headline/support copy and CTAs are present. Eight sections, supplied raster mark, product UI, navy Work/process, five-stage progression, Creative Lab and footer exist. The delayed headline replay and poster/live mismatch are the clearest defects. The device model needs more deliberate art direction and sharpness before it matches the premium reference. Founder and client proof remain pending.

**Work:** Header, varied card sizing, URL-based category filters, concepts and experiments exist. Clicking Company/shipped preserved focus and displayed an honest empty state; no case-study success was invented. The page currently functions as an internal-study gallery, not a convincing real-project portfolio. Obtain per-project authorship, contribution, status, permission and clean assets for Spotlight Contest, LAD Global Travels, TOG Africa and ConnectAPI before publishing any applicable case.

**Services:** Five differentiated UI-based demonstrations and corresponding detail pages are implemented; the native UI/UX toggle transformed the wireframe and exposed its result. There is real interaction, not just decorative spinning. Improve short-viewport demo/control composition and visual consistency. The optional mobile-flow depth remains opt-in, and all service scopes remain provisional.

**About:** Company/founder identity is separated, verified name/title/social links are used, proposed biography/values are labelled, and no experience figures were fabricated. The oversized pending portrait occupies a key editorial position; release needs the authentic approved original. Rebalance the very tall opening composition and refine the meaningful interface background, without copying the mockup person or invented metrics.

**Contact:** Labelled fields, FAQs, inquiry anchor, sculpture/poster and professional-profile links are present. The live availability fetch correctly disables delivery when unconfigured. Source review confirms a minimal endpoint and no database. No actual email was sent during this review. Improve live sculpture fidelity and keep delivery status unambiguous throughout hydration. Missing phone/address/public Gmail is intentional.

## New verification evidence

- `evidence/phase-09/viewport-audit.json`: ten main-page viewport checks and three orientation/navigation checks; one H1 and no horizontal overflow in the captured page checks. Desktop landscape navigation is expected at 844px; 320/390px drawers open and close.
- `evidence/phase-09/scene-lifecycle.json`: three scene families × high/balanced. All settled-idle and hidden draw deltas are zero. High Contact recorded five offscreen draws and balanced Home ten: one extra scene frame each in the sample. Other offscreen deltas are zero. Investigate transition/DPR invalidation before claiming strict zero offscreen rendering.
- All six route-unmounted canvases were disconnected and contexts lost. Raw remaining-object counters include implicitly released resources after context loss; they do **not** establish a GPU leak or measured VRAM. Authored-resource and renderer ownership still warrant source review, particularly balanced-mode counters.
- Software renderer pointer-frame-clear proxies: high Home 20.5/s, Contact 24.3/s, mobile flow 28.0/s; balanced/4× CPU 31.1/32.9/41.6/s respectively. These are not physical-display FPS and must not be marketed as a speed improvement.
- `evidence/phase-09/preview-route-audit.json`: fresh no-JavaScript audit passes 12 routes, 15 internal targets and six deliberate 404s. Preview noindex, empty sitemap and approval-gated schema remain correct; no production domain or indexing acceptance is implied.
- `evidence/design-review/cold-anchor-review.json`: the suspected cold `#home-process` jump did **not** reproduce at 1176, 1440 or 390px. The target stayed approximately 32px from the top at 0.25/1/3/7 seconds. Do not file it as a confirmed application defect based on one interactive observation.
- Actual viewport screenshots did not reproduce the repeated strip in the older tall Home screenshot. Use viewport evidence for acceptance; do not make an application patch based solely on a capture artifact.
- Existing same-build proof remains: strict typecheck/lint/build, 55 unit tests, 43 browser tests, 24 zero-violation full axe audits and zero known dependency advisories. Those suites were not all rerun in this review; audit tooling receives a fresh lint check.

Home recording duration: 34.56 s; Services: 26.68 s. Selected decoded frames were inspected, not a physical-device smoothness certification. Actual screen-reader speech and real mid-range phone/field p75 CWV remain unverified.

## Handoff

Use `CODEX_CORRECTION_PROMPT.md` for a bounded implementation pass with review checkpoints. Keep Phase 09 open. No deployment, publication approval, invented client proof, founder image or paid infrastructure follows from this review.
