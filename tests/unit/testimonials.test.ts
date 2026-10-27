import { describe, expect, it } from "vitest";
import { testimonialsRow1, testimonialsRow2 } from "@/content/testimonials";

describe("Testimonials Marquee Data Quality", () => {
  it("has balanced content across both marquee rows", () => {
    expect(testimonialsRow1.length).toBeGreaterThanOrEqual(4);
    expect(testimonialsRow2.length).toBeGreaterThanOrEqual(4);
  });

  it("verifies all testimonials have valid required metadata and profile avatars", () => {
    const all = [...testimonialsRow1, ...testimonialsRow2];
    const seenIds = new Set<string>();

    for (const item of all) {
      expect(seenIds.has(item.id)).toBe(false);
      seenIds.add(item.id);

      expect(item.author.trim().length).toBeGreaterThan(0);
      expect(item.role.trim().length).toBeGreaterThan(0);
      expect(item.company.trim().length).toBeGreaterThan(0);
      expect(item.quote.trim().length).toBeGreaterThan(20);
      expect(item.rating).toBeGreaterThanOrEqual(1);
      expect(item.rating).toBeLessThanOrEqual(5);
      expect(item.avatarSrc).toMatch(/^\/assets\/testimonials\/[a-z]+\.jpg$/);

      // Verify no quotation marks surround the message per user instruction
      expect(item.quote.startsWith('"')).toBe(false);
      expect(item.quote.endsWith('"')).toBe(false);
      expect(item.quote.startsWith('“')).toBe(false);
      expect(item.quote.endsWith('”')).toBe(false);
    }
  });

  it("ensures authentic MOTEKRA client messaging without Magika copied text", () => {
    const all = [...testimonialsRow1, ...testimonialsRow2];
    for (const item of all) {
      expect(item.quote.toLowerCase()).not.toContain("magika");
      expect(item.quote.toLowerCase()).not.toContain("lorem ipsum");
      expect(item.company.toLowerCase()).not.toContain("magika");
    }
  });
});
