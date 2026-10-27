import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { ServiceDetail } from "@/components/services/service-detail";
import { serviceMetadata } from "@/lib/data/services";
export const dynamicParams = false;
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const service = services.find((item) => item.slug === slug); return service ? serviceMetadata(service) : {}; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const service = services.find((item) => item.slug === slug); if (!service) notFound(); return <ServiceDetail service={service} />; }
