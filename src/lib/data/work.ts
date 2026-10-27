import { candidates } from "@/content/projects/candidates";
import { projects } from "@/content/projects";
import { publishableProjects, type Project } from "@/content/models";
import { studies } from "@/content/studies";
import { isIndexable } from "@/lib/seo/site";

export const workCategories = [
  ["all", "All work"], ["company", "Company / shipped"], ["founder", "Founder / collaborative"],
  ["concept", "UI/UX concepts"], ["development", "In development"], ["draft", "Draft evidence"],
] as const;
export type WorkCategory = typeof workCategories[number][0];
export function parseWorkCategory(value: unknown): WorkCategory { return workCategories.some(([key]) => key === value) ? value as WorkCategory : "all"; }
export function canReviewDrafts(enabled: string | undefined, indexable: boolean) { return enabled === "true" && !indexable; }
export function workReviewEnabled() { return canReviewDrafts(process.env.WORK_DRAFT_REVIEW_ENABLED, isIndexable()); }

export type WorkItem = { kind: "project" | "draft"; id: string; title: string; summary: string; href: string; status: string; attribution: string; project: Project } | { kind: "study"; id: string; title: string; summary: string; href: string; status: string; attribution: string; visual: "device" | "system" | "flow" };
export function ownershipLabel(project: Project) { return project.ownership === "motekra" ? "MOTEKRA engagement" : project.ownership === "founder-independent" ? "Founder’s independent work" : project.ownership === "collaborator" ? "Collaborative contribution" : "Attribution unverified"; }
export function statusLabel(project: Project) { return project.status === "completed" ? "Completed" : project.status === "in-development" ? "In Development" : project.status === "concept" ? "Concept" : "Delivery status unverified"; }
export function getWorkItems(review: boolean): WorkItem[] {
  const approved: WorkItem[] = publishableProjects(projects).map((project) => ({ kind: "project", id: project.slug, title: project.title, summary: project.summary!, href: `/work/${project.slug}`, status: statusLabel(project), attribution: ownershipLabel(project), project }));
  const drafts: WorkItem[] = review ? candidates.map((project) => ({ kind: "draft", id: project.slug, title: project.title, summary: project.summary!, href: `/work/${project.slug}`, status: project.status === "concept" ? "Draft / Concept" : "Draft / Unverified", attribution: "Attribution unverified", project })) : [];
  const experiments: WorkItem[] = studies.map((study, index) => ({ kind: "study", id: `website-study-${index}`, title: study.title, summary: `${study.type}. Implemented as part of this website exploration; no client delivery or founder authorship is asserted.`, href: `/${study.href}`, status: study.status, attribution: "Internal website study", visual: study.visual }));
  return [...approved, ...drafts, ...experiments];
}
export function filterWork(items: readonly WorkItem[], category: WorkCategory): WorkItem[] {
  return items.filter((item) => category === "all" || (category === "draft" ? item.kind === "draft" : category === "development" ? item.status === "In Development" : category === "concept" ? item.status.includes("Concept") : item.kind === "project" && (category === "company" ? item.project.ownership === "motekra" && item.project.status === "completed" : item.project.ownership === "founder-independent" || item.project.ownership === "collaborator")));
}
export function getVisibleProject(slug: string): Project | undefined { return publishableProjects(projects).find((p) => p.slug === slug) ?? (workReviewEnabled() ? candidates.find((p) => p.slug === slug) : undefined); }
