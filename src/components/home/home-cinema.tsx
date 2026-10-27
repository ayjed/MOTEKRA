"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function HomeCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const eyebrow = root.querySelector<HTMLElement>("[data-hero-eyebrow]");
    const words = root.querySelectorAll<HTMLElement>(".hero-word");
    const lead = root.querySelector<HTMLElement>(".lead[data-hero-support]");
    const buttons = root.querySelectorAll<HTMLElement>(".button-group[data-hero-support]");
    const nav = document.querySelectorAll<HTMLElement>(".site-header .desktop-nav > a");
    const visual = root.querySelector<HTMLElement>(".hero-product-handoff");
    const hero = root.querySelector<HTMLElement>(".home-hero-cinema");
    const orbit = root.querySelector<HTMLElement>(".hero-orbit");

    // Check if user already scrolled before GSAP initialized
    const alreadyScrolled = typeof window !== "undefined" && window.scrollY > 40;

    // =========================================================================
    // TIMELINE 1: HERO ENTRANCE (Plays once, never reversed by scroll)
    // Headline, eyebrow, lead, and CTA button entrances.
    // Explicitly avoids mutating .hero-product-handoff transforms to prevent
    // property conflicts with the ScrollTrigger scrub timeline.
    // =========================================================================
    if (alreadyScrolled) {
      // If the visitor already scrolled down before GSAP mounted,
      // keep all hero content at 100% full opacity immediately.
      words.forEach((w) => gsap.set(w, { opacity: 1, y: 0, clearProps: "all" }));
      if (lead) gsap.set(lead, { opacity: 1, y: 0, clearProps: "all" });
      buttons.forEach((b) => gsap.set(b, { opacity: 1, y: 0, clearProps: "all" }));
      if (visual) gsap.set(visual, { opacity: 1 });
    } else {
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Permanently lock all text and CTA elements at 100% opacity
          words.forEach((w) => gsap.set(w, { clearProps: "transform,opacity" }));
          if (lead) gsap.set(lead, { clearProps: "transform,opacity" });
          buttons.forEach((b) => gsap.set(b, { clearProps: "transform,opacity" }));
        },
      });

      intro
        .fromTo(words, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.045, clearProps: "transform,opacity" }, 0)
        .from(nav, { y: -8, opacity: 0.6, duration: 0.45, stagger: 0.04 }, 0.06)
        .fromTo(lead, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, clearProps: "transform,opacity" }, 0.26)
        .fromTo(buttons, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, clearProps: "transform,opacity" }, 0.36);
    }

    // =========================================================================
    // TIMELINE 2: SCROLL-LINKED 3D TRANSITIONS
    // Exclusive ownership of .hero-product-handoff transforms and orbit rotation.
    // Does NOT animate hero copy opacity or hero container opacity.
    // Restores deterministic resting transforms on scrolling back to top.
    // =========================================================================
    const desktop = gsap.matchMedia();
    desktop.add("(min-width: 768px)", () => {
      if (visual && hero) {
        // Ensure visual starts deterministically at full opacity without initial shift
        gsap.set(visual, { opacity: 1 });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 20%",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onLeaveBack: () => {
              // Ensure scrolling upward completely restores the initial visual state
              gsap.set(visual, { y: 0, xPercent: 0, scale: 1, rotationY: 0, rotationZ: 0, opacity: 1 });
              if (orbit) gsap.set(orbit, { rotation: -24, scale: 1 });
            },
          },
        });

        scrollTl
          .to(
            visual,
            {
              y: () => Math.min(innerHeight * 0.22, 180),
              xPercent: -6,
              scale: 0.78,
              rotationY: -14,
              rotationZ: -4,
              ease: "none",
            },
            0
          );

        if (orbit) {
          scrollTl.to(orbit, { rotation: 30, scale: 0.88, ease: "none" }, 0);
        }
      }
    });

    return () => {
      desktop.revert();
    };
  });

  return <div className="home-cinema" ref={ref} data-home-cinema>{children}</div>;
}
