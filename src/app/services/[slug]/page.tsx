import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { ServiceDetail } from "@/components/services/service-detail";
import { serviceMetadata, serviceStructuredData } from "@/lib/data/services";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? serviceMetadata(service) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const schema = serviceStructuredData(service);

  return (
    <>
      <JsonLd data={schema} />
      <ServiceDetail service={service} />
    </>
  );
}
