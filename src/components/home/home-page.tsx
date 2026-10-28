import type { CSSProperties } from "react";
import { HomeSectionCinema } from "./section-cinema";
import { HomeCinema } from "./home-cinema";
import { HeroProduct } from "./hero-product";
import { SplitHeading } from "../motion/typography";
import { ProductPoster } from "../three/product-poster";
import { ButtonLink } from "../ui/primitives";
import { pageMetadata } from "@/lib/seo/site";
import { TestimonialsMarquee } from "./testimonials-marquee";
import { ServicesAccordion } from "../services/services-accordion";
import { HomeProcess } from "./home-process";
import { HomeWork } from "./home-work";
import { ConceptCreationVisual } from "./concept-creation-visual";
import "@/styles/home.css";
import "@/styles/services.css";

export const metadata = pageMetadata("Digital products for what’s next", "We design and build high-performance web and mobile applications that help ambitious businesses grow, scale, and create real impact.", "/");

const HERO_LINES = [
  { lineIndex: 0, words: ["Digital", "Products"] },
  { lineIndex: 1, words: ["for", "What’s", "Next."], highlight: "Next." },
];

function HeroHeading() {
  return (
    <h1 className="cinema-title" aria-label="Digital Products for What’s Next.">
      {HERO_LINES.map(({ lineIndex, words, highlight }) => (
        <span className={`hero-title-line title-line-${lineIndex}`} key={lineIndex} aria-hidden="true">
          {words.map((word, wordIndex) => {
            const isHighlight = word === highlight;
            const globalWordOrder = lineIndex === 0 ? wordIndex : 2 + wordIndex;
            return (
              <span
                className={`hero-word ${isHighlight ? "hero-word-accent" : "hero-word-navy"}`}
                key={word}
                style={{ "--word-order": globalWordOrder } as CSSProperties}
              >
                {wordIndex > 0 ? " " : ""}
                {Array.from(word).map((char, i) => (
                  <span
                    data-hero-glyph
                    key={i}
                    style={{ "--glyph-order": globalWordOrder * 5 + i } as CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function HomePage() {
  return <HomeCinema>
    <section className="home-hero home-hero-cinema" aria-label="Digital products for what’s next" data-home-section="hero">
      <div className="container cinema-hero-grid">
        <div className="hero-copy">
          <HeroHeading />
          <p className="lead" data-hero-support>We design and build high-performance web and mobile applications that help ambitious businesses grow, scale, and create real impact.</p>
          <div className="button-group" data-hero-support>
            <ButtonLink href="/work">See Our Work</ButtonLink>
            <ButtonLink href="/contact" secondary>Get in Touch</ButtonLink>
          </div>
          <div className="hero-capabilities-row" data-hero-support aria-label="Core Capabilities">
            <div className="hero-capability-item">
              <div className="hero-capability-icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="hero-capability-text">
                <strong>Web Development</strong>
                <span>Modern, scalable solutions.</span>
              </div>
            </div>
            <div className="hero-capability-divider" aria-hidden="true" />
            <div className="hero-capability-item">
              <div className="hero-capability-icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div className="hero-capability-text">
                <strong>Mobile Applications</strong>
                <span>iOS &amp; Android experiences.</span>
              </div>
            </div>
            <div className="hero-capability-divider" aria-hidden="true" />
            <div className="hero-capability-item">
              <div className="hero-capability-icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div className="hero-capability-text">
                <strong>UI/UX Design</strong>
                <span>User-centred digital products.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-product-handoff" id="hero-product">
          <div className="hero-orbit" aria-hidden="true" />
          <HeroProduct poster={<ProductPoster />} />
          <div className="capability-tag tag-solutions" aria-hidden="true"><span>Scalable Solutions</span> ↗</div>
          <div className="capability-tag tag-build" aria-hidden="true"><span>Web &amp; Mobile Development</span> ↗</div>
        </div>
      </div>
    </section>

    <HomeWork />

    <section className="section home-services" id="home-services" data-home-section="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-heading">
          <div id="services-title">
            <SplitHeading lines={["What We", "Bring to Life."]} />
          </div>
          <div>
            <p className="services-intro">One connected perspective.<br />Five ways to move an idea forward.</p>
            <ButtonLink href="/services" secondary>Explore All Services</ButtonLink>
          </div>
        </div>
        <ServicesAccordion />
      </div>
    </section>

    <HomeProcess />

    <TestimonialsMarquee />

    <HomeSectionCinema kind="contact">
      <section className="home-contact" id="home-contact" data-home-section="contact" aria-labelledby="contact-title">
        <div className="container home-contact-inner">
          <div className="contact-copy">
            <div id="contact-title">
              <SplitHeading lines={["Have Something", "in Mind?"]} />
            </div>
            <div className="button-group">
              <ButtonLink href="/contact">Let’s Talk</ButtonLink>
              <p>Tell us about your idea.<br />Let’s explore what’s possible.</p>
            </div>
          </div>
          <ConceptCreationVisual />
        </div>
      </section>
    </HomeSectionCinema>
  </HomeCinema>;
}
