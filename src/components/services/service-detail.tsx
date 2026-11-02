"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/content/models";
import { serviceDetails } from "@/content/services/details";
import { serviceStructuredData } from "@/lib/data/services";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/primitives";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/service-detail.css";

export function ServiceDetail({ service }: { service: Service }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const copy = serviceDetails[service.slug];

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // In reduced-motion mode, all elements remain statically visible
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Hero headline entrance timeline
      const hero = root.querySelector<HTMLElement>(".service-subpage-hero");
      if (hero) {
        const titleLine = hero.querySelector<HTMLElement>("[data-service-hero-title]");
        const lead = hero.querySelector<HTMLElement>(".service-hero-lead");
        const action = hero.querySelector<HTMLElement>(".service-hero-action");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top 90%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        if (titleLine) {
          tl.fromTo(
            titleLine,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.95, ease: "power3.out", clearProps: "all" },
            0
          );
        }

        if (lead) {
          tl.fromTo(
            lead,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all" },
            0.20
          );
        }

        if (action) {
          tl.fromTo(
            action,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
            0.32
          );
        }
      }

      // 2. Showcase visual reveal
      const showcase = root.querySelector<HTMLElement>(".service-showcase-section");
      if (showcase) {
        const frame = showcase.querySelector<HTMLElement>(".service-showcase-frame");
        const showcaseHeading = showcase.querySelector<HTMLElement>(".service-showcase-heading");
        const showcaseText = showcase.querySelector<HTMLElement>(".service-showcase-overview");
        const highlights = showcase.querySelectorAll<HTMLElement>(".service-showcase-highlights li");

        const showcaseTl = gsap.timeline({
          scrollTrigger: {
            trigger: showcase,
            start: "top 85%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        if (showcaseHeading) {
          showcaseTl.fromTo(
            showcaseHeading,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", clearProps: "all" },
            0
          );
        }

        if (showcaseText) {
          showcaseTl.fromTo(
            showcaseText,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all" },
            0.18
          );
        }

        if (highlights.length) {
          showcaseTl.fromTo(
            highlights,
            { opacity: 0, x: -14 },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, clearProps: "all" },
            0.2
          );
        }

        if (frame) {
          showcaseTl.fromTo(
            frame,
            { opacity: 0, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.85, clearProps: "all" },
            0.15
          );
        }
      }

      // 3. Deliverables cards staggered entrance
      const deliverablesSection = root.querySelector<HTMLElement>(".service-deliverables-section");
      if (deliverablesSection) {
        const cards = deliverablesSection.querySelectorAll<HTMLElement>(".deliverable-item-card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: deliverablesSection,
                start: "top 85%",
                once: true,
              },
            }
          );
        }
      }

      // 4. Approach steps staggered entrance
      const approachSection = root.querySelector<HTMLElement>(".service-approach-section");
      if (approachSection) {
        const steps = approachSection.querySelectorAll<HTMLElement>(".approach-step-card");
        if (steps.length) {
          gsap.fromTo(
            steps,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: approachSection,
                start: "top 85%",
                once: true,
              },
            }
          );
        }
      }

      // 5. FAQ section entrance
      const faqSection = root.querySelector<HTMLElement>(".service-faq-section");
      if (faqSection) {
        const faqItems = faqSection.querySelectorAll<HTMLElement>(".service-faq-details");
        const contactPanel = faqSection.querySelector<HTMLElement>(".service-contact-panel");

        if (faqItems.length) {
          gsap.fromTo(
            faqItems,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: faqSection,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        if (contactPanel) {
          gsap.fromTo(
            contactPanel,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: contactPanel,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      }
    });

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      const allElements = root.querySelectorAll<HTMLElement>(
        "[data-service-hero-title], .service-hero-lead, .service-hero-action, .service-showcase-heading, .service-showcase-overview, .service-showcase-highlights li, .service-showcase-frame, .deliverable-item-card, .approach-step-card, .service-faq-details, .service-contact-panel"
      );
      allElements.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      mm.revert();
    };
  });

  if (!copy) return null;
  const schema = serviceStructuredData(service);

  return (
    <div className="service-subpage" ref={containerRef}>
      <JsonLd data={schema} />

      {/* ====================================================================
          Section 1 — Service Hero
          ==================================================================== */}
      <header className="service-subpage-hero" aria-labelledby="service-title">
        <div className="container">
          <nav aria-label="Breadcrumb" className="service-subpage-breadcrumbs">
            <ol className="breadcrumb-list">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li className="sep" aria-hidden="true">/</li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li className="sep" aria-hidden="true">/</li>
              <li className="current" aria-current="page">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="service-hero-content">
            <h1 id="service-title" className="service-hero-title" aria-label={service.title}>
              <span className="service-hero-title-mask" aria-hidden="true">
                <span data-service-hero-title>{service.title}</span>
              </span>
            </h1>
            <p className="service-hero-lead">{copy.intent}</p>
            <div className="service-hero-action">
              <ButtonLink href="/contact">Discuss Your Project</ButtonLink>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          Section 2 — Service Showcase (Two-Column Layout)
          ==================================================================== */}
      <section className="service-showcase-section" aria-labelledby="showcase-heading">
        <div className="container service-showcase-grid">
          {/* Left Column: Heading, Explanation, Supporting Details */}
          <div className="service-showcase-left">
            <h2 id="showcase-heading" className="service-showcase-heading">
              {copy.focus}
            </h2>
            <p className="service-showcase-overview">{copy.overview}</p>

            <ul className="service-showcase-highlights" aria-label={`Key capabilities for ${service.title}`}>
              {copy.highlights.map((highlight, idx) => (
                <li key={idx}>
                  <span className="highlight-bullet" aria-hidden="true">◆</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="service-showcase-cta">
              <ButtonLink href="/contact" secondary>Start a Conversation</ButtonLink>
            </div>
          </div>

          {/* Right Column: Polished Service Visual */}
          <div className="service-showcase-visual">
            <div className="service-showcase-frame">
              <Image
                src={copy.image.src}
                alt={copy.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 92vw"
                className="service-showcase-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          Section 3 — What We Deliver (4 Meaningful Deliverables)
          ==================================================================== */}
      <section className="service-deliverables-section" aria-labelledby="deliverables-heading">
        <div className="container">
          <div className="service-section-header">
            <h2 id="deliverables-heading" className="service-section-title">
              What We Deliver
            </h2>
            <p className="service-section-subtext">
              Tangible assets and production-ready deliverables built to scale with your team.
            </p>
          </div>

          <div className="service-deliverables-grid">
            {copy.deliverableItems.map((item, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <div key={item.title} className="deliverable-item-card">
                  <div className="deliverable-header">
                    <span className="deliverable-num">DELIVERABLE {num}</span>
                    <span className="deliverable-spark" aria-hidden="true">✦</span>
                  </div>
                  <h3 className="deliverable-title">{item.title}</h3>
                  <p className="deliverable-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          Section 4 — How We Approach It (3 Clear Practical Steps)
          ==================================================================== */}
      <section className="service-approach-section" aria-labelledby="approach-heading">
        <div className="container">
          <div className="service-section-header">
            <h2 id="approach-heading" className="service-section-title">
              How We Approach It
            </h2>
            <p className="service-section-subtext">
              A structured, transparent workflow tailored to your product milestones.
            </p>
          </div>

          <div className="service-approach-grid">
            {copy.approachSteps.map((step) => (
              <div key={step.title} className="approach-step-card">
                <div className="approach-card-top">
                  <span className="approach-step-badge">Phase {step.step}</span>
                  <span className="approach-step-arrow" aria-hidden="true">→</span>
                </div>
                <h3 className="approach-step-title">{step.title}</h3>
                <p className="approach-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          Section 5 — FAQs and Contact (3 Service-Specific FAQs + Clear CTA)
          ==================================================================== */}
      <section className="service-faq-section" aria-labelledby="faq-heading">
        <div className="container">
          <div className="service-section-header">
            <h2 id="faq-heading" className="service-section-title">
              Frequently Asked Questions
            </h2>
            <p className="service-section-subtext">
              Everything you need to know about our {service.title.toLowerCase()} process, tooling, and delivery.
            </p>
          </div>

          <div className="service-faq-container">
            {/* Left Column: Accessible Accordion */}
            <div className="service-faq-list" role="region" aria-label="Frequently Asked Questions">
              {copy.faqs.map((faq, idx) => (
                <details key={faq.question} className="service-faq-details" open={idx === 0}>
                  <summary className="service-faq-summary">
                    <span>{faq.question}</span>
                    <span className="service-faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div className="service-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            {/* Right Column: Clear Contact Action Card */}
            <div className="service-contact-panel">
              <h3>Have a project in mind?</h3>
              <p>
                Let’s explore your requirements, product scope, and technical direction together.
              </p>
              <div className="service-contact-actions">
                <ButtonLink href="/contact">Get in Touch</ButtonLink>
                <Link href="/services" className="service-back-link">
                  <span>← Explore all services</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
