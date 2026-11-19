import type { Service } from "@/content/models";
import { publishableProjects } from "@/content/models";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { getSiteOrigin, isIndexable, pageMetadata } from "@/lib/seo/site";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const complementaryServiceSlugs: Readonly<Record<string, readonly string[]>> = {
  "ui-ux-design": ["web-development", "mobile-app-development"],
  "web-development": ["ui-ux-design", "product-strategy"],
  "mobile-app-development": ["ui-ux-design", "web-development"],
  "product-strategy": ["ui-ux-design", "web-development"],
  "brand-visual-design": ["ui-ux-design", "product-strategy"],
};

export function complementaryServicesFor(slug: string): Service[] {
  const currentService = services.find((s) => s.slug === slug);
  if (!currentService || currentService.publication !== "approved") {
    return [];
  }
  const targetSlugs = complementaryServiceSlugs[slug] ?? [];
  return targetSlugs
    .map((targetSlug) => services.find((s) => s.slug === targetSlug))
    .filter((s): s is Service => Boolean(s && s.slug !== slug && s.publication === "approved"));
}

export function relatedServiceProjects(slug: string) { return publishableProjects(projects).filter((project) => project.serviceSlugs?.includes(slug)); }
export function serviceMetadata(service: Service) {
  return { ...pageMetadata(`${service.title} - ${service.publication === "draft" ? "Proposed scope" : "Digital Product Services"}`, service.description, `/services/${service.slug}`), ...(service.publication === "draft" ? { robots: { index: false, follow: false } } : {}) };
}
export function serviceStructuredData(service: Service) {
  const origin = getSiteOrigin();
  if (service.publication !== "approved" || !origin || !isIndexable()) return null;
  return { "@context": "https://schema.org", "@type": "Service", name: service.title, serviceType: service.title, description: service.description, url: `${origin}/services/${service.slug}`, "@id": `${origin}/services/${service.slug}#service`, provider: { "@type": "Organization", "@id": `${origin}/#organization`, name: "MOTEKRA" } };
}

export function serviceBreadcrumbs(service: Service) {
  if (service.publication !== "approved") return null;
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ]);
}
