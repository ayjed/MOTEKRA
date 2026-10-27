"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { candidates, candidateImage } from "@/content/projects/candidates";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/davka-work.css";

export function HomeWork() {
  const containerRef = useRef<HTMLElement>(null);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const header = root.querySelector<HTMLElement>(".davka-work-header");
    const cards = root.querySelectorAll<HTMLElement>(".davka-project-card");

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            toggleActions: "play none none none"
          }
        }
      );
    });
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
            <div className="davka-work-eyebrow">
              <span className="davka-work-dot" aria-hidden="true" />
              <span>Featured work</span>
            </div>
            <h2 id="work-title" className="davka-work-title">
              Real Projects.
              <span>Real Impact.</span>
            </h2>
          </div>

          <Link href="/work" className="davka-all-projects-link">
            <span>Explore All Work</span>
            <span className="davka-all-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Stacking Cards Container */}
        <div className="davka-work-stack">
          {candidates.map((project, idx) => {
            const img = candidateImage(project.slug, "hero");
            return (
              <article
                key={project.slug}
                data-work-card
                className="davka-project-card"
                style={{
                  "--project-index": idx,
                  zIndex: idx + 1
                } as React.CSSProperties}
              >
                <Link
                  prefetch={false}
                  href={`/work/${project.slug}`}
                  className="davka-project-link"
                >
                  <div className="davka-project-media">
                    <Image
                      src={img.src}
                      alt={`${project.title} — Digital product interface screenshot`}
                      width={img.width}
                      height={img.height}
                      className="davka-project-img"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      priority={idx < 2}
                    />
                    <div className="davka-project-overlay" />
                  </div>

                  <div className="davka-project-meta">
                    <div className="davka-project-top">
                      <span className="davka-project-pill">
                        {project.status === "concept" ? "UI/UX Concept" : "Verified Project"}
                      </span>
                      <span className="davka-project-category">
                        {project.category?.split(" / ")[0] ?? "Digital Product"}
                      </span>
                    </div>

                    <div className="davka-project-center">
                      <h3 className="davka-project-title">{project.title}</h3>
                      <p className="davka-project-summary">{project.summary}</p>
                    </div>

                    <div className="davka-project-bottom">
                      <span className="davka-project-explore">
                        Explore case study <span aria-hidden="true">↗</span>
                      </span>
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
