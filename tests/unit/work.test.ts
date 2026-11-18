import { describe, expect, it } from "vitest";
import { candidates } from "@/content/projects/candidates";
import { publishableProjects } from "@/content/models";
import { canReviewDrafts, filterWork, getWorkItems, parseWorkCategory } from "@/lib/data/work";
import { generateMetadata } from "@/app/work/[slug]/page";
import { formatFullTitle } from "@/lib/seo/site";

describe("Work attribution and review safeguards", () => {
  it("never promotes the supplied screenshots to approved client work", () => {
    expect(candidates).toHaveLength(4);
    expect(publishableProjects(candidates)).toEqual([]);
    for (const candidate of candidates) {
      expect(candidate.publication).toBe("draft");
      expect(candidate.ownership).toBeNull();
      expect(candidate.role).toBeNull();
      expect(candidate.resultsVerified).toEqual([]);
      expect(candidate.displayPermission).toBe(false);
    }
  });
  it("requires both explicit review opt-in and a non-indexable environment", () => {
    expect(canReviewDrafts("true", false)).toBe(true);
    for (const enabled of [undefined, "false", "1", "TRUE"]) expect(canReviewDrafts(enabled, false)).toBe(false);
    expect(canReviewDrafts("true", true)).toBe(false);
  });
  it("keeps attribution filters separate from concept and delivery states", () => {
    const items = getWorkItems(true);
    expect(filterWork(items, "company")).toEqual([]);
    expect(filterWork(items, "founder")).toEqual([]);
    expect(filterWork(items, "draft")).toHaveLength(4);
    expect(filterWork(items, "concept").map((item) => item.id)).toContain("connectapi");
    expect(filterWork(items, "development").map((item) => item.id)).toEqual(["website-study-2"]);
    expect(getWorkItems(false).every((item) => item.kind !== "draft")).toBe(true);
  });
  it("does not treat arbitrary queries or unknown statuses as project categories", () => {
    expect(parseWorkCategory("company")).toBe("company");
    for (const input of ["shipped", ["company", "founder"], "<script>", null]) expect(parseWorkCategory(input)).toBe("all");
  });
  it("formats candidate case-study title without duplicate brand suffix and preserves noindex safeguards", async () => {
    for (const candidate of candidates) {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: candidate.slug }) });
      expect(metadata.title).toBe(`${candidate.title} - Case Study`);
      expect(metadata.title).not.toContain("MOTEKRA");
      expect(metadata.title).not.toContain("—");
      expect(metadata.title).not.toContain("|");

      // Verify layout template formatting produces exactly one " - MOTEKRA"
      const fullTitle = formatFullTitle(metadata.title as string);
      expect(fullTitle).toBe(`${candidate.title} - Case Study - MOTEKRA`);
      expect(fullTitle.match(/MOTEKRA/g)).toHaveLength(1);

      // Verify existing noindex, nofollow, nosnippet safeguards remain intact
      expect(metadata.robots).toEqual({
        index: false,
        follow: false,
        nosnippet: true,
        googleBot: { index: false, follow: false, nosnippet: true },
      });
      expect(metadata.alternates).toEqual({ canonical: null });
    }
  });
});
