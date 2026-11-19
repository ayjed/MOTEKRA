import { afterEach, describe, expect, it, vi } from "vitest";
import { formatBaseTitle, formatFullTitle, getSiteOrigin, isIndexable, pageMetadata } from "@/lib/seo/site";
import { founderMetadata, founderStructuredData } from "@/lib/data/founder";
import { serviceMetadata } from "@/lib/data/services";
import { aboutPersonSchema } from "@/lib/seo/schema";
import { team } from "@/content/team";
import { services } from "@/content/services";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

afterEach(() => vi.unstubAllEnvs());

describe("canonical and preview safety", () => {
  it.each(["", "not-a-url", "http://example.test", "https://example.test/path", "https://user:pass@example.test", "https://example.test/?key=x"])("rejects invalid origin %s", (value) => {
    expect(getSiteOrigin(value)).toBeNull();
  });
  it("normalizes an approved HTTPS origin", () => expect(getSiteOrigin("https://example.test/")).toBe("https://example.test"));
  it("keeps the brand in the root page title", () => {
    expect(pageMetadata("Digital products", "Description", "/").title).toEqual({ absolute: "Digital products - MOTEKRA" });
  });
  it("keeps an unconfigured preview out of discovery", () => {
    vi.stubEnv("SITE_URL", ""); vi.stubEnv("SITE_INDEXABLE", "false");
    expect(isIndexable()).toBe(false);
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(pageMetadata("Test", "Description", "/").alternates).toBeUndefined();
  });
  it("emits approved primary URLs only when explicitly enabled", () => {
    vi.stubEnv("SITE_URL", "https://example.test"); vi.stubEnv("SITE_INDEXABLE", "true");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(11);
    expect(urls).toContain("https://example.test/team/akinwumi-ayomiposi");
    expect(urls).toContain("https://example.test/services");
    expect(urls).toContain("https://example.test/services/ui-ux-design");
    expect(urls).toContain("https://example.test/services/web-development");
    expect(urls).toContain("https://example.test/services/mobile-app-development");
    expect(urls).toContain("https://example.test/services/product-strategy");
    expect(urls).toContain("https://example.test/services/brand-visual-design");
    expect(urls.some((url) => url.includes("insights"))).toBe(false);
    expect(pageMetadata("Test", "Description", "/work").alternates?.canonical).toBe("https://example.test/work");
  });
});

describe("SEO Title Standardization (Issue 03)", () => {
  it("formats base and full titles with standard hyphen and single spaces", () => {
    expect(formatBaseTitle("About the Studio")).toBe("About the Studio");
    expect(formatFullTitle("About the Studio")).toBe("About the Studio - MOTEKRA");
  });

  it("prevents duplicate MOTEKRA suffixes for any delimiter style", () => {
    expect(formatBaseTitle("About the Studio - MOTEKRA")).toBe("About the Studio");
    expect(formatFullTitle("About the Studio - MOTEKRA")).toBe("About the Studio - MOTEKRA");
    expect(formatFullTitle("About the Studio | MOTEKRA")).toBe("About the Studio - MOTEKRA");
    expect(formatFullTitle("About the Studio — MOTEKRA")).toBe("About the Studio - MOTEKRA");
  });

  it("produces exact approved titles for all five published pages", () => {
    const homeMeta = pageMetadata("Digital Products for What’s Next", "Description", "/");
    expect(homeMeta.title).toEqual({ absolute: "Digital Products for What’s Next - MOTEKRA" });
    expect(homeMeta.openGraph?.title).toBe("Digital Products for What’s Next - MOTEKRA");
    expect(homeMeta.twitter?.title).toBe("Digital Products for What’s Next - MOTEKRA");

    const aboutMeta = pageMetadata("About the Studio", "Description", "/about");
    expect(aboutMeta.title).toBe("About the Studio");
    expect(formatFullTitle(aboutMeta.title as string)).toBe("About the Studio - MOTEKRA");
    expect(aboutMeta.openGraph?.title).toBe("About the Studio - MOTEKRA");
    expect(aboutMeta.twitter?.title).toBe("About the Studio - MOTEKRA");

    const workMeta = pageMetadata("Our Work & Design Concepts", "Description", "/work");
    expect(workMeta.title).toBe("Our Work & Design Concepts");
    expect(formatFullTitle(workMeta.title as string)).toBe("Our Work & Design Concepts - MOTEKRA");
    expect(workMeta.openGraph?.title).toBe("Our Work & Design Concepts - MOTEKRA");
    expect(workMeta.twitter?.title).toBe("Our Work & Design Concepts - MOTEKRA");

    const contactMeta = pageMetadata("Contact Us", "Description", "/contact");
    expect(contactMeta.title).toBe("Contact Us");
    expect(formatFullTitle(contactMeta.title as string)).toBe("Contact Us - MOTEKRA");
    expect(contactMeta.openGraph?.title).toBe("Contact Us - MOTEKRA");
    expect(contactMeta.twitter?.title).toBe("Contact Us - MOTEKRA");

    const founder = team.find((p) => p.slug === "akinwumi-ayomiposi")!;
    const founderMeta = founderMetadata(founder);
    expect(founderMeta.title).toBe("Ayomiposi Akinwumi - Software Developer & Creative Technologist");
    expect(formatFullTitle(founderMeta.title as string)).toBe("Ayomiposi Akinwumi - Software Developer & Creative Technologist - MOTEKRA");
    expect(founderMeta.openGraph?.title).toBe("Ayomiposi Akinwumi - Software Developer & Creative Technologist - MOTEKRA");
    expect(founderMeta.twitter?.title).toBe("Ayomiposi Akinwumi - Software Developer & Creative Technologist - MOTEKRA");
  });

  it("contains no vertical bars or em dashes in formatted titles", () => {
    const titles = [
      formatFullTitle("Digital Products for What’s Next"),
      formatFullTitle("About the Studio"),
      formatFullTitle("Our Work & Design Concepts"),
      formatFullTitle("Contact Us"),
      formatFullTitle("Ayomiposi Akinwumi - Software Developer & Creative Technologist"),
    ];

    for (const title of titles) {
      expect(title).not.toContain("|");
      expect(title).not.toContain("—");
      expect(title).toMatch(/\s-\sMOTEKRA$/);
    }
  });
});

describe("SEO Baseline Protection & 11-URL Inventory (Issue 07)", () => {
  const EXPECTED_APPROVED_PATHS = [
    "/",
    "/work",
    "/about",
    "/contact",
    "/services",
    "/services/ui-ux-design",
    "/services/web-development",
    "/services/mobile-app-development",
    "/services/product-strategy",
    "/services/brand-visual-design",
    "/team/akinwumi-ayomiposi",
  ];

  it("strictly emits exactly the 11 approved baseline URLs in sitemap", () => {
    vi.stubEnv("SITE_URL", "https://www.motekra.com");
    vi.stubEnv("SITE_INDEXABLE", "true");

    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toHaveLength(11);

    const expectedUrls = EXPECTED_APPROVED_PATHS.map((p) =>
      p === "/" ? "https://www.motekra.com/" : `https://www.motekra.com${p}`
    );
    for (const expectedUrl of expectedUrls) {
      expect(urls).toContain(expectedUrl);
    }

    // Explicitly verify draft projects and draft articles are excluded
    expect(urls.some((u) => u.includes("spotlight-contest"))).toBe(false);
    expect(urls.some((u) => u.includes("lad-global-travels"))).toBe(false);
    expect(urls.some((u) => u.includes("tog-africa"))).toBe(false);
    expect(urls.some((u) => u.includes("connectapi"))).toBe(false);
    expect(urls.some((u) => u.includes("insights"))).toBe(false);
  });

  it("ensures all 5 commercial services are approved and active", () => {
    expect(services).toHaveLength(5);
    for (const service of services) {
      expect(service.publication).toBe("approved");
    }
  });

  it("verifies exact approved SEO titles across all 11 baseline pages", () => {
    // 1. Home
    const homeMeta = pageMetadata("Digital Products for What’s Next", "Description", "/");
    expect(homeMeta.title).toEqual({ absolute: "Digital Products for What’s Next - MOTEKRA" });

    // 2. About
    const aboutMeta = pageMetadata("About the Studio", "Description", "/about");
    expect(formatFullTitle(aboutMeta.title as string)).toBe("About the Studio - MOTEKRA");

    // 3. Work
    const workMeta = pageMetadata("Our Work & Design Concepts", "Description", "/work");
    expect(formatFullTitle(workMeta.title as string)).toBe("Our Work & Design Concepts - MOTEKRA");

    // 4. Contact
    const contactMeta = pageMetadata("Contact Us", "Description", "/contact");
    expect(formatFullTitle(contactMeta.title as string)).toBe("Contact Us - MOTEKRA");

    // 5. Services Overview
    const servicesMeta = pageMetadata(
      "Services - Digital Product Design & Engineering",
      "Description",
      "/services"
    );
    expect(formatFullTitle(servicesMeta.title as string)).toBe(
      "Services - Digital Product Design & Engineering - MOTEKRA"
    );

    // 6-10. Five Individual Services
    const expectedServiceTitles: Record<string, string> = {
      "ui-ux-design": "UI/UX Design - Digital Product Services - MOTEKRA",
      "web-development": "Web Development - Digital Product Services - MOTEKRA",
      "mobile-app-development": "Mobile App Development - Digital Product Services - MOTEKRA",
      "product-strategy": "Product Strategy - Digital Product Services - MOTEKRA",
      "brand-visual-design": "Brand & Visual Design - Digital Product Services - MOTEKRA",
    };

    for (const [slug, expectedTitle] of Object.entries(expectedServiceTitles)) {
      const service = services.find((s) => s.slug === slug)!;
      expect(service).toBeDefined();
      const meta = serviceMetadata(service);
      expect(formatFullTitle(meta.title as string)).toBe(expectedTitle);
      expect(meta.openGraph?.title).toBe(expectedTitle);
      expect(meta.twitter?.title).toBe(expectedTitle);
    }

    // 11. Founder Profile
    const founder = team.find((p) => p.slug === "akinwumi-ayomiposi")!;
    expect(founder).toBeDefined();
    const founderMeta = founderMetadata(founder);
    expect(formatFullTitle(founderMeta.title as string)).toBe(
      "Ayomiposi Akinwumi - Software Developer & Creative Technologist - MOTEKRA"
    );
  });

  it("verifies absolute self-referential canonical tags for all 11 pages when indexable", () => {
    vi.stubEnv("SITE_URL", "https://www.motekra.com");
    vi.stubEnv("SITE_INDEXABLE", "true");

    for (const path of EXPECTED_APPROVED_PATHS) {
      const meta = pageMetadata("Title", "Description", path);
      const expectedCanonical = path === "/" ? "https://www.motekra.com/" : `https://www.motekra.com${path}`;
      expect(meta.alternates?.canonical).toBe(expectedCanonical);
    }
  });

  it("strictly enforces fail-closed preview safety when SITE_INDEXABLE is false or origin unset", () => {
    // When origin is unconfigured (preview default)
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "false");

    expect(isIndexable()).toBe(false);
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });

    for (const path of EXPECTED_APPROVED_PATHS) {
      const meta = pageMetadata("Title", "Description", path);
      expect(meta.alternates).toBeUndefined();
      expect(meta.robots).toEqual({ index: false, follow: false });
    }

    // When SITE_INDEXABLE is false even with a URL
    vi.stubEnv("SITE_URL", "https://preview.motekra.com");
    vi.stubEnv("SITE_INDEXABLE", "false");
    expect(isIndexable()).toBe(false);
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    const previewMeta = pageMetadata("Title", "Description", "/");
    expect(previewMeta.robots).toEqual({ index: false, follow: false });
  });

  it("preserves founder identity and structured data integrity", () => {
    const founder = team.find((p) => p.slug === "akinwumi-ayomiposi")!;
    expect(founder.name).toBe("Ayomiposi Akinwumi");

    // Verify founder structured data (ProfilePage with Person mainEntity)
    vi.stubEnv("SITE_URL", "https://www.motekra.com");
    vi.stubEnv("SITE_INDEXABLE", "true");
    const sd = founderStructuredData(founder) as Record<string, unknown>;
    expect(sd["@type"]).toBe("ProfilePage");
    const mainEntity = sd.mainEntity as Record<string, unknown>;
    expect(mainEntity["@type"]).toBe("Person");
    expect(mainEntity.name).toBe("Ayomiposi Akinwumi");

    // Verify about page Person schema
    const aboutPerson = aboutPersonSchema() as Record<string, unknown>;
    expect(aboutPerson).not.toBeNull();
    expect(aboutPerson.name).toBe("Ayomiposi Akinwumi");
    expect(aboutPerson["@type"]).toBe("Person");
    expect(aboutPerson.url).toBe("https://www.motekra.com/team/akinwumi-ayomiposi");
  });
});
