"use client";
import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function EditorialCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    // 1. Headline masked line entrance (Reference-matched vertical reveal, zero rotation)
    const lines = root.querySelectorAll<HTMLElement>("[data-editorial-line]");
    if (lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
    }

    const entrances = gsap.context(() => {}, root);

    // 2. Founder portrait frame reveal
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

    // 3. Editorial staggered groups (Reference-matched upward glide, zero rotation)
    root.querySelectorAll<HTMLElement>("[data-editorial-stagger]").forEach((group) => {
      ScrollTrigger.create({
        trigger: group,
        start: "top 90%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() =>
            gsap.fromTo(
              group.querySelectorAll("[data-editorial-item]"),
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out", clearProps: "all" }
            )
          ),
      });
    });

    // 4. Biography paragraphs (Subtle upward glide, zero rotation)
    root.querySelectorAll<HTMLElement>(".editorial-bio p").forEach((paragraph) => {
      ScrollTrigger.create({
        trigger: paragraph,
        start: "top 90%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() =>
            gsap.fromTo(
              paragraph.querySelectorAll(".bio-word"),
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.015, ease: "power3.out", clearProps: "all" }
            )
          ),
      });
    });

    // 5. Values section rail
    const values = root.querySelector<HTMLElement>(".editorial-values");
    if (values) {
      const rail = values.querySelector<HTMLElement>("[data-values-rail]");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: values, start: "top 55%", end: "bottom 60%", scrub: 0.4 } }
        );
      }
      gsap.fromTo(
        values,
        { "--value-glow": "0%" },
        { "--value-glow": "100%", ease: "none", scrollTrigger: { trigger: values, start: "top bottom", end: "bottom top", scrub: 0.5 } }
      );
    }

    // 6. Desktop parallax
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
      root.querySelectorAll<HTMLElement>("[data-editorial-line]").forEach((line) => {
        gsap.set(line, { clearProps: "all" });
        line.style.opacity = "1";
        line.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>("[data-editorial-item], .bio-word").forEach((el) => {
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
