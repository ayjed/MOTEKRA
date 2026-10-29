import { notFound } from "next/navigation";
import { team } from "@/content/team";
import { FounderPage } from "@/components/about/founder-page";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { founderMetadata, founderStructuredData } from "@/lib/data/founder";
import { FloatingWhatsApp } from "@/components/team/floating-whatsapp";

export const dynamicParams = false;
export function generateStaticParams() { return team.filter((p) => p.publication === "approved").map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = team.find((p) => p.slug === slug && p.publication === "approved");
  return person ? founderMetadata(person) : {};
}

export default async function FounderProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = team.find((p) => p.slug === slug && p.publication === "approved");
  if (!person) notFound();
  return (
    <>
      <JsonLd data={founderStructuredData(person)} />
      <FounderPage person={person} />
      <FloatingWhatsApp personName="Ayomiposi" phoneNumber="447403605289" />
    </>
  );
}

