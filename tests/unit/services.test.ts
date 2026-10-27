import { afterEach, describe, expect, it, vi } from "vitest";
import { services } from "@/content/services";
import { serviceDetails } from "@/content/services/details";
import { relatedServiceProjects, serviceMetadata, serviceStructuredData } from "@/lib/data/services";
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
  it("gives each existing route distinct useful proposed detail content", () => {
    for (const service of services) {
      const content = serviceDetails[service.slug];
      expect(content).toBeDefined();
      expect(content!.deliverables).toHaveLength(4);
      expect(content!.approach).toHaveLength(3);
      expect(content!.questions).toHaveLength(3);
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
});
