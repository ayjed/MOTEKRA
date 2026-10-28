"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function HomeCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const words = root.querySelectorAll<HTMLElement>(".hero-word");
    const lead = root.querySelector<HTMLElement>(".lead[data-hero-support]");
    const buttons = root.querySelectorAll<HTMLElement>(".button-group[data-hero-support]");
    const capabilities = root.querySelectorAll<HTMLElement>(".hero-capability-item");
    const capabilityDividers = root.querySelectorAll<HTMLElement>(".hero-capability-divider");
    const tags = root.querySelectorAll<HTMLElement>(".capability-tag");
    const nav = document.querySelectorAll<HTMLElement>(".site-header .desktop-nav > a");
    const visual = root.querySelector<HTMLElement>(".hero-product-handoff");
    const hero = root.querySelector<HTMLElement>(".home-hero-cinema");
    const orbit = root.querySelector<HTMLElement>(".hero-orbit");

    // Check if user already scrolled before GSAP initialized or if hero already completed
    const alreadyScrolled = typeof window !== "undefined" && window.scrollY > 40;
    const isHeroDone = typeof window !== "undefined" && (
      (window as unknown as { __motekra_hero_entrance_done?: boolean }).__motekra_hero_entrance_done === true ||
      (window as unknown as { __motekra_preloader_done?: boolean }).__motekra_preloader_done === true ||
      document.body.classList.contains("preloader-finished") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    // =========================================================================
    // TIMELINE 1: HERO ENTRANCE (Plays once, never reversed by scroll)
    // Headline, lead, CTA buttons, floating tags, and capability row entrances.
    // =========================================================================
    let introPlayed = Boolean(isHeroDone);
    const markDone = () => {
      if (typeof window !== "undefined") {
        (window as unknown as { __motekra_hero_entrance_done?: boolean }).__motekra_hero_entrance_done = true;
      }
      words.forEach((w) => {
        gsap.set(w, { clearProps: "all" });
        w.style.opacity = "1";
        w.style.visibility = "visible";
        w.style.transform = "none";
      });
      if (lead) {
        gsap.set(lead, { clearProps: "all" });
        lead.style.opacity = "1";
        lead.style.visibility = "visible";
        lead.style.transform = "none";
      }
      buttons.forEach((b) => {
        gsap.set(b, { clearProps: "all" });
        b.style.opacity = "1";
        b.style.visibility = "visible";
        b.style.transform = "none";
      });
      capabilities.forEach((c) => {
        gsap.set(c, { clearProps: "all" });
        c.style.opacity = "1";
        c.style.visibility = "visible";
        c.style.transform = "none";
      });
      capabilityDividers.forEach((d) => {
        gsap.set(d, { clearProps: "all" });
        d.style.opacity = "1";
        d.style.visibility = "visible";
      });
      tags.forEach((t) => {
        gsap.set(t, { clearProps: "all" });
        t.style.opacity = "1";
        t.style.visibility = "visible";
      });
      if (visual) {
        visual.style.opacity = "1";
      }
    };

    const playIntro = () => {
      if (introPlayed) {
        markDone();
        return;
      }
      introPlayed = true;

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: markDone,
      });

      intro
        .fromTo(words, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.04, clearProps: "all" }, 0)
        .from(nav, { y: -8, opacity: 0.6, duration: 0.45, stagger: 0.04, clearProps: "all" }, 0.06)
        .fromTo(lead, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all" }, 0.2)
        .fromTo(buttons, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.06, ease: "power3.out", clearProps: "all" }, 0.28)
        .fromTo(tags, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, clearProps: "all" }, 0.34)
        .fromTo(capabilities, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, clearProps: "all" }, 0.38)
        .fromTo(capabilityDividers, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.35, stagger: 0.06, clearProps: "all" }, 0.42);
    };

    if (alreadyScrolled || isHeroDone) {
      markDone();
    } else {
      // Full document reload: preloader is running; stage initial hero offset and wait for curtain reveal
      gsap.set(words, { opacity: 0, yPercent: 105 });
      if (lead) gsap.set(lead, { opacity: 0, y: 20 });
      gsap.set(buttons, { opacity: 0, y: 16 });
      gsap.set(tags, { opacity: 0, scale: 0.9 });
      gsap.set(capabilities, { opacity: 0, y: 16 });
      gsap.set(capabilityDividers, { opacity: 0, scaleY: 0 });

      const onPreloaderComplete = () => {
        window.removeEventListener("motekra-preloader-complete", onPreloaderComplete);
        playIntro();
      };

      window.addEventListener("motekra-preloader-complete", onPreloaderComplete, { once: true });
      // Guaranteed safety fallback: never leave hero hidden if event is delayed or interrupted
      const safetyTimer = setTimeout(() => {
        onPreloaderComplete();
      }, 1500);

      // Register cleanup with GSAP context
      ScrollTrigger.addEventListener("refreshInit", () => {
        if (!introPlayed) playIntro();
      });
    }

    // Lifecycle recovery: Ensure returning from inactive tab or BFCache never hides hero text
    const ensureHeroVisible = () => {
      if (introPlayed || isHeroDone || (typeof window !== "undefined" && (window as unknown as { __motekra_hero_entrance_done?: boolean }).__motekra_hero_entrance_done)) {
        markDone();
      }
    };
    document.addEventListener("visibilitychange", ensureHeroVisible);
    window.addEventListener("motekra-tab-restored", ensureHeroVisible);
    window.addEventListener("pageshow", ensureHeroVisible);
    window.addEventListener("focus", ensureHeroVisible);

    // =========================================================================
    // TIMELINE 2: NATURAL SCROLLING (Zero laptop zoom, zero dramatic rotation)
    // Scrolling moves visitors naturally to the next section.
    // =========================================================================
    const desktop = gsap.matchMedia();
    desktop.add("(min-width: 768px)", () => {
      if (visual && hero) {
        gsap.set(visual, { opacity: 1, y: 0, xPercent: 0, scale: 1, rotationY: 0, rotationZ: 0 });
        if (orbit) {
          gsap.to(orbit, {
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
            rotation: 12,
            ease: "none",
          });
        }
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", ensureHeroVisible);
      window.removeEventListener("motekra-tab-restored", ensureHeroVisible);
      window.removeEventListener("pageshow", ensureHeroVisible);
      window.removeEventListener("focus", ensureHeroVisible);
      desktop.revert();
    };
  });

  return <div className="home-cinema" ref={ref} data-home-cinema>{children}</div>;
}
