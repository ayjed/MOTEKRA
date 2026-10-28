"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/models";
import { caseStudies } from "@/content/projects/case-studies";
import { JsonLd } from "@/components/seo/json-ld";
import { projectSchema } from "@/lib/seo/schema";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/case-study.css";

const PROJECT_ORDER = [
  "spotlight-contest",
  "lad-global-travels",
  "tog-africa",
  "connectapi",
] as const;

export function ProjectDetail({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const study = caseStudies[project.slug] ?? {
    slug: project.slug,
    title: project.title,
    category: project.category ?? "Digital Product",
    badge: project.category ?? "Digital Product",
    type: "Platform Experience",
    focus: "Product Design & Architecture",
    lead: project.summary ?? "A modern digital product experience.",
    overview: project.summary ?? "A modern digital product experience.",
    capabilitiesTitle: "Key Capabilities",
    capabilities: [],
    heroImage: {
      src: `/assets/work/${project.slug}-hero.webp`,
      width: 1400,
      height: 800,
      alt: `${project.title} interface showcase`,
      caption: `${project.title} platform overview.`,
      bg: "#08152b",
    },
    detailImage: {
      src: `/assets/work/${project.slug}-detail.webp`,
      width: 1400,
      height: 800,
      alt: `${project.title} interface detail`,
      caption: `${project.title} interface details.`,
      bg: "#08152b",
    },
    galleryHeading: "Interface Exploration",
    galleryDescription: "Exploring the interaction details and layout structure.",
  };

  const currentIndex = PROJECT_ORDER.indexOf(project.slug as typeof PROJECT_ORDER[number]);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextSlug = PROJECT_ORDER[(safeIndex + 1) % PROJECT_ORDER.length] as string;
  const nextStudy = caseStudies[nextSlug];

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // In reduced-motion mode, all elements remain statically visible
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Hero Title Slide-in
      const heroTitle = root.querySelector<HTMLElement>("[data-case-title-line]");
      if (heroTitle) {
        gsap.fromTo(
          heroTitle,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
        );
      }

      // 2. Headings on Scroll
      const animatedHeadings = root.querySelectorAll<HTMLElement>("[data-case-heading]");
      animatedHeadings.forEach((heading) => {
        const line = heading.querySelector<HTMLElement>("[data-case-heading-line]");
        if (line) {
          gsap.fromTo(
            line,
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: heading,
                start: "top 88%",
                once: true,
              },
            }
          );
        }
      });
    });

    // Tab restoration safeguards
    const ensureVisible = () => {
      root.querySelectorAll<HTMLElement>("[data-case-title-line], [data-case-heading-line]").forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.transform = "none";
      });
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
    };
  });

  return (
    <article className="case-study-page" ref={containerRef}>
      <JsonLd data={projectSchema(project)} />

      {/* SECTION ONE — PROJECT HERO */}
      <header className="case-hero-section">
        <div className="container">
          <div className="case-hero-inner">
            <nav className="case-breadcrumb-nav" aria-label="Breadcrumbs">
              <Link href="/" className="case-breadcrumb-link">
                Home
              </Link>
              <span className="case-breadcrumb-sep" aria-hidden="true">
                /
              </span>
              <Link href="/work" className="case-breadcrumb-link">
                Work
              </Link>
              <span className="case-breadcrumb-sep" aria-hidden="true">
                /
              </span>
              <span className="case-breadcrumb-current" aria-current="page">
                {study.title}
              </span>
            </nav>

            <span className="case-category-badge">{study.badge}</span>

            <div className="case-hero-title-mask">
              <h1 className="case-hero-title">
                <span data-case-title-line style={{ display: "inline-block" }}>
                  {study.title}
                </span>
              </h1>
            </div>

            <p className="case-hero-lead">{study.lead}</p>

            <div className="case-meta-bar" role="list">
              <div className="case-meta-item" role="listitem">
                <span className="case-meta-label">Category</span>
                <span className="case-meta-value">{study.category}</span>
              </div>
              <div className="case-meta-item" role="listitem">
                <span className="case-meta-label">Focus</span>
                <span className="case-meta-value">{study.focus}</span>
              </div>
              <div className="case-meta-item" role="listitem">
                <span className="case-meta-label">Discipline</span>
                <span className="case-meta-value">{study.type}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION TWO — FULL-WIDTH PRIMARY SHOWCASE */}
      <section className="case-showcase-section" aria-label={`${study.title} Primary Showcase`}>
        <div className="container">
          <div
            className="case-showcase-frame"
            style={{ backgroundColor: study.heroImage.bg }}
          >
            <Image
              src={study.heroImage.src}
              width={study.heroImage.width}
              height={study.heroImage.height}
              alt={study.heroImage.alt}
              className="case-showcase-img"
              priority
              sizes="(max-width: 1400px) 100vw, 1360px"
            />
          </div>
          <figcaption className="case-image-caption">
            {study.heroImage.caption}
          </figcaption>
        </div>
      </section>

      {/* SECTION THREE — PROJECT OVERVIEW */}
      <section className="case-overview-section" aria-label="Project Overview">
        <div className="container">
          <div className="case-overview-grid">
            <div className="case-overview-context">
              <span className="case-section-eyebrow">Overview</span>
              <div className="case-hero-title-mask" data-case-heading>
                <h2 className="case-section-heading">
                  <span data-case-heading-line style={{ display: "inline-block" }}>
                    About the Project
                  </span>
                </h2>
              </div>
              <p className="case-overview-body">{study.overview}</p>

              {study.scopeNote && (
                <div className="case-scope-note" role="note">
                  <strong>Concept Notice</strong>
                  <span>{study.scopeNote}</span>
                </div>
              )}
            </div>

            <div className="case-capabilities-wrap">
              <h3 className="case-capabilities-title">{study.capabilitiesTitle}</h3>
              <div className="case-capabilities-grid">
                {study.capabilities.map((item, idx) => (
                  <div key={idx} className="case-capability-card">
                    <div className="case-capability-icon" aria-hidden="true">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <h4 className="case-capability-title">{item.title}</h4>
                    <p className="case-capability-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FOUR — VISUAL PROJECT GALLERY */}
      {study.detailImage && (
        <section className="case-gallery-section" aria-label="Interface Detail">
          <div className="container">
            <div className="case-gallery-header">
              <span className="case-section-eyebrow">Interface Exploration</span>
              <div className="case-hero-title-mask" data-case-heading>
                <h2 className="case-section-heading">
                  <span data-case-heading-line style={{ display: "inline-block" }}>
                    {study.galleryHeading}
                  </span>
                </h2>
              </div>
              <p className="case-gallery-desc">{study.galleryDescription}</p>
            </div>

            <div
              className="case-gallery-frame"
              style={{ backgroundColor: study.detailImage.bg }}
            >
              <Image
                src={study.detailImage.src}
                width={study.detailImage.width}
                height={study.detailImage.height}
                alt={study.detailImage.alt}
                className="case-gallery-img"
                loading="lazy"
                sizes="(max-width: 1400px) 100vw, 1360px"
              />
            </div>
            <figcaption className="case-image-caption">
              {study.detailImage.caption}
            </figcaption>
          </div>
        </section>
      )}

      {/* SECTION FIVE — PROJECT ACTION */}
      <section className="case-action-section" aria-label="Project Actions">
        <div className="container">
          <div className="case-action-card">
            <span className="case-section-eyebrow">Start What&apos;s Next</span>
            <h2 className="case-action-heading">Have Something in Mind?</h2>
            <p className="case-action-text">
              We design and develop high-performance digital products, web platforms, and brand experiences. Let&apos;s build something extraordinary together.
            </p>
            <div className="case-action-buttons">
              <Link href="/contact" className="case-btn-primary">
                <span>Discuss Your Project</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/work" className="case-btn-secondary">
                <span>Explore All Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION SIX — NEXT PROJECT */}
      {nextStudy && (
        <section className="case-next-section" aria-label="Next Project">
          <div className="container">
            <Link
              href={`/work/${nextStudy.slug}`}
              className="case-next-link"
              prefetch={false}
            >
              <span className="case-next-eyebrow">
                <span>Next Project</span>
                <span aria-hidden="true">→</span>
              </span>
              <div className="case-next-row">
                <h2 className="case-next-title">{nextStudy.title}</h2>
                <div className="case-next-arrow-circle" aria-hidden="true">
                  <span>→</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
