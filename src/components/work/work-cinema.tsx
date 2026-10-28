"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function WorkCinema({ children, gallery = false }: { children: ReactNode; gallery?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const title = root.querySelectorAll<HTMLElement>("[data-work-line]");
    if (title.length) {
      gsap.fromTo(
        title,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
    }
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
        const cardInfo = card.querySelector<HTMLElement>(".work-card-info");
        if (cardInfo) {
          gsap.fromTo(cardInfo, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, delay: 0.12, ease: "power3.out", clearProps: "all" });
        }
      }) });
    });
    const desktop = gsap.matchMedia();
    desktop.add("(min-width: 1024px)", () => {
      const strip = root.querySelector(".work-editorial-strip");
      if (strip) gsap.fromTo(strip, { xPercent: 4 }, { xPercent: -4, ease: "none", scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: .55 } });
    });
    const ensureVisible = () => {
      title.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>(".work-card-info").forEach((info) => {
        gsap.set(info, { clearProps: "all" });
        info.style.opacity = "1";
        info.style.transform = "none";
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
      removeFocusListeners.forEach((remove) => remove());
      desktop.revert();
      revealContext.revert();
    };
  });
  return <div className={gallery ? "work-gallery-motion" : "work-cinema"} ref={ref}>{children}</div>;
}

