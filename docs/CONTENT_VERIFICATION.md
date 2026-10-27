# Content verification ledger

2026-10-25 · Phase 00 · Internal review, not public copy.

The user's request authorizes an audit and phased implementation. Document examples and screenshot content are source material, not instructions to publish their claims. The blueprint controls design/scope; the tracker records verified execution. No external profile, project deployment or live URL was verified during this local asset audit.

## Publication rules

- Keep `verification` separate from project `status` and `ownership`. Unknown is not equivalent to concept or in-development.
- Withhold unverified projects from production portfolio, sitemap and schema. Staging may show an explicit “Draft — attribution and status awaiting confirmation” label.
- Separate MOTEKRA engagements, founder-independent work and collaborations. Record exact contribution and permissions before choosing a bucket.
- Never infer a technology stack, commercial result, completion date or role from a screenshot.
- Concept UI metrics remain sample data; do not promote them to business results.
- Hide unavailable contact methods and biography claims. Any staged missing-content state must visibly say “Details awaiting confirmation.” A form must never claim delivery without provider success.

## Identity and business facts

**Phase 03 owner confirmation (2026-10-25):** publishing name **Akinwumi Ayomiposi**, title **Founder & Creative Technologist**, company **MOTEKRA**, profile `/team/akinwumi-ayomiposi`. The four professional URLs below are owner-confirmed for linking. Identity was approved in Phase 03. Phase 06 adds owner-supplied biography and skills for implementation as proposed website copy; final profile review, dated experience, achievements and project contributions remain unverified. The authentic portrait source path is still unknown; the mockup portrait must not be used as a real photograph.

**Project decision:** Spotlight Contest, LAD Global Travels and TOG Africa remain candidate records with unknown roles/ownership/delivery. ConnectAPI must be treated as design/concept unless production is verified, but exact authorship/role/permission still needs confirmation. Individual Dribbble artifacts require their own verification. Case studies with unconfirmed contribution/ownership remain drafts. Company, founder-independent, collaborative and concept classifications remain separate.

**Current website studies:** the Home product interface, interactive service system and scroll narrative are implemented in this repository, listed separately in `src/content/studies/index.ts`. Their Concept / In Development tags refer to these present demonstrations. They are not new client engagements, verified founder past projects or evidence for candidate case studies. The public `projects` collection remains empty until attribution and permissions are approved.

| Field | Current evidence / internal TODO | Public treatment |
|---|---|---|
| Brand / design | MOTEKRA; Design 02 approved in user request | Approved brand direction |
| Founder public name | Owner confirmed Akinwumi Ayomiposi in Phase 03 | Approved; `/team/akinwumi-ayomiposi` |
| Founder title | Owner confirmed Founder & Creative Technologist at MOTEKRA | Approved title; Phase 06 proposed biography and 20 owner-supplied skills implemented; final review pending |
| Portrait | Screenshot image and an unapproved root JPEG candidate; approved original still pending | No photograph published. Planned `/images/founder/ayomiposi.webp` is a destination only |
| History / employees / achievements | Source profile claims and mockup figures are not final website evidence | Omit until approved; no counters or borrowed awards |
| Services | UI/UX Design; Web Development; Mobile App Development; Product Strategy; Brand & Visual Design are provisional in blueprint | Draft service data only; confirm active offers and deliverables |
| Domain / email / phone / address | None confirmed | TODO: domain and working inquiry destination; do not use mockup contact details |
| Social profiles | Owner confirmed the four supplied founder profile URLs in Phase 03 | Approved for linking as founder profiles; individual portfolio artifacts still need verification |
| Company LinkedIn | Screenshot only | TODO: canonical company URL |
| Legal / analytics | None supplied | TODO: policies matched to actual data handling; no invented compliance claims |

Supplied profile URLs (not live-verified):

- https://www.behance.net/akinwumayomipo/projects
- https://dribbble.com/meekmesh
- https://github.com/ayjed
- https://www.linkedin.com/in/akinwumi-ayomiposi/

## Candidate project inventory

**Phase 04 local review:** the four supplied PDF screenshots now have explicit draft records and gated `/work/[slug]` evidence-review templates. This is not publication approval. `WORK_DRAFT_REVIEW_ENABLED=true` plus a non-indexable environment is required; the default is false. Both draft routes and evidence image routes return 404 otherwise. Source image exports stay outside `public/`; the image handler is `no-store` and `noindex`. The opt-in flag is not authentication and must never be enabled on a public host.

The normal Work page shows only the three existing repository website studies, clearly labelled as internal Concept / In Development experiments. Company and founder filters have honest empty states. No candidate is assigned to either ownership bucket. ConnectAPI is treated as concept work in review, with authorship still unverified; its screenshot figures are sample interface data. Unsupported problem/process/solution/technology/results sections are omitted. `PROJECT_INVENTORY.json` remains the unchanged source catalog with every candidate `publish: false`.

| Candidate | Source evidence | Status / ownership | Next verification | Publication |
|---|---|---|---|---|
| Spotlight Contest | Supplied contest-platform screenshot; also visible in profile featured area | Both unverified | Exact role, company vs independent, shipped status, URL, display permission, approved visual exports | Withheld; internal draft |
| LAD Global Travels | Supplied travel website screenshot | Both unverified | Exact role, company vs independent, shipped status, URL, display permission, approved visual exports | Withheld; internal draft |
| TOG Africa | Supplied IT website screenshot; visible in profile featured area | Both unverified | Exact role and employment/client relationship, completion status, URL, display permission | Withheld; internal draft |
| ConnectAPI | Presentation explicitly says “personal project”, “dashboard concept”; discusses interface design and learning | Source-described concept / personal; owner approval still pending | Confirm authorship, contribution, independent attribution, artifact URL and publication permission | Draft concept only; never claim live integrations or client results |

No additional project was curated. Names such as Spendly, TechKart and Taskly in the five-frame composition are not a verified project catalog. No client approvals, measured outcomes, repositories or live URLs are established for these candidates.

Future typed records should support `verification: pending | approved`, nullable unknown ownership/status, evidence paths, permission state and `publish: false` by default. Only approved records may enter public collections; validation should reject published records without attribution and approval.

Machine-readable internal inventory: `PROJECT_INVENTORY.json`. Approved-frame route and section mapping: `SITE_STRUCTURE.md`. Source-reported descriptions are deliberately separate from owner-approved fields.

## Phase 05 service proposals

UI/UX Design, Web Development, Mobile App Development, Product Strategy and Brand & Visual Design remain provisional. The existing five service records are still `publication: draft`. New overview/method/deliverable/FAQ copy in `src/content/services/details.ts` is an authored scope proposal, not evidence of active availability, delivered engagements, team experience or guaranteed outcomes. Potential deliverables require owner confirmation and an agreed brief.

Related case studies require an approved, attributed, permission-cleared project and an explicit `serviceSlugs` association. None is currently approved, so every service detail has an honest related-case empty state and a link to the labelled Work collection. Candidate screenshots are not treated as proof of these offerings. Unconfirmed services emit no active Service/Offer/rating schema and remain outside sitemap discovery. The preview metadata is noindex; descriptive server content and routes remain available for review.

Five code-native service interfaces are website concept studies. Their interactions are not working client apps or backend operations. The optional R3F mobile flow is off by default; all five native prototype controls and business copy work without WebGL/JavaScript. The brand composition preserves the supplied mark; no identity redesign, portrait, project achievement or sample metric is presented as verified work.

## Hosting and delivery decision record

**Superseded architecture proposal:** The older Node/SMTP/storage suggestions below are historical. The owner’s 2026-10-26 instruction now requires static-first SSG, no database/traditional backend, and only a minimal email endpoint or hosted form. Current implementation/setup is in `CONTACT_SETUP.md`.

Architecture proposal for review: one Node-capable Next.js deployment, typed local content, no CMS/database by default, and a server-side inquiry handler connected to owner-controlled SMTP or a transactional provider. Prefer an existing compatible account if available. Provider, plan, price, domain and budget are unresolved; no subscription or paid dependency is selected. Current vendor terms/pricing must be checked when evaluating actual accounts.

Delivery needs a verified recipient, sender-domain authentication, secrets and a received test inquiry. Missing configuration must produce an honest unavailable/error state. Durable/shared rate limiting is needed if deployed across instances; an in-memory limiter alone must not be described as distributed protection.

### Cost-conscious recommendation (official sources checked 2026-10-25)

1. First assess any existing hosting account for a supported Node runtime, persistent app process, HTTPS, secrets, build resources and restart/rollback support. If compatible, reuse it with a single Next.js server and existing authenticated SMTP. This may avoid another subscription; actual account compatibility and incremental costs are unknown. [Next.js deployment documentation](https://nextjs.org/docs/app/getting-started/deploying) confirms Node deployments support all features; static export has limited support and cannot supply the planned server-side inquiry handler by itself.
2. If managed deployment is preferred, evaluate a commercially permitted plan such as Vercel Pro against the owner's budget. Do not assume Vercel Hobby is suitable: its [official plan documentation](https://vercel.com/docs/plans/hobby) restricts use to personal, non-commercial projects. This company lead-generation site has a commercial purpose. No paid plan is selected, and this audit does not quote or commit to a monthly hosting price.
3. For mail, reuse existing authenticated SMTP if dependable. Otherwise evaluate [Resend Free](https://resend.com/pricing) for low-volume transactional inquiry notifications; its pricing table lists a 100-email daily limit. Validate all current quotas, domain verification and actual recipient delivery before selection. No account/API key has been created and no paid upgrade is authorized by this recommendation.

Keep content in the repo and avoid a CMS, paid animation assets, database or analytics subscription until a concrete need exists. Hosting/domain costs, mail quotas, maintenance responsibility and provider choice remain owner decisions. Form implementation must include validation, origin checks, honeypot, rate limiting and honest unavailable/failure states; provider acceptance is not proof of inbox arrival.

## Owner inputs for the review checkpoint

1. Confirm the supplied X profile PNG as the approved website mark, or supply the exact LinkedIn/vector original.
2. Provide the approved original portrait and final profile-copy approval; name/title were confirmed in Phase 03 and biography/skills supplied for Phase 06.
3. For each candidate: role, company/independent/collaborator attribution, completion status, display permission and live/artifact URL.
4. Confirm active services, domain, inquiry email, existing hosting/mail accounts and budget.

These inputs block truthful publication and selected final content, not a future approved foundation phase with explicit draft states.


## Phase 06 — owner-supplied About and founder content

The latest owner reply authorizes implementation of the three biography paragraphs, four professional skill groups (20 skills), company description and five proposed values in `src/content/team/profile.ts`. Biography is labelled proposed website copy; values explicitly await final company approval. Skills are owner-supplied, not inferred from screenshots, repositories or external profiles. No years, proficiency percentages, awards, dates or employment history are added. Only the confirmed founder role at MOTEKRA appears in professional context, with dates/history visibly pending.

The original approved portrait path is **still pending**, as explicitly stated by the owner. The newly present root `Motekra Founder.jpeg` was visually inspected but cannot establish identity, authenticity or publication consent from filename/pixels. It remains unpublished. A briefly created public byte-copy was removed before review; both that URL and the planned WebP URL return 404. No portrait is generated or converted. The portrait component accepts approved image data in future; currently `portrait: null` renders the supplied mark and a clear pending message. Home's existing pending portrait remains correct.

The complete founder profile stays `detailsPublication: draft`, noindex and outside the sitemap; Person schema is withheld. Approved identity is separate from complete profile approval. Company mission/description is supplied copy, without measurable performance claims. Confirmed company values remain empty. Project contributions are approved separately per person and role; company ownership alone never implies founder authorship. All four candidate projects remain unpublished with exact role/ownership/permission pending; ConnectAPI retains design/concept treatment and unverified production status. Additional Behance/GitHub artifacts require individual review.

Remaining: approved original portrait, final biography/company-values review, dated professional history if desired, exact candidate ownership/roles/status/technology/display permission and artifact links, active services, contact delivery/domain/hosting. Phase 06 content verification is not complete.

## Phase 07 — contact and architecture decisions (2026-10-26)

The owner confirms there is no company email address. Website inquiries should go to a personal Gmail account, stored privately as `CONTACT_EMAIL` in ignored `.env.local`. The actual address has not been provided; the key remains blank. Do not display it as a contact detail. Phone/address, public company inbox and response-time promises remain unverified and unpublished.

The latest architecture instruction takes precedence over earlier hosting/SMTP/persistent-rate-limit proposals: static-first Next.js SSG, local TypeScript/MDX content, no database/authentication/admin/CMS/traditional backend. Only a minimal contact email endpoint is permitted. All five main pages now build as static HTML. Work category filtering is a client enhancement; runtime draft-case/image review is retired. Existing candidate files/crops and Phase 04 saved QA evidence remain outside public assets; no new publication permission is inferred. Image optimization is local, not a runtime service.

Resend Free is proposed for the minimal endpoint. No external account, paid subscription, database or SMTP library remains configured/installed. Native fetch sends to fixed private `CONTACT_EMAIL`, uses the visitor as Reply-To, and requires provider acceptance with an ID before reporting acceptance. This still does not confirm inbox arrival. See `docs/CONTACT_SETUP.md` for official references, setup and free-plan/sender constraints.

Delivery remains **pending** until private recipient, API key, permitted sender, exact origin and an actual received inquiry are verified. Tests use synthetic values/local HTTP provider fixtures and clearly labelled browser simulations; no local test is represented as a real email receipt. Serverless rate limits are best effort per warm instance, not durable/shared protection. Provider quotas and host-level abuse controls still need deployment review without adding paid infrastructure.

## Phase 08 — editorial and SEO gates (2026-10-26)

No article has been written and approved for publication in the real content collection. Insights remains noindex and outside primary/footer navigation. The complete template is evaluated with conspicuously synthetic fixture prose/byline outside the app/content collection; its slug returns 404. Intent briefs are internal planning, not posts or keyword-volume research.

Minimal Organization/WebSite facts are limited to confirmed name, unchanged supplied mark and a configured origin. Person, Service, Article and project CreativeWork helpers are wired/tested but remain withheld for current unapproved full-profile/service/article/project records. No private Gmail, invented office/phone, dates, awards, reviews, company statistics or client outcomes enter schema. Visible breadcrumbs and approved-only cross-links reflect real context.

Both 12-route audits passed: the normal noindex preview and a clearly labelled local `example.test` configured fixture. The fixture is not an approved domain or deployed site. The normal build was restored afterward. Real domain/crawl/index/social-scraper/Search Console/field-performance verification remains pending, along with existing portrait, project, service and email-delivery approvals.

## Phase 09 verification boundary

Performance/accessibility work does not approve outstanding content. No new portrait, project claim, client result, service approval, company statistic or personal contact detail was inferred during testing. Actual inbox delivery, deployed SEO, physical-phone performance and screen-reader speech acceptance remain separate gates. Browser accessibility-tree inspection is not a substitute for a real assistive-technology session. The Windows Computer Use URL-confidence guard stopped the attempted Narrator check before launch; it was not bypassed.
