"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { serviceDetails } from "@/content/services/details";
import { useGsapScope } from "@/lib/animations/hooks";

interface ServicesAccordionProps {
  initialActiveSlug?: string | null;
}

const SERVICE_IMAGES: Record<string, { src: string; alt: string; tag?: string }> = {
  "ui-ux-design": {
    src: "/assets/services/ui-ux-design.webp",
    alt: "Responsive laptop and smartphone mockup displaying modern e-commerce dashboard and mobile shopping interface on a clean white background",
    tag: "FIGMA WORKSPACE & DESIGN SYSTEM",
  },
  "web-development": {
    src: "/assets/services/web-development.webp",
    alt: "Responsive laptop and smartphone mockup displaying Nexora website interface and mobile application on a clean white background",
    tag: "NEXT.JS & CLOUD ARCHITECTURE",
  },
  "mobile-app-development": {
    src: "/assets/services/mobile-app-development.jpg",
    alt: "Smartphone mockup displaying mobile application analytics and user transactions",
    tag: "IOS & ANDROID APPLICATION",
  },
  "product-strategy": {
    src: "/assets/services/product-strategy.jpg",
    alt: "Product evolution roadmap, technical architecture flows, and validation checkpoints",
    tag: "ROADMAP & DECISION CHECKPOINTS",
  },
  "brand-visual-design": {
    src: "/assets/services/brand-visual-design.jpg",
    alt: "MOTEKRA brand identity guidelines book, typography specimen, and stationery collateral",
    tag: "BRAND IDENTITY & DESIGN STANDARDS",
  },
};

export function ServicesAccordion({ initialActiveSlug = null }: ServicesAccordionProps) {
  // Nullable active service state:
  // - On initial load, all five services are collapsed (activeSlug is null).
  // - Clicking an open service collapses it to null.
  // - Clicking a collapsed service opens it and closes any previously opened service.
  // - Scrolling never changes the selected service.
  const [activeSlug, setActiveSlug] = useState<string | null>(initialActiveSlug);
  const [lastSelectedSlug, setLastSelectedSlug] = useState<string>(initialActiveSlug ?? "ui-ux-design");
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt tracking for desktop pointer via CSS variables (conflict-free, no re-renders)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty("--tilt-x", `${(x * 5).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--tilt-y", `${(-y * 5).toFixed(2)}deg`);
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
  }, []);

  // Subtle scroll-following parallax and perspective depth within Services container
  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const card = root.querySelector<HTMLElement>(".services-preview-card");
      if (card) {
        gsap.fromTo(
          card,
          { y: -8, rotateX: 1.2 },
          {
            y: 10,
            rotateX: -1.2,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.45,
            },
          }
        );
      }
    });
    return () => mm.revert();
  });

  const handleToggleService = (slug: string) => {
    if (activeSlug === slug) {
      // Independent collapse: clicking the open service collapses it to null
      setActiveSlug(null);
    } else {
      // Opening another service smoothly closes the previously expanded one
      setActiveSlug(slug);
      setLastSelectedSlug(slug);
    }

    // Refresh ScrollTrigger after accordion panel expansion/collapse finishes
    setTimeout(() => {
      if (typeof window !== "undefined") {
        import("gsap/ScrollTrigger")
          .then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          })
          .catch(() => { });
      }
    }, 420);
  };

  const fallbackImage = {
    src: "/assets/services/ui-ux-design.jpg",
    alt: "MOTEKRA Service Visual",
    tag: "CAPABILITY OVERVIEW",
  };

  // Preview displays active service or retains last selected image when collapsed
  const displaySlug = activeSlug ?? lastSelectedSlug;

  return (
    <div className="services-container-shell" data-services-container ref={containerRef}>
      <div className="services-container-grid">
        {/* Left Column: Scroll-following visual preview (sticky within Services container) */}
        <div className="services-preview-column" aria-hidden="true">
          <div
            className="services-preview-card"
            ref={previewRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <div className="services-preview-media-stack">
              {services.map((service) => {
                const img = SERVICE_IMAGES[service.slug] ?? fallbackImage;
                const isLayerActive = service.slug === displaySlug;
                return (
                  <div
                    key={service.slug}
                    className={`services-preview-layer ${isLayerActive ? "is-active" : ""}`}
                    data-preview-slug={service.slug}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1200px) 460px, (min-width: 768px) 40vw, 90vw"
                      className="services-preview-img"
                      priority={service.slug === "ui-ux-design"}
                    />
                    <div className="services-preview-glass-glare" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Vertical Accordion — Click-activated only */}
        <div className="services-accordion-column" role="region" aria-label="MOTEKRA Capabilities Accordion">
          <div className="services-accordion-list">
            {services.map((service) => {
              const isActive = service.slug === activeSlug;
              const details = serviceDetails[service.slug];
              const panelId = `service-panel-${service.slug}`;
              const headingId = `service-button-${service.slug}`;

              return (
                <div
                  key={service.slug}
                  className={`service-accordion-item ${isActive ? "is-expanded" : "is-collapsed"}`}
                  data-accordion-item={service.slug}
                >
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    className="service-accordion-header"
                    onClick={() => handleToggleService(service.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleService(service.slug);
                      }
                    }}
                  >
                    <span className="service-accordion-title" data-accordion-title>
                      {service.title}
                    </span>
                    <span className="service-accordion-icon" aria-hidden="true">
                      <span className="icon-line icon-horizontal" />
                      <span className={`icon-line icon-vertical ${isActive ? "is-active" : ""}`} />
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="service-accordion-panel"
                    aria-hidden={!isActive}
                  >
                    <div className="service-accordion-panel-inner">
                      {/* Mobile Visual Preview shown directly in panel on small viewports */}
                      {(() => {
                        const mImg = SERVICE_IMAGES[service.slug] ?? fallbackImage;
                        return (
                          <div className="service-mobile-preview" aria-hidden="true">
                            <div className="mobile-preview-box">
                              <Image
                                src={mImg.src}
                                alt={mImg.alt}
                                fill
                                sizes="(max-width: 768px) 90vw, 400px"
                                className="mobile-preview-img"
                              />
                            </div>
                          </div>
                        );
                      })()}

                      <p className="service-panel-intent">{details?.intent}</p>
                      <p className="service-panel-description">{service.description}</p>

                      {details?.deliverables && details.deliverables.length > 0 && (
                        <div className="service-deliverables-wrap">
                          <span className="service-deliverables-heading">CORE DELIVERABLES:</span>
                          <ul className="service-deliverables-pills" aria-label={`Deliverables for ${service.title}`}>
                            {details.deliverables.map((item, idx) => (
                              <li key={idx} className="deliverable-pill">
                                <span className="pill-dot" aria-hidden="true">◆</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="service-panel-actions">
                        <Link
                          prefetch={false}
                          href={`/services/${service.slug}`}
                          className="service-panel-link-primary"
                        >
                          <span>Explore {service.title} Scope</span>
                          <span className="link-arrow" aria-hidden="true">↗</span>
                        </Link>

                        <Link
                          prefetch={false}
                          href="/contact"
                          className="service-panel-link-secondary"
                        >
                          <span>Discuss Project</span>
                          <span className="link-arrow" aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
