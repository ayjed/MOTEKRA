"use client";
import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function EditorialCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const entrances = gsap.context(() => {}, root);

    // 1. Hero Entrance Timeline (Headline -> Supporting Lead -> CTA)
    const heroSection = root.querySelector<HTMLElement>(".editorial-hero");
    const lines = root.querySelectorAll<HTMLElement>("[data-editorial-line]");
    const heroLead = root.querySelector<HTMLElement>("[data-editorial-lead]");
    const heroCta = root.querySelector<HTMLElement>("[data-editorial-cta]");

    if (heroSection) {
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top 95%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      if (lines.length) {
        heroTl.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.14, clearProps: "all" },
          0
        );
      }

      if (heroLead) {
        heroTl.fromTo(
          heroLead,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
          0.25
        );
      }

      if (heroCta) {
        heroTl.fromTo(
          heroCta,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
          0.38
        );
      }
    }

    // 2. Section 2 Perspective Entrance Timeline
    const perspSection = root.querySelector<HTMLElement>(".editorial-perspective");
    const perspLines = root.querySelectorAll<HTMLElement>("[data-perspective-heading-line]");
    const perspItems = root.querySelectorAll<HTMLElement>("[data-editorial-item]");

    if (perspSection) {
      ScrollTrigger.create({
        trigger: perspSection,
        start: "top 88%",
        once: true,
        onEnter: () =>
          entrances.add(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            if (perspLines.length) {
              tl.fromTo(
                perspLines,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.12, clearProps: "all" },
                0
              );
            }
            if (perspItems.length) {
              tl.fromTo(
                perspItems,
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, clearProps: "all" },
                0.22
              );
            }
          }),
      });
    }

    // 3. Section 3 Founder Entrance Timeline
    const founderSection = root.querySelector<HTMLElement>(".editorial-founder");
    const founderHeading = root.querySelector<HTMLElement>("[data-founder-heading-line]");
    const founderRole = root.querySelector<HTMLElement>("[data-founder-role]");
    const founderBio = root.querySelector<HTMLElement>("[data-founder-bio]");
    const founderCta = root.querySelector<HTMLElement>("[data-founder-cta]");

    if (founderSection) {
      ScrollTrigger.create({
        trigger: founderSection,
        start: "top 88%",
        once: true,
        onEnter: () =>
          entrances.add(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            if (founderHeading) {
              tl.fromTo(
                founderHeading,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.9, clearProps: "all" },
                0
              );
            }
            if (founderRole) {
              tl.fromTo(
                founderRole,
                { y: 16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
                0.18
              );
            }
            if (founderBio) {
              tl.fromTo(
                founderBio,
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
                0.26
              );
            }
            if (founderCta) {
              tl.fromTo(
                founderCta,
                { y: 16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
                0.36
              );
            }
          }),
      });
    }

    // 4. Section 4 Values Entrance
    const values = root.querySelector<HTMLElement>(".editorial-values");
    const valuesLines = root.querySelectorAll<HTMLElement>("[data-values-heading-line]");
    if (values) {
      ScrollTrigger.create({
        trigger: values,
        start: "top 88%",
        once: true,
        onEnter: () =>
          entrances.add(() => {
            if (valuesLines.length) {
              gsap.fromTo(
                valuesLines,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.14, ease: "power3.out", clearProps: "all" }
              );
            }
          }),
      });

      const rail = values.querySelector<HTMLElement>("[data-values-rail]");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: values, start: "top 55%", end: "bottom 60%", scrub: 0.4 } }
        );
      }
    }

    // 5. Section 5 Principles Entrance
    const principlesSection = root.querySelector<HTMLElement>(".editorial-principles");
    const principlesLines = root.querySelectorAll<HTMLElement>("[data-principles-heading-line]");
    if (principlesSection) {
      ScrollTrigger.create({
        trigger: principlesSection,
        start: "top 90%",
        once: true,
        onEnter: () =>
          entrances.add(() => {
            if (principlesLines.length) {
              gsap.fromTo(
                principlesLines,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.14, ease: "power3.out", clearProps: "all" }
              );
            }
          }),
      });
    }

    // 6. Founder portrait frame reveal
    root.querySelectorAll<HTMLElement>("[data-portrait]").forEach((portrait) => {
      const frame = portrait.querySelector<HTMLElement>("[data-portrait-frame]");
      const img = portrait.querySelector<HTMLElement>(".founder-photo-real, img");
      const captions = portrait.querySelectorAll<HTMLElement>(".portrait-caption > span");

      ScrollTrigger.create({
        trigger: portrait,
        start: "top 95%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
            if (frame) {
              timeline.fromTo(
                frame,
                { clipPath: "inset(0% 0% 12% 0% round 20px)" },
                { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.1, clearProps: "all" },
                0
              );
            }
            if (img) {
              timeline.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.3, clearProps: "all" }, 0);
            }
            if (captions.length) {
              timeline.fromTo(captions, { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.1, clearProps: "all" }, 0.4);
            }
          }),
      });
    });

    // 7. Desktop parallax
    const desktop = gsap.matchMedia();
    desktop.add("(min-width: 768px)", () => {
      root.querySelectorAll<HTMLElement>("[data-portrait]").forEach((portrait) => {
        const plane = portrait.querySelector<HTMLElement>("[data-portrait-plane]");
        if (plane) {
          gsap.fromTo(
            plane,
            { yPercent: -3 },
            { yPercent: 3, ease: "none", scrollTrigger: { trigger: portrait, start: "top bottom", end: "bottom top", scrub: 0.6 } }
          );
        }
      });

      root.querySelectorAll<HTMLElement>("[data-interface-depth]").forEach((visual) =>
        gsap.fromTo(
          visual,
          { rotationY: -10, rotationX: 6, y: 25 },
          { rotationY: 0, rotationX: 0, y: 0, ease: "none", scrollTrigger: { trigger: visual, start: "top 90%", end: "top 25%", scrub: 0.6 } }
        )
      );
    });

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      root.querySelectorAll<HTMLElement>("[data-editorial-line], [data-perspective-heading-line], [data-founder-heading-line], [data-values-heading-line], [data-principles-heading-line]").forEach((line) => {
        gsap.set(line, { clearProps: "all" });
        line.style.opacity = "1";
        line.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>("[data-editorial-lead], [data-editorial-cta], [data-founder-role], [data-founder-bio], [data-founder-cta], [data-editorial-item]").forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>("[data-portrait-frame]").forEach((frame) => {
        frame.style.clipPath = "none";
      });
      root.querySelectorAll<HTMLElement>(".portrait-caption > span").forEach((caption) => {
        caption.style.opacity = "1";
        caption.style.transform = "none";
      });
    };
    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      desktop.revert();
      entrances.revert();
    };
  });
  return <div className="editorial-cinema" ref={ref}>{children}</div>;
}
