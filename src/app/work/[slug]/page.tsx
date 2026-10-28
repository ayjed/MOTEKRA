import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { publishableProjects, type Project } from "@/content/models";
import { candidates, isCandidate } from "@/content/projects/candidates";
import { caseStudies } from "@/content/projects/case-studies";
import { ProjectDetail } from "@/components/work/project-detail";
import { projectMetadata } from "@/lib/seo/schema";

const getVisibleProject = (slug: string) =>
  publishableProjects(projects).find((project) => project.slug === slug) ??
  candidates.find((project) => project.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = new Set([
    ...publishableProjects(projects).map(({ slug }) => slug),
    ...candidates.map(({ slug }) => slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getVisibleProject(slug);
  if (!project) return { title: "Project unavailable", robots: { index: false, follow: false } };

  if (isCandidate(project)) {
    const study = caseStudies[project.slug];
    return {
      title: `${project.title} — Case Study | MOTEKRA`,
      description: study?.lead ?? project.summary ?? "A modern digital product portfolio case study by MOTEKRA.",
      robots: { index: false, follow: false, nosnippet: true },
      alternates: { canonical: null },
    };
  }

  return projectMetadata(project);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getVisibleProject(slug);
  if (!project) notFound();

  // Strip internal verification records from client hydration bundle
  const sanitized: Project = {
    slug: project.slug,
    title: project.title,
    publication: project.publication,
    status: project.status,
    ownership: project.ownership,
    role: project.role,
    displayPermission: project.displayPermission,
    summary: project.summary,
    resultsVerified: project.resultsVerified,
    category: project.category,
  };

  return <ProjectDetail project={sanitized} />;
}
