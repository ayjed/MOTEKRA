import type { Service } from "@/content/models";
import { publishableProjects } from "@/content/models";
import { projects } from "@/content/projects";
import { getSiteOrigin, isIndexable, pageMetadata } from "@/lib/seo/site";

export function relatedServiceProjects(slug: string) { return publishableProjects(projects).filter((project) => project.serviceSlugs?.includes(slug)); }
export function serviceMetadata(service: Service) {
  return { ...pageMetadata(`${service.title} — ${service.publication === "draft" ? "Proposed scope" : "Digital product services"}`, service.description, `/services/${service.slug}`), ...(service.publication === "draft" ? { robots: { index: false, follow: false } } : {}) };
}
export function serviceStructuredData(service: Service) {
  const origin = getSiteOrigin();
  if (service.publication !== "approved" || !origin || !isIndexable()) return null;
  return { "@context": "https://schema.org", "@type": "Service", name: service.title, serviceType: service.title, description: service.description, url: `${origin}/services/${service.slug}`, "@id": `${origin}/services/${service.slug}#service`, provider: { "@type": "Organization", "@id": `${origin}/#organization`, name: "MOTEKRA" } };
}
