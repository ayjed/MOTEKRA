"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function ServicesCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    // 1. Entrance timeline for introduction section (activates immediately at top 95%)
    const introSection = root.querySelector<HTMLElement>(".services-intro-section");
    const headingLines = root.querySelectorAll<HTMLElement>("[data-services-heading-line]");
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
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }
        );
      }

      if (introElements.length) {
        introTl.fromTo(
          introElements,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.5"
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
        { y: 45, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.05,
          ease: "power3.out",
          clearProps: "scale",
        }
      );

      const previewCard = container.querySelector<HTMLElement>(".services-preview-card");
      if (previewCard) {
        containerTl.fromTo(
          previewCard,
          { opacity: 0, scale: 0.96, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            clearProps: "scale,opacity",
          },
          "-=0.7"
        );
      }

      const accordionItems = container.querySelectorAll<HTMLElement>("[data-accordion-item]");
      if (accordionItems.length) {
        containerTl.fromTo(
          accordionItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.6"
        );
      }
    }

    return () => {
      // Automatic cleanup handled by gsap.context in useGsapScope
    };
  });

  return (
    <div className="services-cinema" ref={ref}>
      {children}
    </div>
  );
}
