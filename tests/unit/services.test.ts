import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { services } from "@/content/services";
import { serviceDetails } from "@/content/services/details";
import { relatedServiceProjects, serviceMetadata, serviceStructuredData } from "@/lib/data/services";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceDetail } from "@/components/services/service-detail";

afterEach(() => vi.unstubAllEnvs());

describe("provisional service publication", () => {
  it("keeps every proposed capability provisional without active-offering schema", () => {
    vi.stubEnv("SITE_URL", "https://example.test"); vi.stubEnv("SITE_INDEXABLE", "true");
    expect(services).toHaveLength(5);
    for (const service of services) {
      expect(service.publication).toBe("draft");
      expect(serviceStructuredData(service)).toBeNull();
      expect(serviceMetadata(service).robots).toEqual({ index: false, follow: false });
      expect(relatedServiceProjects(service.slug)).toEqual([]);
    }
  });

  it("gives each existing route distinct useful proposed detail content with 4 deliverables, 3 approach steps, and 3 FAQs", () => {
    for (const service of services) {
      const content = serviceDetails[service.slug];
      expect(content).toBeDefined();
      expect(content!.deliverables).toHaveLength(4);
      expect(content!.deliverableItems).toHaveLength(4);
      expect(content!.approach).toHaveLength(3);
      expect(content!.approachSteps).toHaveLength(3);
      expect(content!.questions).toHaveLength(3);
      expect(content!.faqs).toHaveLength(3);
      expect(content!.highlights).toHaveLength(4);
    }
    expect(new Set(services.map((service) => serviceDetails[service.slug]?.overview)).size).toBe(5);
  });

  it("requires approval and configured indexability before emitting factual Service schema", () => {
    const fixture = { ...services[0]!, publication: "approved" as const };
    vi.stubEnv("SITE_URL", ""); vi.stubEnv("SITE_INDEXABLE", "true");
    expect(serviceStructuredData(fixture)).toBeNull();
    vi.stubEnv("SITE_URL", "https://example.test"); vi.stubEnv("SITE_INDEXABLE", "false");
    expect(serviceStructuredData(fixture)).toBeNull();
    vi.stubEnv("SITE_INDEXABLE", "true");
    const schema = serviceStructuredData(fixture);
    expect(schema?.["@type"]).toBe("Service");
    expect(schema).not.toHaveProperty("offers");
    expect(schema).not.toHaveProperty("aggregateRating");
  });

  it("renders Service JSON-LD on the server route and keeps the client detail component free of duplicate schema", () => {
    vi.stubEnv("SITE_URL", "https://example.test");
    vi.stubEnv("SITE_INDEXABLE", "true");
    const approvedFixture = { ...services[0]!, publication: "approved" as const };

    // Server route markup with approved fixture in indexable mode:
    const serverHtml = renderToStaticMarkup(
      createElement(
        Fragment,
        null,
        createElement(JsonLd, { data: serviceStructuredData(approvedFixture) }),
        createElement(ServiceDetail, { service: approvedFixture })
      )
    );
    expect(serverHtml).toContain('"@type":"Service"');
    expect(serverHtml).toContain('"name":"UI/UX Design"');
    expect(serverHtml).toContain('"serviceType":"UI/UX Design"');
    expect(serverHtml).toContain("https://example.test/services/ui-ux-design#service");
    expect(serverHtml).not.toContain('"offers"');
    expect(serverHtml).not.toContain('"aggregateRating"');

    // For draft services, server route emits NO schema:
    const draftHtml = renderToStaticMarkup(
      createElement(
        Fragment,
        null,
        createElement(JsonLd, { data: serviceStructuredData(services[0]!) }),
        createElement(ServiceDetail, { service: services[0]! })
      )
    );
    expect(draftHtml).not.toContain('"@type":"Service"');
    expect(draftHtml).not.toContain('<script type="application/ld+json"');

    // In non-indexable mode, even approved fixture emits NO schema:
    vi.stubEnv("SITE_INDEXABLE", "false");
    const nonIndexableHtml = renderToStaticMarkup(
      createElement(
        Fragment,
        null,
        createElement(JsonLd, { data: serviceStructuredData(approvedFixture) }),
        createElement(ServiceDetail, { service: approvedFixture })
      )
    );
    expect(nonIndexableHtml).not.toContain('"@type":"Service"');

    // Client component in isolation never renders JsonLd (preventing hydration duplication):
    const clientOnlyHtml = renderToStaticMarkup(
      createElement(ServiceDetail, { service: approvedFixture })
    );
    expect(clientOnlyHtml).not.toContain('<script type="application/ld+json"');
    expect(clientOnlyHtml).not.toContain('"@type":"Service"');
  });

  it("applies Issue 03 standard hyphen formatting to service metadata titles", () => {
    vi.stubEnv("SITE_URL", "https://example.test");
    vi.stubEnv("SITE_INDEXABLE", "true");
    for (const service of services) {
      const meta = serviceMetadata(service);
      expect(meta.title).toBe(`${service.title} - Proposed scope`);
      expect(meta.title).not.toContain("—");
      expect(meta.title).not.toContain("|");
      expect(meta.openGraph?.title).toBe(`${service.title} - Proposed scope - MOTEKRA`);
      expect(meta.twitter?.title).toBe(`${service.title} - Proposed scope - MOTEKRA`);
    }
  });

  it("enforces verified tech capabilities and removes unsupported claims", () => {
    const web = serviceDetails["web-development"]!;
    const webText = JSON.stringify(web);
    expect(webText).toContain("PHP");
    expect(webText).toContain("Laravel");
    expect(webText).toContain("REST API");
    expect(webText).toContain("React");
    expect(webText).toContain("Next.js");
    expect(webText).toContain("TypeScript");
    expect(webText).not.toContain("Sub-second Core Web Vitals");

    const mobile = serviceDetails["mobile-app-development"]!;
    const mobileText = JSON.stringify(mobile);
    expect(mobileText).toContain("Flutter");
    expect(mobileText).toContain("Dart");
    expect(mobileText).not.toContain("React Native");
    expect(mobileText).not.toContain("60fps");

    const strategy = serviceDetails["product-strategy"]!;
    const strategyText = JSON.stringify(strategy);
    expect(strategyText).not.toContain("one to three weeks");

    const brand = serviceDetails["brand-visual-design"]!;
    const brandFaqs = brand.faqs.map((f) => f.answer).join(" ");
    expect(brandFaqs).toContain("Pantone");
    expect(brandFaqs).toContain("outside our core scope");
  });
});
