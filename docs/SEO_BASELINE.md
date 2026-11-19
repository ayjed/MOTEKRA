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

Production `https://www.motekra.com/sitemap.xml` must strictly contain the following **11 approved canonical URLs**, and no others:

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

### Fail-Closed Preview Safeguards (`SITE_INDEXABLE="false"` or unconfigured `SITE_URL`)
When deploying to staging, feature branches, or local development:
- `isIndexable()` evaluates to `false`.
- `sitemap()` returns an empty array `[]`.
- `robots()` emits `Disallow: /` for all user agents.
- All page metadata emits `robots: { index: false, follow: false }`.
- All Schema.org JSON-LD structured data generators return `null`.

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
2. **Touch Targets:** All interactive links and controls have a minimum touch target height of `44px` (WCAG 2.5.5 / 2.5.8).
3. **Color Contrast:**
   - Dark surfaces (`#08152b`): Text and links must meet WCAG AAA (>= 7:1) or WCAG AA (>= 4.5:1).
   - Light surfaces (`#ffffff`, `#edf7ff`): Text and links must meet WCAG AA (>= 4.5:1).
4. **Reduced Motion:** All GSAP and CSS animations must be wrapped in `prefers-reduced-motion` checks, falling back to static visibility with transitions disabled.
5. **No-JS Compatibility:** Core text, headings, breadcrumbs, navigation, and structured data must render completely in initial static HTML when JavaScript is disabled.
6. **Core Web Vitals:** Images must use Next.js `<Image>` with explicit dimensions, responsive `sizes`, and WebP/AVIF compression. Cumulative Layout Shift (CLS) must remain 0.

---

## 8. Change Management & Governance

### Category A: Safe Changes (No SEO Review Required)
- Adjusting CSS styling, spacing, typography weights, or button colors, provided WCAG AA/AAA contrast and 44px touch targets are preserved.
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

### Updating the Baseline
When a business decision to add a new service, publish a case study, or update corporate branding is approved, this baseline document must be updated in the same pull request alongside the implementation and test adjustments.
