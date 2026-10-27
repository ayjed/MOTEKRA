# Phase 08 — Insights, structured content and SEO

2026-10-26 · Local implementation and review. No deployment, domain selection, account registration, CMS/database, paid dependency or new server feature. Phase 09 has not started.

## Implemented

- Insights listing and a full article template: responsive editorial type, semantic contents anchors, real-byline/date fields, section paragraphs/lists/code, source links, author profile and approved related service/case links.
- The real article collection remains empty. Publishing requires actual body text, verified author, valid non-future dates and a named approved review. No placeholder article, invented founder byline or fake publication is added. Insights stays noindex and outside navigation; the isolated article screenshot fixture is conspicuously synthetic, stored only in evidence, and its app slug returns 404.
- Next Metadata API page titles/descriptions and root template, absolute canonicals, Open Graph, Twitter cards and 12 static 1200 × 630 brand cards. Missing real origin deliberately withholds invented absolute URLs. No social handle is guessed. The supplied raster mark remains unchanged.
- Shared safe JSON-LD serializer; conservative Organization/WebSite, visible BreadcrumbList and gated Person/Service/Article/project CreativeWork helpers. No private Gmail, phone/address, company statistics, awards, ratings, unsupported author or client results. Current unapproved full founder/service/article/project records emit no corresponding factual schema. Positive unit fixtures verify those paths without changing live records.
- Shared approval-aware sitemap registry. Preview robots blocks all; configured robots excludes only technical paths, allowing noindex on provisional content to be seen by crawlers. Future approved services/profiles/Insights are no longer blanket blocked. No invented last-modified date.
- Verified service/project/person relations preserve exact company versus personal contribution; company ownership does not imply sole authorship. Internal intent and editorial briefs document needed examples, evidence and review, without keyword stuffing or search-volume claims.

## Route and template audits

Two actual local builds were audited with JavaScript disabled: normal preview and a clearly labelled `https://example.test` configured fixture. Twelve routes in each mode: five main pages, Insights, founder and five service details. Every route has meaningful initial HTML, one H1, a distinct title/description, links and no required canvas. Fifteen distinct internal targets return 200 in each audit; six unknown/draft routes return 404. Configured canonical/social tags match the fixture origin; Organization/WebSite and matching breadcrumbs parse as JSON. No unapproved Person/Service/Article/CreativeWork appears. The configured sitemap has four currently approved base URLs; the preview sitemap is empty and robots blocks all.

The configured fixture was never deployed and is not an approved domain. Process-local flags were discarded; the final stored build and environment are restored to noindex, without a production origin. Local audits do not prove Google indexing, deployed redirects, rich results or real social-scraper delivery.

## Validation

Strict typecheck, lint, 54 unit tests and production build pass (`validation.txt`). Four SEO browser tests and two public-route regressions pass. Insights and isolated article fixture are checked at 1440/390/320, including native keyboard contents links, no-JavaScript copy/code/breadcrumbs and social assets. Four expanded desktop/mobile axe reports have zero violations. A heading-order issue found by Lighthouse was corrected from H3 to H2; Lighthouse accessibility is now 100.

Eight review screenshots and 12 social assets are indexed in `docs/evidence/phase-08/index.html`; desktop/mobile article/empty Insights and social artwork were visually reviewed. No new motion recording is required for the editorial/template changes; earlier cinematic pages and lazy scenes retain their existing architecture.

Final sequential mobile Lighthouse: performance 86, accessibility 100, best practices 100, SEO 66 (deliberate noindex), LCP 3.6 s, TBT 220 ms, CLS 0; no run warnings. LCP/performance acceptance remains open. Lighthouse metrics and caveats are saved in `performance-summary.json` and the full reports. A concurrent run is retained separately because it reported slow-host CPU contention. These local measurements do not close performance acceptance or field Core Web Vitals. SEO score retains the deliberate noindex deduction.

## Open gates

Approved production domain/indexability and deployment; genuine reviewed articles if opening Insights; final service/profile/project publication; actual Search Console/domain access and sitemap submission; deployed social previews/structured-data validators/crawl behavior; real contact inbox delivery; performance and full manual accessibility acceptance. No analytics or account access is fabricated. This phase implements and locally validates the SEO foundation without claiming launch readiness or publishing missing facts.
