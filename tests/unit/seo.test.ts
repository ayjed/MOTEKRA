import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteOrigin, isIndexable, pageMetadata } from "@/lib/seo/site";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

afterEach(() => vi.unstubAllEnvs());

describe("canonical and preview safety", () => {
  it.each(["", "not-a-url", "http://example.test", "https://example.test/path", "https://user:pass@example.test", "https://example.test/?key=x"])("rejects invalid origin %s", (value) => {
    expect(getSiteOrigin(value)).toBeNull();
  });
  it("normalizes an approved HTTPS origin", () => expect(getSiteOrigin("https://example.test/")).toBe("https://example.test"));
  it("keeps the brand in the root page title", () => {
    expect(pageMetadata("Digital products", "Description", "/").title).toEqual({ absolute: "Digital products | MOTEKRA" });
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
    expect(urls).toHaveLength(4);
    expect(urls.some((url) => url.includes("/services"))).toBe(false);
    expect(urls.some((url) => url.includes("insights") || url.includes("team/"))).toBe(false);
    expect(pageMetadata("Test", "Description", "/work").alternates?.canonical).toBe("https://example.test/work");
  });
});
