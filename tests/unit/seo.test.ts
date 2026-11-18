import { afterEach, describe, expect, it, vi } from "vitest";
import { formatBaseTitle, formatFullTitle, getSiteOrigin, isIndexable, pageMetadata } from "@/lib/seo/site";
import { founderMetadata } from "@/lib/data/founder";
import { team } from "@/content/team";
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
    expect(urls).toHaveLength(5);
    expect(urls).toContain("https://example.test/team/akinwumi-ayomiposi");
    expect(urls.some((url) => url.includes("/services"))).toBe(false);
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
    expect(founderMeta.title).toBe("Akinwumi Ayomiposi - Software Developer & Creative Technologist");
    expect(formatFullTitle(founderMeta.title as string)).toBe("Akinwumi Ayomiposi - Software Developer & Creative Technologist - MOTEKRA");
    expect(founderMeta.openGraph?.title).toBe("Akinwumi Ayomiposi - Software Developer & Creative Technologist - MOTEKRA");
    expect(founderMeta.twitter?.title).toBe("Akinwumi Ayomiposi - Software Developer & Creative Technologist - MOTEKRA");
  });

  it("contains no vertical bars or em dashes in formatted titles", () => {
    const titles = [
      formatFullTitle("Digital Products for What’s Next"),
      formatFullTitle("About the Studio"),
      formatFullTitle("Our Work & Design Concepts"),
      formatFullTitle("Contact Us"),
      formatFullTitle("Akinwumi Ayomiposi - Software Developer & Creative Technologist"),
    ];

    for (const title of titles) {
      expect(title).not.toContain("|");
      expect(title).not.toContain("—");
      expect(title).toMatch(/\s-\sMOTEKRA$/);
    }
  });
});
