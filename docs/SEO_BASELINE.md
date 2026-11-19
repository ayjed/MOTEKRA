# MOTEKRA — Search Engine Optimization (SEO) & Indexing Baseline

**Document Version:** 1.0.0  
**Effective Date:** November 19, 2026  
**Status:** Canonical SEO Baseline & Architectural Rule  
**Applicability:** All frontend, content, schema, visual redesign, and deployment workflows.

---

## 1. Purpose & Authority

This document establishes the permanent technical SEO baseline for MOTEKRA (`https://www.motekra.com`). All future visual redesigns, component refactors, and feature additions must strictly preserve this baseline unless an authorized, reviewed change explicitly updates this document.

Any visual redesign is permitted under the **MOTEKRA — SEO Preservation Rule**, provided that search discoverability, indexability, metadata integrity, and structured-data validity remain intact.

---

## 2. Approved Sitemap URL Inventory (11 Core URLs)

Production `https://www.motekra.com/sitemap.xml` strictly contains the following **11 approved canonical URLs**, representing the current approved commercial baseline:

| # | Route | Purpose & Canonical URL | Publication Status |
|---|---|---|---|
| 1 | `/` | `https://www.motekra.com/` | Approved (Production Core) |
| 2 | `/work` | `https://www.motekra.com/work` | Approved (Production Core) |
| 3 | `/about` | `https://www.motekra.com/about` | Approved (Production Core) |
| 4 | `/contact` | `https://www.motekra.com/contact` | Approved (Production Core) |
| 5 | `/services` | `https://www.motekra.com/services` | Approved (Production Core) |
| 6 | `/services/ui-ux-design` | `https://www.motekra.com/services/ui-ux-design` | Approved (Commercial Service) |
| 7 | `/services/web-development` | `https://www.motekra.com/services/web-development` | Approved (Commercial Service) |
| 8 | `/services/mobile-app-development` | `https://www.motekra.com/services/mobile-app-development` | Approved (Commercial Service) |
| 9 | `/services/product-strategy` | `https://www.motekra.com/services/product-strategy` | Approved (Commercial Service) |
| 10 | `/services/brand-visual-design` | `https://www.motekra.com/services/brand-visual-design` | Approved (Commercial Service) |
| 11 | `/team/akinwumi-ayomiposi` | `https://www.motekra.com/team/akinwumi-ayomiposi` | Approved (Founder Profile) |

These 11 URLs represent the currently approved production inventory. While unapproved candidate projects and draft articles remain strictly excluded, authorized future content publications (e.g., reviewed case studies or approved editorial articles) may be incorporated into the sitemap following the formal Change Management & Governance process (Section 8).

### Publication Restrictions & Negative Assertions
- **Candidate Projects (`/work/[slug]`):** Portfolio concept items (`spotlight-contest`, `lad-global-travels`, `tog-africa`, `connectapi`) remain unapproved concept previews with `robots: { index: false, follow: false }`. They MUST NOT be emitted in `/sitemap.xml` or promoted into commercial `CreativeWork` schemas until explicitly authorized.
- **Insights & Editorial Articles (`/insights`, `/insights/[slug]`):** Editorial articles remain unpublished (`articles: []`). `/insights` emits a non-indexable draft state (`noindex`) and must not appear in `/sitemap.xml`.
- **Internal / Staging Endpoints:** `/motion-lab`, `/api/*`, and `/work/evidence/*` are excluded via `robots.txt` and sitemap filters.

---

## 3. SEO Titles & Canonical Conventions

### Standard Delimiter & Suffix Rule
All titles must adhere to the **Issue 03 Title Standardization Standard**:
- **Format:** `[Page Title] - MOTEKRA` (Root page: `Digital Products for What’s Next - MOTEKRA`).
- **Delimiter:** Single ASCII hyphen surrounded by single spaces (` - `).
- **Prohibited Characters:** Vertical bars (`|`) and em dashes (`—`) are strictly prohibited in HTML `<title>`, `og:title`, and `twitter:title`.
- **Deduplication:** The `- MOTEKRA` suffix must never be duplicated.

### Canonical Title Master Table

| Route | Base Title | Full `<title>` / `og:title` / `twitter:title` |
|---|---|---|
| `/` | `Digital Products for What’s Next` | `Digital Products for What’s Next - MOTEKRA` |
| `/work` | `Our Work & Design Concepts` | `Our Work & Design Concepts - MOTEKRA` |
| `/about` | `About the Studio` | `About the Studio - MOTEKRA` |
| `/contact` | `Contact Us` | `Contact Us - MOTEKRA` |
| `/services` | `Services - Digital Product Design & Engineering` | `Services - Digital Product Design & Engineering - MOTEKRA` |
| `/services/ui-ux-design` | `UI/UX Design - Digital Product Services` | `UI/UX Design - Digital Product Services - MOTEKRA` |
| `/services/web-development` | `Web Development - Digital Product Services` | `Web Development - Digital Product Services - MOTEKRA` |
| `/services/mobile-app-development` | `Mobile App Development - Digital Product Services` | `Mobile App Development - Digital Product Services - MOTEKRA` |
| `/services/product-strategy` | `Product Strategy - Digital Product Services` | `Product Strategy - Digital Product Services - MOTEKRA` |
| `/services/brand-visual-design` | `Brand & Visual Design - Digital Product Services` | `Brand & Visual Design - Digital Product Services - MOTEKRA` |
| `/team/akinwumi-ayomiposi` | `Ayomiposi Akinwumi - Software Developer & Creative Technologist` | `Ayomiposi Akinwumi - Software Developer & Creative Technologist - MOTEKRA` |

### Canonical URL Conventions
- All canonical tags must be absolute HTTPS URLs referencing `https://www.motekra.com`.
- No relative canonical links (`/services/web-development`) or trailing slash mismatches.
- Non-canonical environments (local development, preview URLs, pull request branch builds) must withhold canonical link headers/elements to avoid canonical contamination.

---

## 4. Indexing Directives & Staging Safeguards

### Production Directives (`SITE_INDEXABLE="true"`)
- **`robots.txt` (`/robots.txt`):**
  ```txt
  User-Agent: *
  Allow: /
  Disallow: /api/
  Disallow: /motion-lab
  Disallow: /work/evidence/
  Sitemap: https://www.motekra.com/sitemap.xml
  ```
- **Robots Meta Tag:**
  All 11 approved pages emit:
  ```html
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  ```

### Fail-Closed Preview Safeguards & Canonical Contamination Prevention
Indexing is enabled **only** when the environment configuration explicitly authorizes it (`SITE_INDEXABLE === "true"` and a valid, explicitly configured HTTPS site origin). In all other environments (previews, staging, feature branch builds, local development, or misconfigured production):
- `isIndexable()` evaluates to `false`.
- **No Preview Canonical Contamination:** When indexability is disabled, `pageMetadata()` does not emit canonical tags (`alternates: undefined`). Preview and staging URLs are never identified as canonical pages to search engines.
- `sitemap()` returns an empty array `[]`.
- `robots()` emits `Disallow: /` for all user agents.
- All page metadata emits `robots: { index: false, follow: false }`.
- All Schema.org JSON-LD structured data generators return `null`.
- Titles, descriptions, and Open Graph/Twitter visual assets remain intact for manual inspection.

---

## 5. Structured Data Architecture (Schema.org JSON-LD)

All structured data is generated server-side using type-safe schemas from `src/lib/seo/schema.ts` and sanitized against XSS and Unicode line terminators via `serializeJsonLd()`.

### Entity Mapping by Route
1. **Homepage (`/`):**
   - **`Organization`:** `@id: https://www.motekra.com/#organization`, `name: "MOTEKRA"`, `url: "https://www.motekra.com"`, `logo: "https://www.motekra.com/assets/brand/motekra-mark.png"`. (No private addresses or direct personal phone numbers).
   - **`WebSite`:** `@id: https://www.motekra.com/#website`, `name: "MOTEKRA"`, `publisher: { @id: "https://www.motekra.com/#organization" }`.
2. **About Studio (`/about`):**
   - **`Person`:** `@id: https://www.motekra.com/about#person`, `name: "Ayomiposi Akinwumi"`, `jobTitle: "Software Developer & Creative Technologist"`, `worksFor: { @id: "https://www.motekra.com/#organization" }`, `url: "https://www.motekra.com/team/akinwumi-ayomiposi"`.
3. **Founder Profile (`/team/akinwumi-ayomiposi`):**
   - **`ProfilePage`:** `@id: https://www.motekra.com/team/akinwumi-ayomiposi#profile`.
   - **`Person` (mainEntity):** Name `"Ayomiposi Akinwumi"`, verified profiles in `sameAs` (GitHub, LinkedIn).
   - **`BreadcrumbList`:** 3 items (`Home` → `About` → `Ayomiposi Akinwumi`).
4. **Service Detail Pages (`/services/[slug]`):**
   - **`Service`:** Independent entity with `@id: https://www.motekra.com/services/[slug]#service`, `provider: { @id: "https://www.motekra.com/#organization" }`.
   - **`BreadcrumbList`:** Matching visible hero breadcrumb path (`Home` → `Services` → `{service.title}`).
   - **Uniqueness Rule:** Each service subpage contains exactly **one** `Service` block and exactly **one** `BreadcrumbList` block. Duplication across server/client boundaries is forbidden.

---

## 6. Internal Linking & Contextual Discovery Architecture

### Discovery Ingress
1. **Global Header (`src/components/layout/header.tsx`):**
   - Brand logo linking to `/`.
   - Desktop and mobile navigation linking `/`, `/work`, `/services`, `/about`, `/contact`.
2. **Global Footer (`src/components/layout/footer.tsx`):**
   - Explore navigation linking `/work`, `/services`, `/about`, `/contact`.
   - Dedicated Services list directly linking all 5 individual services.
3. **About Contextual Bridge (`src/components/about/about-page.tsx`):**
   - Narrative link in `.editorial-perspective`: `"Explore our digital services →"` pointing to `/services`.
4. **Complementary Service Mesh (`src/lib/data/services.ts`):**
   Each service detail page provides contextual links to exactly two complementary approved offerings:
   - **UI/UX Design** → Web Development & Mobile App Development
   - **Web Development** → UI/UX Design & Product Strategy
   - **Mobile App Development** → UI/UX Design & Web Development
   - **Product Strategy** → UI/UX Design & Web Development
   - **Brand & Visual Design** → UI/UX Design & Product Strategy
5. **Safeguards:**
   - Self-linking is prohibited.
   - Only `publication: "approved"` services are displayed.
   - All links must be standard crawlable `<a href="...">` rendered in the initial server HTML (no client-only hydration requirement).

---

## 7. Accessibility, Semantic HTML & Performance Standards

1. **Semantic Hierarchy:** Exactly one `<h1>` per page. Sub-sections use structured `<h2>` and `<h3>` tags with logical reading order.
2. **Touch Targets & Target Size:**
   - **WCAG 2.2 Level AA Minimum (Success Criterion 2.5.8 - Target Size Minimum):** Interactive controls must meet the minimum size of 24 × 24 CSS pixels, or provide sufficient spacing, subject to the criterion's recognized exceptions (inline targets within text, user-agent controls, or essential presentations).
   - **WCAG Enhanced Level AAA Target (Success Criterion 2.5.5 - Target Size):** Enhanced design target of 44 × 44 CSS pixels for interactive controls, subject to its standard exceptions. A 44px height alone does not guarantee AAA compliance; full width and height dimensions or target spacing must be considered.
   - **MOTEKRA Preferred Design Standard:** MOTEKRA aims for 44 × 44 CSS-pixel interactive touch targets across primary navigation links, footer channels, and call-to-action buttons where practical to provide superior usability on mobile touchscreens.
3. **Color Contrast:**
   - All text and interactive controls must meet mandatory WCAG 2.1 / 2.2 Level AA contrast requirements (≥ 4.5:1 for normal text, ≥ 3.0:1 for large text and UI components).
   - Enhanced Level AAA targets (≥ 7.0:1 for normal text) are pursued across high-emphasis design elements where practical, but Level AA represents the required pass/fail compliance baseline.
4. **Reduced Motion:** All GSAP and CSS animations must be wrapped in `prefers-reduced-motion` checks, falling back to static visibility with transitions disabled.
5. **No-JS Compatibility:** Core text, headings, breadcrumbs, navigation, and structured data must render completely in initial static HTML when JavaScript is disabled.
6. **Core Web Vitals & Performance Targets:**
   - Images must use Next.js `<Image>` with explicit dimensions, responsive `sizes`, and WebP/AVIF compression.
   - Layout stability must adhere to Google's good target of Cumulative Layout Shift (CLS) ≤ 0.1 at the 75th percentile, alongside an architectural preference for minimizing layout shifts through fixed-ratio media wrappers and preallocated space for asynchronous UI elements.
   - Performance targets represent architectural benchmarks; field and lab metrics must only be cited when verified by empirical measurement tools.

---

## 8. Change Management & Governance

### Category A: Safe Changes (No SEO Review Required)
- Adjusting non-semantic copy within approved pages where titles, headings, and canonical paths are unaffected.
- Updating decorative micro-interactions or illustration SVG visuals.
- Adding non-structural responsive breakpoint tweaks.

### Category B: Changes Requiring Prior Technical SEO Review
- Modifying any URL path or introducing new routes.
- Changing `<title>`, `meta description`, Open Graph, or Twitter card copy.
- Renaming or altering `<h1>` or `<h2>` heading text.
- Altering canonical tags, `robots.txt`, or sitemap generator logic.
- Adding, modifying, or removing Schema.org JSON-LD scripts.
- Changing the 5-service complementary relationship mesh.
- Promoting candidate portfolio projects or blog articles from `draft` to `approved`.

### Note on CSS & Styling Changes
Even styling-only or visual modifications (such as color palette adjustments, spacing, typography scales, or layout refactors) can directly affect color contrast compliance, touch target clearance, mobile viewport boundaries, or paint performance. Therefore, CSS modifications require running the automated accessibility, responsive, and unit regression test suites prior to merge approval.

### Updating the Baseline
When a business decision to add a new service, publish a case study, or update corporate branding is approved, this baseline document must be updated in the same pull request alongside the implementation and test adjustments.

---

## 9. Google Search Console Indexing Monitoring Note

- **Observation Date:** November 19, 2026.
- **Search Console Status:** Google Search Console recorded four core URLs (`/`, `/work`, `/about`, `/contact`) under the "Crawled – currently not indexed" status, with recorded crawl timestamps of November 17, 2026.
- **Context & Progression:** This state reflects the site prior to the Issue 05 services commercial expansion. The updated 11-URL sitemap has been submitted and requires subsequent Googlebot re-crawling, canonical reconciliation, and processing.
- **Diagnostic Clarification:** The "Crawled – currently not indexed" classification alone does not establish a technical SEO error or delivery fault. Google evaluates newly discovered URLs asynchronously, and final indexing and serving decisions remain entirely under search engine algorithmic discretion.
- **Ongoing Monitoring Protocol:**
  - Inspect individual service URLs (e.g., `/services/web-development`) periodically using GSC's URL Inspection tool.
  - Avoid repeatedly requesting indexing across multiple URLs to prevent search console quota exhaustion.
  - Track progression across the standard pipeline (*Submitted → Discovered → Crawled → Indexed → Serving*).

---

## 10. Cloudflare Reliability & HTTP 503 Diagnostic Observations

- **Observation:** Intermittent HTTP 503 responses were observed during rapid synthetic crawling. Normal paced requests succeeded, but the precise cause has not been established.
- **Supporting Observations & Environment State:**
  - Standard, paced HTTPS requests to all 11 approved endpoints consistently return HTTP 200 OK with normal response times (~170–200ms).
  - The OpenNext Cloudflare Worker bundle operates without runtime startup failure or memory exhaustion under paced requests.
  - Authoritative edge log streams and granular security event records for the specific burst moments were not retained in available telemetry. Without direct log evidence, specific edge proxy mechanisms (such as rate-limiting tiers, WAF triggers, or connection pooling) cannot be conclusively identified and remain unverified hypotheses.
- **Reliability & Safeguard Recommendations:**
  - Retain existing Cloudflare edge security settings and WAF policies without weakening protections.
  - Ensure synthetic verification tools and automated monitors use request pacing (delays between requests) and standard descriptive user agents to prevent synthetic test bursts from triggering transient edge errors.
  - Configure external uptime monitoring at paced intervals (e.g., 60 seconds) to record authoritative availability data over time.
