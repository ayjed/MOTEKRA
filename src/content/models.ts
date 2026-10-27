export type Publication = "draft" | "approved";
export type Ownership = "motekra" | "founder-independent" | "collaborator";
export type ProjectStatus = "completed" | "concept" | "in-development";

export interface Project {
  slug: string;
  title: string;
  publication: Publication;
  status: ProjectStatus | null;
  ownership: Ownership | null;
  role: string | null;
  displayPermission: boolean;
  summary: string | null;
  resultsVerified: string[];
  seo?: { title?: string; description?: string };
  links?: readonly { label: string; url: string; verified: boolean }[];
  category?: string;
  serviceSlugs?: readonly string[];
  contributions?: readonly { personSlug: string; role: string; approved: boolean }[];
  problem?: string | null;
  process?: readonly string[];
  solution?: string | null;
  technologies?: readonly string[];
  images?: readonly { src: string; alt: string; caption: string; width: number; height: number }[];
}

export interface Service {
  slug: string;
  title: string;
  publication: Publication;
  description: string;
  visual: "design" | "web" | "mobile" | "strategy" | "brand";
}

export interface Founder {
  slug: string;
  name: string;
  title: string;
  bio: string;
  publication: Publication;
}

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  list?: readonly string[];
  code?: { language: string; text: string };
}
export interface Article {
  slug: string;
  title: string;
  summary: string;
  author: { name: string; verified: boolean; personSlug?: string };
  publishedAt: string;
  modifiedAt?: string;
  publication: Publication;
  review: { name: string; date: string; approved: boolean } | null;
  sections: readonly ArticleSection[];
  sources?: readonly { title: string; url: string }[];
  serviceSlugs?: readonly string[];
  projectSlugs?: readonly string[];
  topics: readonly string[];
}

export function publishableProjects(projects: readonly Project[]): Project[] {
  return projects.filter((p) => p.publication === "approved" && p.displayPermission
    && p.ownership !== null && p.status !== null && Boolean(p.role?.trim()) && Boolean(p.summary?.trim()));
}
