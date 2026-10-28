"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function ServicesCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    // 1. Entrance timeline for introduction section (activates immediately at top 95%)
    const introSection = root.querySelector<HTMLElement>(".services-intro-section");
    const headingLines = introSection
      ? introSection.querySelectorAll<HTMLElement>("[data-services-heading-line]")
      : root.querySelectorAll<HTMLElement>("[data-services-heading-line]");
    const introElements = root.querySelectorAll<HTMLElement>("[data-services-intro-elem]");

    if (introSection) {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introSection,
          start: "top 95%",
          once: true,
        },
      });

      if (headingLines.length) {
        introTl.fromTo(
          headingLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        );
      }

      if (introElements.length) {
        introTl.fromTo(
          introElements,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          },
          0.15
        );
      }
    }

    // 2. Entrance timeline for dark services container (activates immediately at top 95%)
    const container = root.querySelector<HTMLElement>("[data-services-container]");
    if (container) {
      const containerTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 95%",
          once: true,
        },
      });

      containerTl.fromTo(
        container,
        { y: 35, opacity: 0, scale: 0.99 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
        }
      );

      // Ensure all accordion items and preview card inside are immediately visible
      const previewCard = container.querySelector<HTMLElement>(".services-preview-card");
      if (previewCard) {
        gsap.set(previewCard, { opacity: 1 });
      }
      const accordionItems = container.querySelectorAll<HTMLElement>("[data-accordion-item]");
      accordionItems.forEach((item) => gsap.set(item, { opacity: 1, clearProps: "opacity" }));
    }

    // 3. Entrance timeline for scope section
    const scopeSection = root.querySelector<HTMLElement>(".services-scope-section");
    const scopeLines = scopeSection
      ? scopeSection.querySelectorAll<HTMLElement>("[data-scope-heading-line]")
      : root.querySelectorAll<HTMLElement>("[data-scope-heading-line]");

    if (scopeSection && scopeLines.length) {
      const scopeTl = gsap.timeline({
        scrollTrigger: {
          trigger: scopeSection,
          start: "top 85%",
          once: true,
        },
      });

      scopeTl.fromTo(
        scopeLines,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        },
        0
      );
    }

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      headingLines.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      scopeLines.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      introElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      if (container) {
        container.style.opacity = "1";
        container.style.transform = "none";
      }
    };
    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
    };
  });

  return (
    <div className="services-cinema" ref={ref}>
      {children}
    </div>
  );
}
