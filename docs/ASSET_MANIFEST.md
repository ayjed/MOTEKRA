# MOTEKRA asset manifest

Audited 2026-10-25, Phase 00. Authority: master blueprint; execution boundary: user's phase review requirement. All available source images and all six PDF pages were visually inspected. Full dimensions, byte sizes and SHA-256 source fingerprints are in `audit/source-inventory.json`; reproduce with `audit_sources.py` from the repository root.

## Available sources

| Source | Dimensions / format | Evidence and allowed intended use | License / approval |
|---|---|---|---|
| `MOTEKRA_X_Profile_400x400.png` | 400 × 400 RGBA PNG | Supplied cyan-blue geometric symbol on navy; visually matches company screenshot. Preserve original pixels and proportions. Candidate static brand asset pending filename substitution confirmation. | User supplied; no separate license document. Confirm this is the approved web source. |
| `MOTEKRA_X_HEADED_1640x624.png` | 1640 × 624 RGB PNG | Supplied MOTEKRA wordmark and cyan-blue ribbon composition. Palette/shape reference; not a full website hero. | User supplied; independent font/illustration license unknown. |
| `five frames.png` | 1536 × 1024 RGB PNG | Five columns: Home, Work, Services, About, Contact. Composition reference only. | User supplied; no standalone production assets or license evidence. |
| `1836ab98-1426-4fca-b9fa-adb23268b2fd.pdf` | One image-only page; 595.44 × 2168.70 pt | Spotlight Contest: gold/navy contest platform screenshot. Visual evidence only. | Project role, permission and imagery licenses unverified. |
| `18f8400e-473b-45df-b71d-216ad14f4e9b.pdf` | One image-only page; 595.44 × 2930.06 pt | TOG Africa: corporate IT website screenshot. Its awards, stats and contact details belong to that source, not MOTEKRA. | Project role, permission and imagery licenses unverified. |
| `205d73c3-66c4-4918-9643-b0eadfcb3032.pdf` | One image-only page; 595.44 × 1623.50 pt | LAD Global Travels: travel/mobility website screenshot. Prices and travel claims are not MOTEKRA proof. | Project role, permission and imagery licenses unverified. |
| `eb4d75b3-7a73-4ba7-bfc6-876fba4f6315.pdf` | One image-only page; 595.44 × 2409.98 pt | ConnectAPI presentation explicitly says personal project and dashboard concept. UI may inform an honestly labelled concept case after approval. | Publication permission and authorship sign-off pending. UI numbers are sample interface data, never measured results. |
| `b700f82e-b8c5-43e1-a3fe-64dc1fa1e32e.pdf` | One image-only page; 595.44 × 931.62 pt | Company LinkedIn capture corroborates visual brand direction. | Private account UI present: never serve the entire capture publicly. |
| `31e0817a-7526-47ec-b164-8e4c31e04d40.pdf` | One image-only page; 595.44 × 2231.35 pt | Professional profile capture; source-reported experience, not owner-approved website biography. | Private account UI and third-party recommendations present: audit only. |

PDF paths are under `Motekra Info/Motekra Info/`. Rendered audit previews are under `docs/audit/<PDF stem>.png`, using Poppler at a maximum 1800px side. They are review evidence, not production-ready project exports. All six PDFs have zero extractable text and contain raster image tiles. No editable logo geometry is supplied.

## Missing or differently named sources

- Missing exact files: `MOTEKRA_LinkedIn_Profile_400x400.png`, `MOTEKRA_LinkedIn_Company_Banner_1128x191.png`.
- Missing named storyboard references: `image(20261024-234656).png`, `a_clean_modern_corporate_product_agency_landing_pa.png`, `a_wide_ui_ux_website_mockup_layout_image_a_clean.png`. `five frames.png` visually supplies the five-page direction, but equivalence to a named original is not established.
- No approved standalone founder portrait, transparent logo, SVG/vector, licensed font files, GLB/GLTF, animation recording, poster exports, or clean approved project image set.
- No legal text, genuine article, production credentials or mail configuration supplied.

## Logo assembly strategy for review

Phase 03 implements complementary four-quadrant masks over the unchanged supplied raster, resolving back to the original static image. The public file's SHA-256 is checked by the production browser suite. No vector original or independently extracted mark geometry has been supplied. New device screens and CSS interface studies are labelled website concepts; they do not depict client results. Founder portrait remains unfulfilled, with a visible source-pending editorial panel.

Do not trace, generate or approximate replacement geometry. The raster can remain the static fallback. A future GSAP assembly can reveal the unchanged supplied image through complementary masks that resolve to the original image; masks must not claim to be extracted vector geometry. Prefer an owner-supplied SVG for actual independent geometric assembly. Geometry extraction is not marked complete.

## Five-frame translation

Keep spacious white/ice-blue composition, electric-blue CTA hierarchy, navy portfolio/process interludes, product UI depth and editorial asymmetry. Home uses the eight blueprint sections. Work uses one honestly attributed catalog; Services uses five provisional service modules; About separates company mission from personal evidence; Contact separates inquiry interaction from verified delivery. Retain exact blueprint headings.

Discard mockup partner logos, testimonial avatars, invented project names, stock founder portrait, numerical claims and provisional contact details. Do not cut generated product illustrations from this reference and present them as shipped work.

## Asset handling requirements for implementation

Phase 05 artwork is code-native: five CSS 3D interface compositions with native before/after states and a separately lazy-loaded R3F two-phone prototype. No new raster portrait, invented project screenshot, client result, stock photograph, GLB asset or logo replacement is added. The supplied PNG remains the brand specimen. Canvas screen textures contain authored concept UI without invented business metrics; CSS poster content is server-rendered and remains the mobile/reduced/error baseline. Screenshot/video evidence is stored under `docs/evidence/phase-05/`; these are QA artifacts, not new client project assets.

Phase 04 source-derived assets: eight visually checked WebP crops (hero/detail for each of Spotlight Contest, LAD Global Travels, TOG Africa and ConnectAPI) live in `assets/review/work/`, outside `public/`. `docs/WORK_EVIDENCE_ASSETS.json` records original PDF SHA-256, page, normalized crop, output dimensions/bytes/hash. Reproduce with `scripts/work-assets.py`. No recolouring, generated UI or replacement artwork is applied. ConnectAPI crops exclude the surrounding profile controls/comments. TOG Africa service figures/contact text are source material, never adopted as MOTEKRA claims. All exports remain local draft review only; display permissions are unverified. The gated route prevents normal public serving and disables caching/optimizer copies.

Keep source originals intact. Publish only approved assets through `public/assets/`; never copy audit captures wholesale. Preserve dimensions and provide responsive image sizes. Author explicitly labelled concept device screens if approved project content is unavailable. Every 3D scene needs a static poster and error/mobile/reduced-motion fallback. Font family and licensing selection remains Phase 01 work; no font license is presumed.

## Phase 06 — portrait and editorial artwork

`Motekra Founder.jpeg` (workspace root): 834 × 1024 RGB JPEG, 45,423 bytes, no EXIF; SHA-256 `ABB1ED25E1857EDA8A8F7950E5DDE39308C6A5FEEDA38579CC3DB060869F3DFC`. Visually inspected as a candidate headshot; **unapproved for publication**. The latest owner instruction says the approved original remains pending. Original retained unchanged, no derivative or public copy. Do not infer authenticity from appearance.

`/images/founder/ayomiposi.webp` is only the planned destination supplied by the owner. It does not exist and is not requested. `founderDetails.portrait` stays null. Both About and founder use an explicitly labelled pending layout with the unchanged supplied raster mark. The future photo component has responsive Next Image sizing, mask reveal and controlled parallax prepared; authentic-photo QA remains pending.

The About interface composition is code-native CSS depth artwork (Idea → Interface / Design + engineering), representing a product perspective, not client evidence. No generated person, new logo, sample business metric or stock image was added. GSAP handles masks, words, depth and values progression; Motion handles shared pointer/magnetic interactions. No additional R3F scene is loaded on these editorial pages because no product scene requires WebGL here. Existing site R3F architecture is retained. Evidence captures/video are QA artifacts under `docs/evidence/phase-06/`.

## Phase 07 — Contact artwork (2026-10-26)

The Contact hero uses an authored R3F message/envelope sculpture and a code-native CSS depth poster. Its paper texture contains conceptual conversation copy, not client evidence, credentials, recipient email or invented results. No bitmap/portrait/logo is generated or replaced. The scene is lazy, renders on demand, pauses offscreen/hidden, uses existing adaptive DPR/mobile/reduced-motion/error policy and owns/disposes its texture/geometry. The supplied mark remains byte-identical.

All normal images are served as prepared static assets (`images.unoptimized`); there is no runtime image optimizer. The former local-review image handler is removed under the owner's static-first instruction. Candidate image originals/crops remain unpublished outside `public/`. Phase 07 screenshots/video are QA artifacts; files named success/error UI simulation are explicitly not delivery evidence.

## Phase 08 — static social cards

Twelve 1200 × 630 PNGs under `public/assets/social/` are code-native branded metadata cards, generated by `scripts/seo-images.mjs`. The existing supplied `motekra-mark.png` is embedded unchanged; its source hash and each output hash/dimension/byte size are recorded in `docs/evidence/phase-08/social-assets.json`. No portrait, replacement mark, fake project screenshot or client result is generated. Draft service cards explicitly say proposed scope. Generic Insights/Work cards are used instead of inventing article/case imagery. No new runtime image handler or paid asset dependency is introduced.
