import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { publishableProjects } from "@/content/models";
import { candidates, isCandidate } from "@/content/projects/candidates";
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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getVisibleProject(slug);
  if (!project) return { title: "Project unavailable", robots: { index: false, follow: false } };
  if (isCandidate(project)) return { title: `${project.title} — Draft evidence review`, description: project.summary ?? "Unverified source evidence, not a completed client case.", robots: { index: false, follow: false, nosnippet: true }, alternates: { canonical: null } };
  return projectMetadata(project);
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getVisibleProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
