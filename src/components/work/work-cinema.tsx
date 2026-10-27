"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function WorkCinema({ children, gallery = false }: { children: ReactNode; gallery?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const title = root.querySelectorAll("[data-work-line]");
    if (title.length) gsap.fromTo(title, { yPercent: 108, rotation: 3 }, { yPercent: 0, rotation: 0, duration: .95, stagger: .13, ease: "power4.out", clearProps: "transform" });
    const revealContext = gsap.context(() => {}, root);
    const removeFocusListeners: (() => void)[] = [];
    // Group rows by geometry, not DOM adjacency: cards retain their own entry.
    (gallery ? root.querySelectorAll<HTMLElement>("[data-work-reveal]") : []).forEach((card, index) => {
      let reveal: ReturnType<typeof gsap.fromTo> | undefined;
      const finishForFocus = () => { reveal?.progress(1); };
      card.addEventListener("focusin", finishForFocus);
      removeFocusListeners.push(() => card.removeEventListener("focusin", finishForFocus));
      ScrollTrigger.create({ trigger: card, start: "top 95%", invalidateOnRefresh: true, once: true, onEnter: () => revealContext.add(() => {
        if (!card.contains(document.activeElement)) reveal = gsap.fromTo(card.querySelector(".work-image-mask"), { clipPath: "inset(0 0 100% 0 round 18px)", rotationY: index % 2 ? 5 : -5 }, { clipPath: "inset(0 0 0% 0 round 18px)", rotationY: 0, duration: 1.1, delay: index % 2 * .1, ease: "power3.inOut", clearProps: "clipPath,transform" });
        gsap.fromTo(card.querySelector(".work-card-info"), { x: index % 2 ? 22 : -22 }, { x: 0, duration: .8, delay: .12, ease: "power3.out", clearProps: "transform" });
      }) });
    });
    const desktop = gsap.matchMedia();
    desktop.add("(min-width: 1024px)", () => {
      const strip = root.querySelector(".work-editorial-strip");
      if (strip) gsap.fromTo(strip, { xPercent: 4 }, { xPercent: -4, ease: "none", scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: .55 } });
    });
    return () => { removeFocusListeners.forEach((remove) => remove()); desktop.revert(); revealContext.revert(); };
  });
  return <div className={gallery ? "work-gallery-motion" : "work-cinema"} ref={ref}>{children}</div>;
}

