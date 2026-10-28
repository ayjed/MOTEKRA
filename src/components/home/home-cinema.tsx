"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function HomeCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const titleLines = root.querySelectorAll<HTMLElement>("[data-hero-title-line]");
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

    const headingTargets = titleLines.length ? titleLines : words;

    // Check if user already scrolled before GSAP initialized or reduced motion
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyScrolled = typeof window !== "undefined" && window.scrollY > 40;
    const isPreloaderActive = typeof window !== "undefined" && (
      window.__motekra_preloader_active === true ||
      document.body.classList.contains("preloader-active")
    );

    // =========================================================================
    // TIMELINE 1: HERO ENTRANCE (Plays once, never reversed by scroll)
    // Coordinated sequence: Headline -> Paragraph (overlap) -> Buttons -> Capabilities
    // =========================================================================
    let introPlayed = false;

    const markDone = () => {
      introPlayed = true;
      if (typeof window !== "undefined") {
        (window as unknown as { __motekra_hero_entrance_done?: boolean }).__motekra_hero_entrance_done = true;
      }
      headingTargets.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.transform = "none";
      });
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
        // 1. Headline line-by-line masked reveal (Davka-inspired, 0.95s, stagger: 0.14s)
        .fromTo(
          headingTargets,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        )
        // Header navigation subtle entrance
        .from(nav, { y: -8, opacity: 0.6, duration: 0.45, stagger: 0.04, clearProps: "all" }, 0.06)
        // 2. Supporting Paragraph follows with short overlap (starts at 0.28s)
        .fromTo(
          lead,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
          },
          0.28
        )
        // 3. CTA Buttons enter right after paragraph (starts at 0.42s)
        .fromTo(
          buttons,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          },
          0.42
        )
        // 4. Capability row enters seamlessly
        .fromTo(
          capabilities,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          },
          0.52
        )
        .fromTo(
          capabilityDividers,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "all",
          },
          0.58
        )
        // 5. Floating tags
        .fromTo(
          tags,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            clearProps: "all",
          },
          0.54
        );
    };

    if (isReduced || alreadyScrolled) {
      markDone();
    } else if (isPreloaderActive) {
      // Full document reload with active preloader: stage initial hidden states and wait for curtain reveal
      gsap.set(headingTargets, { opacity: 0, yPercent: 110 });
      if (lead) gsap.set(lead, { opacity: 0, y: 24 });
      gsap.set(buttons, { opacity: 0, y: 18 });
      gsap.set(tags, { opacity: 0, scale: 0.9 });
      gsap.set(capabilities, { opacity: 0, y: 16 });
      gsap.set(capabilityDividers, { opacity: 0, scaleY: 0 });

      const onPreloaderComplete = () => {
        window.removeEventListener("motekra-preloader-complete", onPreloaderComplete);
        playIntro();
      };

      window.addEventListener("motekra-preloader-complete", onPreloaderComplete, { once: true });
      // Guaranteed safety fallback: never leave hero hidden if event is delayed or interrupted
      setTimeout(() => {
        onPreloaderComplete();
      }, 1600);

      // Register cleanup with GSAP context
      ScrollTrigger.addEventListener("refreshInit", () => {
        if (!introPlayed) playIntro();
      });
    } else {
      // Direct visit or client-side navigation: play immediately!
      playIntro();
    }

        // Services section supporting intro animation on scroll
    const servicesSection = root.querySelector<HTMLElement>(".home-services");
    const servicesIntro = root.querySelector<HTMLElement>("[data-services-intro-support]");
    const servicesCta = root.querySelector<HTMLElement>("[data-services-cta-support]");
    if (servicesSection && (servicesIntro || servicesCta)) {
      ScrollTrigger.create({
        trigger: servicesSection,
        start: "top 88%",
        once: true,
        onEnter: () => {
          if (servicesIntro) {
            gsap.fromTo(
              servicesIntro,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: 0.22, ease: "power3.out", clearProps: "all" }
            );
          }
          if (servicesCta) {
            gsap.fromTo(
              servicesCta,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: "power3.out", clearProps: "all" }
            );
          }
        },
      });
    }

    // Lifecycle recovery: Ensure returning from inactive tab or BFCache never hides hero text
    const ensureHeroVisible = () => {
      markDone();
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
