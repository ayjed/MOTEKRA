import { describe, expect, it } from "vitest";
import { publishableProjects, type Project } from "@/content/models";

const valid: Project = {
  slug: "test-record", title: "Test fixture only", publication: "approved", status: "concept",
  ownership: "founder-independent", role: "Interface design", displayPermission: true,
  summary: "A unit-test record, never shipped as site content.", resultsVerified: [],
};

describe("project publication safeguards", () => {
  it("allows an approved, attributed, permission-cleared record", () => {
    expect(publishableProjects([valid])).toEqual([valid]);
  });
  it.each([
    { publication: "draft" as const }, { displayPermission: false },
    { ownership: null }, { status: null }, { role: null }, { role: " " }, { summary: null },
  ])("withholds incomplete or unapproved records: %o", (patch) => {
    expect(publishableProjects([{ ...valid, ...patch }])).toEqual([]);
  });
});
