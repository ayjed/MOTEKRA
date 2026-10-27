import type { Founder, Project } from "@/content/models";
import { publishableProjects } from "@/content/models";
import { projects } from "@/content/projects";
import { founderDetails } from "@/content/team/profile";
import { founderProfiles } from "@/content/team";
import { getSiteOrigin, isIndexable, pageMetadata } from "@/lib/seo/site";

export function founderProjects(slug: string, records: readonly Project[] = projects) {
  return publishableProjects(records).flatMap((project) => {
    const contribution = project.contributions?.find((entry) => entry.personSlug === slug && entry.approved && entry.role.trim());
    return contribution ? [{ project, role: contribution.role }] : [];
  });
}
export function companyProjects(records: readonly Project[] = projects) { return publishableProjects(records).filter((project) => project.ownership === "motekra"); }
export function founderMetadata(person: Founder) {
  return { ...pageMetadata(`${person.name} — ${person.title}`, person.bio, `/team/${person.slug}`), ...(founderDetails[person.slug]?.detailsPublication !== "approved" ? { robots: { index: false, follow: false } } : {}) };
}
export function founderStructuredData(person: Founder, details = founderDetails[person.slug]) {
  const origin = getSiteOrigin();
  if (!origin || !isIndexable() || person.publication !== "approved" || details?.detailsPublication !== "approved") return null;
  return { "@context": "https://schema.org", "@type": "Person", "@id": `${origin}/team/${person.slug}#person`, name: person.name, jobTitle: person.title, description: person.bio, url: `${origin}/team/${person.slug}`, sameAs: founderProfiles.map(([,url])=>url), worksFor: { "@type": "Organization", "@id": `${origin}/#organization`, name: "MOTEKRA" }, ...(details.portrait ? { image: `${origin}${details.portrait.src}` } : {}), ...(details.skills.length ? { knowsAbout: details.skills } : {}) };
}
