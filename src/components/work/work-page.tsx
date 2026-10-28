"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactCta } from "@/components/sections/shared";
import { candidates, candidateImage } from "@/content/projects/candidates";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/work.css";

const PROJECT_CATEGORIES: Record<string, string> = {
  "spotlight-contest": "Web Application",
  "lad-global-travels": "Travel & Mobility",
  "tog-africa": "Corporate Platform",
  "connectapi": "UI/UX Concept",
};

export function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // In reduced-motion mode, cards remain statically visible
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = root.querySelector<HTMLElement>(".work-hero");
      const cards = root.querySelectorAll<HTMLElement>("[data-work-card]");

      // Header entrance animation
      if (hero) {
        const lead = hero.querySelector<HTMLElement>(".work-hero-lead");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top 90%",
            once: true,
          },
        });

        const titleLine = hero.querySelector<HTMLElement>("[data-work-hero-line]");
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
      }

      // Elegant masked reveal for each card in the 2-column grid
      cards.forEach((card, idx) => {
        const media = card.querySelector<HTMLElement>(".work-card-media-wrap");
        const footer = card.querySelector<HTMLElement>(".work-card-footer");

        if (media) {
          gsap.fromTo(
            media,
            {
              clipPath: "inset(0 0 8% 0 round 16px)",
              opacity: 0.8,
              y: 20,
            },
            {
              clipPath: "inset(0 0 0% 0 round 16px)",
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: (idx % 2) * 0.12,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                once: true,
              },
            }
          );
        }

        if (footer) {
          gsap.fromTo(
            footer,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: (idx % 2) * 0.12 + 0.15,
              ease: "power2.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                once: true,
              },
            }
          );
        }
      });
    });

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      const hero = root.querySelector<HTMLElement>(".work-hero");
      if (hero) {
        const title = hero.querySelector<HTMLElement>(".work-hero-title");
        const lead = hero.querySelector<HTMLElement>(".work-hero-lead");
        if (title) { title.style.opacity = "1"; title.style.transform = "none"; }
        if (lead) { lead.style.opacity = "1"; lead.style.transform = "none"; }
      }
      root.querySelectorAll<HTMLElement>("[data-work-card]").forEach((card) => {
        const media = card.querySelector<HTMLElement>(".work-card-media-wrap");
        const footer = card.querySelector<HTMLElement>(".work-card-footer");
        if (media) { media.style.opacity = "1"; media.style.clipPath = "none"; }
        if (footer) { footer.style.opacity = "1"; footer.style.transform = "none"; }
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

  return (
    <div className="work-cinema" ref={containerRef}>
      {/* Editorial Work Page Hero */}
      <section className="work-hero" aria-labelledby="work-main-heading">
        <div className="container">
          <div className="work-hero-inner">
            <div className="work-hero-headline-wrap">
              <h1 id="work-main-heading" className="work-hero-title" aria-label="Selected Work.">
                <span className="work-title-mask" aria-hidden="true">
                  <span data-work-hero-line>Selected Work.</span>
                </span>
              </h1>
              <p className="work-hero-lead">
                A selection of digital products, websites, and interfaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial 2-Column Portfolio Grid */}
      <section className="work-portfolio-section" aria-label="Selected Projects">
        <div className="container">
          <div className="work-portfolio-grid" role="region" aria-label="Portfolio Grid">
            {candidates.map((project, idx) => {
              const img = candidateImage(project.slug, "hero");
              const category = PROJECT_CATEGORIES[project.slug] ?? "Digital Product";

              return (
                <article
                  key={project.slug}
                  data-work-card
                  data-project={project.slug}
                  className="work-portfolio-card"
                >
                  <Link
                    prefetch={false}
                    href={`/work/${project.slug}`}
                    className="work-card-link"
                    aria-label={`View ${project.title} case study — ${category}`}
                  >
                    <div className="work-card-media-wrap">
                      <div className="work-card-media">
                        <Image
                          src={img.src}
                          alt={`${project.title} — ${category} interface visual`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                          className="work-card-img"
                          priority={idx < 2}
                        />
                        <div className="work-card-scrim" />
                      </div>
                    </div>

                    <div className="work-card-footer">
                      <div className="work-card-meta">
                        <h2 className="work-card-title">{project.title}</h2>
                        <span className="work-card-category">{category}</span>
                      </div>
                      <span className="work-card-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <ContactCta />
    </div>
  );
}
