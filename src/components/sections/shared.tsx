import Link from "next/link";
import type { ReactNode } from "react";
import { services } from "@/content/services";
import { Arrow, ButtonLink, DraftNote, Eyebrow } from "../ui/primitives";
import { HomeProcess } from "@/components/home/home-process";
import { SplitHeading } from "@/components/motion/typography";

export function PageHero({
  eyebrow,
  title,
  description,
  visual,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  visual?: ReactNode;
}) {
  return (
    <section className={`page-hero ${visual ? "has-visual" : ""}`}>
      <div className="container page-hero-grid">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p className="lead">{description}</p>
        </div>
        {visual}
      </div>
    </section>
  );
}

export function ServiceList({ full = false }: { full?: boolean }) {
  return (
    <>
      <DraftNote>Proposed service scope · awaiting confirmation</DraftNote>
      <div className={`service-list ${full ? "service-list-full" : ""}`}>
        {services.map((service) => (
          <article className="service-row" key={service.slug}>
            <span className="service-number">◆</span>
            <div className={`service-glyph glyph-${service.visual}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div>
              <h3>
                <Link prefetch={false} href={`/services/${service.slug}`}>
                  {service.title}
                </Link>
              </h3>
              <p>{service.description}</p>
            </div>
            <Link
              prefetch={false}
              href={`/services/${service.slug}`}
              className="circle-link"
              aria-label={`Explore ${service.title} proposed scope`}
            >
              <Arrow diagonal />
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

export const processSteps = [
  ["Discover", "Understand the idea, the people and the problem."],
  ["Define", "Shape a clear direction and agree on what matters."],
  ["Design", "Explore the experience, from flow to interface."],
  ["Develop", "Bring the product together with considered engineering."],
  ["Launch", "Review, refine and prepare the product for its next chapter."],
] as const;

export function Process() {
  return <HomeProcess />;
}

export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container cta-inner">
        <div>
          <SplitHeading lines={["Ready to Bring Your", "Ideas to Life?"]} />
        </div>
        <div>
          <ButtonLink href="/contact">Let’s Talk</ButtonLink>
        </div>
      </div>
    </section>
  );
}
