import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  breadcrumbSchema,
  serializeJsonLd,
  organizationSchema,
  websiteSchema,
  type Crumb,
} from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("breadcrumbSchema() - Breadcrumb Schema Validation", () => {
  const configuredOrigin = "https://www.motekra.com";

  function enableProductionIndexing() {
    vi.stubEnv("SITE_URL", configuredOrigin);
    vi.stubEnv("SITE_INDEXABLE", "true");
  }

  it("includes the correct Schema.org context and BreadcrumbList type", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [{ name: "Home", path: "/" }];
    const schema = breadcrumbSchema(crumbs);

    expect(schema).not.toBeNull();
    expect(schema?.["@context"]).toBe("https://schema.org");
    expect(schema?.["@type"]).toBe("BreadcrumbList");
  });

  it("formats each itemListElement with correct ListItem structure", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ];
    const schema = breadcrumbSchema(crumbs);

    expect(schema?.itemListElement).toHaveLength(2);
    for (const item of schema!.itemListElement) {
      expect(item["@type"]).toBe("ListItem");
      expect(typeof item.position).toBe("number");
      expect(typeof item.name).toBe("string");
      expect(typeof item.item).toBe("string");
    }
  });

  it("enforces position numbering starting at 1 with sequential increments", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
      { name: "Spotlight Contest", path: "/work/spotlight-contest" },
    ];
    const schema = breadcrumbSchema(crumbs);

    expect(schema?.itemListElement[0]?.position).toBe(1);
    expect(schema?.itemListElement[1]?.position).toBe(2);
    expect(schema?.itemListElement[2]?.position).toBe(3);
  });

  it("preserves breadcrumb names exactly, including spaces and symbols", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [
      { name: "Home", path: "/" },
      { name: "UI / UX & Product Design", path: "/services/ui-ux-design" },
      { name: "Client — ConnectAPI™", path: "/work/connectapi" },
    ];
    const schema = breadcrumbSchema(crumbs);

    expect(schema?.itemListElement[0]?.name).toBe("Home");
    expect(schema?.itemListElement[1]?.name).toBe("UI / UX & Product Design");
    expect(schema?.itemListElement[2]?.name).toBe("Client — ConnectAPI™");
  });

  it("constructs correct absolute URLs using the configured site origin", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ];
    const schema = breadcrumbSchema(crumbs);

    expect(schema?.itemListElement[0]?.item).toBe(`${configuredOrigin}/`);
    expect(schema?.itemListElement[1]?.item).toBe(`${configuredOrigin}/about`);
  });

  it("handles a single breadcrumb item accurately", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [{ name: "Home", path: "/" }];
    const schema = breadcrumbSchema(crumbs);

    expect(schema?.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.motekra.com/",
      },
    ]);
  });

  it("handles multiple ordered breadcrumbs in strict hierarchical sequence", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
      { name: "Design Engineering", path: "/insights/design-engineering" },
    ];
    const schema = breadcrumbSchema(crumbs);

    expect(schema?.itemListElement).toHaveLength(3);
    expect(schema?.itemListElement.map((e) => e.position)).toEqual([1, 2, 3]);
    expect(schema?.itemListElement.map((e) => e.name)).toEqual([
      "Home",
      "Insights",
      "Design Engineering",
    ]);
    expect(schema?.itemListElement.map((e) => e.item)).toEqual([
      "https://www.motekra.com/",
      "https://www.motekra.com/insights",
      "https://www.motekra.com/insights/design-engineering",
    ]);
  });

  it("documents actual behavior for empty breadcrumb arrays", () => {
    enableProductionIndexing();
    // When an empty array is supplied in indexable mode, the function returns a BreadcrumbList
    // with an empty itemListElement array.
    const schema = breadcrumbSchema([]);

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    });
  });

  it("returns null when site origin is unavailable or empty", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "true");
    const crumbs: Crumb[] = [{ name: "Home", path: "/" }];

    expect(breadcrumbSchema(crumbs)).toBeNull();
  });

  it("returns null when site origin is invalid (non-HTTPS, credentials, or path segments)", () => {
    const invalidOrigins = [
      "http://www.motekra.com",
      "https://user:pass@www.motekra.com",
      "https://www.motekra.com/subpath",
      "https://localhost",
      "not-a-valid-url",
    ];

    for (const origin of invalidOrigins) {
      vi.stubEnv("SITE_URL", origin);
      vi.stubEnv("SITE_INDEXABLE", "true");
      expect(breadcrumbSchema([{ name: "Home", path: "/" }])).toBeNull();
    }
  });

  it("returns null when indexing is explicitly disabled (SITE_INDEXABLE = false)", () => {
    vi.stubEnv("SITE_URL", configuredOrigin);
    vi.stubEnv("SITE_INDEXABLE", "false");
    const crumbs: Crumb[] = [{ name: "Home", path: "/" }];

    expect(breadcrumbSchema(crumbs)).toBeNull();
  });

  it("returns valid schema when indexing is explicitly enabled (SITE_INDEXABLE = true)", () => {
    enableProductionIndexing();
    const crumbs: Crumb[] = [{ name: "Home", path: "/" }];
    const schema = breadcrumbSchema(crumbs);

    expect(schema).not.toBeNull();
    expect(schema?.["@type"]).toBe("BreadcrumbList");
  });
});

describe("serializeJsonLd() - JSON-LD Serialization Safety", () => {
  it("serializes standard flat objects to valid JSON", () => {
    const input = { name: "Motekra", active: true, count: 5 };
    const serialized = serializeJsonLd(input);

    expect(typeof serialized).toBe("string");
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("serializes nested objects and arrays with full structural fidelity", () => {
    const input = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MOTEKRA",
      founder: {
        "@type": "Person",
        name: "Ayomiposi",
        roles: ["Founder", "Design Engineer"],
      },
      stats: {
        projects: [1, 2, 3],
      },
    };
    const serialized = serializeJsonLd(input);

    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("preserves valid primitive data types and null values", () => {
    const input = {
      stringVal: "Motekra Studio",
      integerVal: 42,
      floatVal: 3.14159,
      boolTrue: true,
      boolFalse: false,
      nullVal: null,
    };
    const serialized = serializeJsonLd(input);

    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("escapes HTML less-than characters to \\u003c", () => {
    const input = { title: "<script>alert(1)</script>" };
    const serialized = serializeJsonLd(input);

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c");
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("safely handles strings containing closing script tags without breaking script blocks", () => {
    const input = {
      description: "Sample content with </script><script>alert('xss')</script> inside.",
    };
    const serialized = serializeJsonLd(input);

    // Verifies that no raw closing script tag exists in the serialized output
    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<script>");
    expect(serialized).toContain("\\u003c/script>");
    expect(serialized).toContain("\\u003cscript>");
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("escapes Unicode line separator character U+2028", () => {
    const input = { text: "Line 1\u2028Line 2" };
    const serialized = serializeJsonLd(input);

    expect(serialized).not.toContain("\u2028");
    expect(serialized).toContain("\\u2028");
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("escapes Unicode paragraph separator character U+2029", () => {
    const input = { text: "Paragraph 1\u2029Paragraph 2" };
    const serialized = serializeJsonLd(input);

    expect(serialized).not.toContain("\u2029");
    expect(serialized).toContain("\\u2029");
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("properly handles double quotation marks, backslashes, and control characters", () => {
    const input = {
      quoted: 'He said, "Welcome to MOTEKRA!"',
      windowsPath: "C:\\Users\\DELL\\Projects",
      multiline: "Line 1\nLine 2\r\nLine 3\tIndented",
    };
    const serialized = serializeJsonLd(input);

    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("produces valid JSON output that parses back to exact input", () => {
    const input = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home <Main>",
          item: "https://www.motekra.com/\u2028intro",
        },
      ],
    };
    const serialized = serializeJsonLd(input);

    expect(() => JSON.parse(serialized)).not.toThrow();
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("preserves the original input object without mutation", () => {
    const input = Object.freeze({
      name: "Immutable Entity",
      tags: Object.freeze(["<tag1>", "<tag2>"]),
      meta: Object.freeze({ secure: true }),
    });

    expect(() => serializeJsonLd(input)).not.toThrow();
    expect(input.name).toBe("Immutable Entity");
    expect(input.tags[0]).toBe("<tag1>");
  });

  it("handles empty objects and empty arrays cleanly", () => {
    expect(serializeJsonLd({})).toBe("{}");
    expect(serializeJsonLd([])).toBe("[]");
    expect(JSON.parse(serializeJsonLd({}))).toEqual({});
    expect(JSON.parse(serializeJsonLd([]))).toEqual([]);
  });
});

describe("JsonLd Component - React Rendering Safety", () => {
  it("renders null when data is null or undefined", () => {
    expect(renderToStaticMarkup(createElement(JsonLd, { data: null }))).toBe("");
    expect(renderToStaticMarkup(createElement(JsonLd, { data: undefined }))).toBe("");
  });

  it("renders a script element with type application/ld+json and escaped content", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MOTEKRA",
    };
    const markup = renderToStaticMarkup(createElement(JsonLd, { data }));

    expect(markup).toContain('<script type="application/ld+json">');
    expect(markup).toContain('"name":"MOTEKRA"');
    expect(markup).toContain("</script>");
  });

  it("prevents premature script termination when data contains HTML tags", () => {
    const maliciousPayload = {
      title: "Exploit attempt </script><script>alert('xss')</script>",
    };
    const markup = renderToStaticMarkup(createElement(JsonLd, { data: maliciousPayload }));

    // Count script tags: must have exactly 1 opening and 1 closing tag
    const openingTags = markup.match(/<script/g) || [];
    const closingTags = markup.match(/<\/script>/g) || [];

    expect(openingTags).toHaveLength(1);
    expect(closingTags).toHaveLength(1);
    expect(markup).toContain("\\u003c/script>");
  });
});

describe("SEO Publication Safety - Global Structured Data Safeguards", () => {
  const configuredOrigin = "https://www.motekra.com";

  it("withholds organizationSchema when unconfigured or preview mode", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "false");
    expect(organizationSchema()).toBeNull();
  });

  it("withholds websiteSchema when unconfigured or preview mode", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "false");
    expect(websiteSchema()).toBeNull();
  });

  it("generates complete organizationSchema in configured indexable mode", () => {
    vi.stubEnv("SITE_URL", configuredOrigin);
    vi.stubEnv("SITE_INDEXABLE", "true");

    const schema = organizationSchema();
    expect(schema).not.toBeNull();
    expect(schema?.["@context"]).toBe("https://schema.org");
    expect(schema?.["@type"]).toBe("Organization");
    expect(schema?.["@id"]).toBe(`${configuredOrigin}/#organization`);
    expect(schema?.name).toBe("MOTEKRA");
    expect(schema?.url).toBe(configuredOrigin);
    expect(schema?.logo).toEqual({
      "@type": "ImageObject",
      url: `${configuredOrigin}/assets/brand/motekra-mark.png`,
      width: 400,
      height: 400,
    });
  });

  it("generates complete websiteSchema in configured indexable mode", () => {
    vi.stubEnv("SITE_URL", configuredOrigin);
    vi.stubEnv("SITE_INDEXABLE", "true");

    const schema = websiteSchema();
    expect(schema).not.toBeNull();
    expect(schema?.["@context"]).toBe("https://schema.org");
    expect(schema?.["@type"]).toBe("WebSite");
    expect(schema?.["@id"]).toBe(`${configuredOrigin}/#website`);
    expect(schema?.name).toBe("MOTEKRA");
    expect(schema?.url).toBe(configuredOrigin);
    expect(schema?.inLanguage).toBe("en");
    expect(schema?.publisher).toEqual({
      "@id": `${configuredOrigin}/#organization`,
    });
  });

  it("falls back to NODE_ENV production check when SITE_INDEXABLE is undefined", () => {
    vi.stubEnv("SITE_URL", configuredOrigin);
    vi.stubEnv("SITE_INDEXABLE", undefined as unknown as string);
    vi.stubEnv("NODE_ENV", "production");

    expect(organizationSchema()).not.toBeNull();
    expect(websiteSchema()).not.toBeNull();

    vi.stubEnv("NODE_ENV", "development");
    expect(organizationSchema()).toBeNull();
    expect(websiteSchema()).toBeNull();
  });
});

