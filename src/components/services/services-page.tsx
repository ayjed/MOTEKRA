import Link from "next/link";
import { DraftNote } from "@/components/ui/primitives";
import { ContactCta, Process } from "@/components/sections/shared";
import { ServicesAccordion } from "./services-accordion";
import { ServicesCinema } from "./services-cinema";
import "@/styles/services.css";

export function ServicesPage() {
  return (
    <ServicesCinema>
      {/* Spacious White Introduction Section */}
      <section className="services-intro-section" aria-labelledby="services-main-heading">
        <div className="container">
          <div className="services-intro-grid">
            <div className="services-intro-left">
              <h1 id="services-main-heading" aria-label="What We Bring to Life.">
                <span className="services-title-mask" aria-hidden="true">
                  <span data-services-heading-line>What We</span>
                </span>{" "}
                <span className="services-title-mask" aria-hidden="true">
                  <span data-services-heading-line>Bring to</span>
                </span>{" "}
                <span className="services-title-mask title-blue" aria-hidden="true">
                  <span data-services-heading-line>Life.</span>
                </span>
              </h1>

              <p className="lead" data-services-hero-lead>
                From early product strategy to high-performance web and mobile engineering, we partner with visionary teams to turn complex ideas into digital realities.
              </p>

              <div data-services-hero-meta className="services-intro-meta">
                <DraftNote>Five core capabilities · bespoke product delivery</DraftNote>
              </div>
            </div>

            <div className="services-intro-right" data-services-hero-callout>
              <div className="services-intro-callout">
                <span className="callout-tag">END-TO-END METHODOLOGY</span>
                <p>
                  Every engagement blends human-centered interface design, production-grade cloud architecture, and strategic rigor. No generic templates, no fragmented handoffs.
                </p>
                <Link prefetch={false} href="/contact" className="services-intro-cta">
                  <span>Discuss your product</span>
                  <span className="cta-arrow" aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Rounded Dark-Navy Services Container */}
      <section className="services-interactive-section" aria-label="Interactive Capabilities Directory">
        <div className="container">
          <ServicesAccordion />
        </div>
      </section>

      {/* Authentic Process Section */}
      <Process />

      {/* Scope Agreement Section */}
      <section className="services-scope-section">
        <div className="container services-scope-grid">
          <div>
            <h2 aria-label="A connected approach. A clear agreement.">
              <span className="services-title-mask" aria-hidden="true">
                <span data-scope-heading-line>A connected approach.</span>
              </span>
              <span className="services-title-mask" aria-hidden="true">
                <span data-scope-heading-line>A clear agreement.</span>
              </span>
            </h2>
            <p data-scope-lead>
              These capabilities are tailored to each engagement. Deliverables, platforms, timelines, responsibilities and milestones are rigorously aligned before implementation begins.
            </p>
            <Link prefetch={false} href="/contact" className="services-scope-btn" data-scope-cta>
              Discuss the proposed scope
            </Link>
          </div>
          <ol>
            {[
              ["The product", "What should people be able to do, and what evidence already exists?"],
              ["The boundary", "What belongs in this scope—and what needs a separate decision?"],
              ["The next step", "What can be reviewed, tested or agreed before implementation continues?"],
            ].map(([title, body]) => (
              <li key={title}>
                <span aria-hidden="true">◆</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact CTA Section */}
      <ContactCta />
    </ServicesCinema>
  );
}
