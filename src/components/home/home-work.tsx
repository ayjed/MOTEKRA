"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { candidates, candidateImage } from "@/content/projects/candidates";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/davka-work.css";

const HOMEPAGE_FEATURED_SLUGS = ["tog-africa", "connectapi"] as const;

const featuredProjects = HOMEPAGE_FEATURED_SLUGS
  .map((slug) => candidates.find((c) => c.slug === slug))
  .filter((c): c is (typeof candidates)[number] => Boolean(c));

export function HomeWork() {
  const containerRef = useRef<HTMLElement>(null);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // In reduced-motion mode, keep cards statically visible without scrub
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const header = root.querySelector<HTMLElement>(".davka-work-header");
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".davka-project-card"));

      const titleLines = root.querySelectorAll<HTMLElement>("[data-work-title-line]");
      const allProjectsLink = root.querySelector<HTMLElement>(".davka-all-projects-link");

      if (header) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        if (titleLines.length) {
          headerTl.fromTo(
            titleLines,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.14,
              ease: "power3.out",
              clearProps: "all",
            },
            0
          );
        }

        if (allProjectsLink) {
          headerTl.fromTo(
            allProjectsLink,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              clearProps: "all",
            },
            0.22
          );
        }
      }

      // Ensure all project titles and arrows remain visible
      cards.forEach((card) => {
        const title = card.querySelector<HTMLElement>(".davka-project-title");
        const arrow = card.querySelector<HTMLElement>(".davka-project-arrow");
        if (title) gsap.set(title, { opacity: 1, clearProps: "all" });
        if (arrow) gsap.set(arrow, { opacity: 1, clearProps: "all" });
      });

      // Animate card titles and arrows with a subtle upward reveal
      cards.forEach((card) => {
        const title = card.querySelector<HTMLElement>(".davka-project-title");
        const arrow = card.querySelector<HTMLElement>(".davka-project-arrow");

        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            }
          );
        }

        if (arrow) {
          gsap.fromTo(
            arrow,
            { opacity: 0, scale: 0.86 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: "back.out(1.4)",
              clearProps: "all",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      });

      // Initial smooth reveal for the first project card
      if (cards[0]) {
        gsap.fromTo(
          cards[0],
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 95%",
              once: true,
            },
          }
        );
      }

      // Strict one-visible-project-at-a-time transition:
      // When card i+1 enters view, card i completely vanishes (autoAlpha -> 0, scale -> 0.93, y -> -28).
      // On scroll back up (onLeaveBack), card i is deterministically restored to full visibility.
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];

          gsap.fromTo(
            card,
            { autoAlpha: 1, scale: 1, y: 0 },
            {
              autoAlpha: 0,
              scale: 0.93,
              y: -28,
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top 95%",
                end: "top 25%",
                scrub: 0.35,
                invalidateOnRefresh: true,
                onLeaveBack: () => {
                  gsap.set(card, { autoAlpha: 1, scale: 1, y: 0 });
                },
              },
            }
          );
        }
      });
    });

    const ensureVisible = () => {
      root.querySelectorAll<HTMLElement>("[data-work-title-line]").forEach((line) => {
        gsap.set(line, { clearProps: "all" });
        line.style.opacity = "1";
        line.style.transform = "none";
      });
      const allProjectsLink = root.querySelector<HTMLElement>(".davka-all-projects-link");
      if (allProjectsLink) {
        gsap.set(allProjectsLink, { clearProps: "all" });
        allProjectsLink.style.opacity = "1";
        allProjectsLink.style.transform = "none";
      }
    };
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);
    window.addEventListener("pageshow", ensureVisible);
    window.addEventListener("motekra-tab-restored", ensureVisible);

    return () => {
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      window.removeEventListener("pageshow", ensureVisible);
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      mm.revert();
    };
  });

  return (
    <section
      className="section davka-work-section"
      id="featured-work"
      ref={containerRef}
      aria-labelledby="work-title"
    >
      <div className="container">
        {/* Section Header */}
        <div className="davka-work-header">
          <div>
            <h2 id="work-title" className="davka-work-title" aria-label="Real Projects. Real Impact.">
              <span className="davka-title-mask" aria-hidden="true">
                <span data-work-title-line>Real Projects.</span>
              </span>
              <span className="davka-title-mask" aria-hidden="true">
                <span data-work-title-line>Real Impact.</span>
              </span>
            </h2>
          </div>

          <Link href="/work" className="davka-all-projects-link">
            <span>Explore All Work</span>
            <span className="davka-all-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Cinematic Projects Stack — Strict One Project at a Time */}
        <div className="davka-work-stack">
          {featuredProjects.map((project, idx) => {
            const img = candidateImage(project.slug, "hero");
            return (
              <article
                key={project.slug}
                data-work-card
                className="davka-project-card"
                style={{
                  zIndex: idx + 1,
                } as React.CSSProperties}
              >
                <Link
                  prefetch={false}
                  href={`/work/${project.slug}`}
                  className="davka-project-link"
                  aria-label={`View ${project.title} case study`}
                >
                  <div className="davka-project-media">
                    <Image
                      src={img.src}
                      alt={`${project.title} — Digital product interface visual`}
                      fill
                      sizes="(max-width: 768px) 96vw, (max-width: 1280px) 92vw, 1280px"
                      className="davka-project-img"
                      priority={false}
                    />
                    <div className="davka-project-overlay" />
                  </div>

                  {/* Card Bottom Footer: Bottom-Left Title & Bottom-Right Arrow */}
                  <div className="davka-project-footer">
                    <h3 className="davka-project-title">{project.title}</h3>
                    <div className="davka-project-arrow" aria-hidden="true">
                      <span className="davka-project-arrow-icon">↗</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
