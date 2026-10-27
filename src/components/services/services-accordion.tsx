"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { serviceDetails } from "@/content/services/details";

interface ServicesAccordionProps {
  initialActiveSlug?: string;
}

const SERVICE_IMAGES: Record<string, { src: string; alt: string; tag: string }> = {
  "ui-ux-design": {
    src: "/assets/services/ui-ux-design.jpg",
    alt: "Figma UI/UX design workspace showing product flows, design systems, and wireframes",
    tag: "FIGMA WORKSPACE & DESIGN SYSTEM",
  },
  "web-development": {
    src: "/assets/services/web-development.jpg",
    alt: "Full-stack web application interface and responsive development workstation",
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

export function ServicesAccordion({ initialActiveSlug = "ui-ux-design" }: ServicesAccordionProps) {
  const [activeSlug, setActiveSlug] = useState<string>(initialActiveSlug);
  const previewRef = useRef<HTMLDivElement>(null);
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle subtle 3D tilt tracking for desktop pointer
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({ x: x * 8, y: -y * 8 });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setPointerOffset({ x: 0, y: 0 });
  }, []);

  const handleSelectService = (slug: string) => {
    setActiveSlug(slug);
  };

  const fallbackImage = {
    src: "/assets/services/ui-ux-design.jpg",
    alt: "MOTEKRA Service Visual",
    tag: "CAPABILITY OVERVIEW",
  };

  const activeService = services.find((s) => s.slug === activeSlug) ?? services[0]!;
  const activeImage = SERVICE_IMAGES[activeSlug] ?? fallbackImage;

  return (
    <div className="services-container-shell" data-services-container>
      <div className="services-container-grid">
        {/* Left Column: Interactive Visual Preview (~40% on desktop) */}
        <div className="services-preview-column" aria-hidden="true">
          <div
            className="services-preview-card"
            ref={previewRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{
              transform: `perspective(1000px) rotateY(${pointerOffset.x}deg) rotateX(${pointerOffset.y}deg)`,
            }}
          >
            <div className="services-preview-media-stack">
              {services.map((service) => {
                const img = SERVICE_IMAGES[service.slug] ?? fallbackImage;
                const isActive = service.slug === activeSlug;
                return (
                  <div
                    key={service.slug}
                    className={`services-preview-layer ${isActive ? "is-active" : ""}`}
                    data-preview-slug={service.slug}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1200px) 480px, (min-width: 768px) 40vw, 90vw"
                      className="services-preview-img"
                      priority={service.slug === initialActiveSlug}
                    />
                    <div className="services-preview-glass-glare" />
                    <div className="services-preview-badge">
                      <span className="badge-pulse" />
                      <span className="badge-text">{img.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="services-preview-caption-bar">
              <span className="caption-label">SELECTED CAPABILITY</span>
              <span className="caption-title">{activeService.title}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Vertical Accordion (~60% on desktop) */}
        <div className="services-accordion-column" role="region" aria-label="MOTEKRA Capabilities Accordion">
          <div className="services-accordion-list">
            {services.map((service, index) => {
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
                    onClick={() => handleSelectService(service.slug)}
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
                    hidden={!isActive}
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
                              <div className="services-preview-badge">
                                <span className="badge-pulse" />
                                <span className="badge-text">{mImg.tag}</span>
                              </div>
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
