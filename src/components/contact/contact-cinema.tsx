"use client";
import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function ContactCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const artwork = root.querySelector<HTMLElement>(".contact-artwork");
    const hero = root.querySelector<HTMLElement>(".contact-hero");
    const titleLines = root.querySelectorAll<HTMLElement>("[data-contact-title-line]");
    const words = root.querySelectorAll<HTMLElement>("[data-contact-word]");
    const heroLead = root.querySelector<HTMLElement>("[data-contact-hero-lead]");
    const heroCta = root.querySelector<HTMLElement>("[data-contact-hero-cta]");

    const headingTargets = titleLines.length ? titleLines : words;

    // 1. Hero Headline, Lead, CTA & Artwork Entrance Timeline
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headingTargets.length) {
      introTl.fromTo(
        headingTargets,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.14, duration: 0.95, clearProps: "all" },
        0
      );
    }

    if (heroLead) {
      introTl.fromTo(
        heroLead,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
        0.25
      );
    }

    if (heroCta) {
      introTl.fromTo(
        heroCta,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
        0.38
      );
    }

    if (artwork) {
      introTl.fromTo(
        artwork,
        { rotationY: -16, rotationZ: -4, y: 35, opacity: 0 },
        { rotationY: 0, rotationZ: 0, y: 0, opacity: 1, duration: 1.1, clearProps: "opacity" },
        0.1
      );
    }

    // 2. Desktop Scroll-Linked 3D Rotation
    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      if (hero && artwork) {
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 10%",
            scrub: 0.5,
            onLeaveBack: () => {
              gsap.set(artwork, { y: 0, rotationY: 0, rotationZ: 0, scale: 1 });
            },
          },
        })
          .to(artwork, { y: 80, rotationY: 14, rotationZ: 4, scale: 0.88, ease: "none" }, 0)
          .to(hero, { "--contact-illumination": 1, ease: "none" }, 0);
      }
    });

    // 3. Staggered reveal for contact inquiry panels
    const entries = gsap.context(() => {}, root);
    root.querySelectorAll<HTMLElement>("[data-contact-reveal]").forEach((element) => {
      const inqHeading = element.querySelector<HTMLElement>("[data-inquiry-heading-line]");
      const inqLead = element.querySelector<HTMLElement>("[data-inquiry-lead]");
      const asideHeading = element.querySelectorAll<HTMLElement>("[data-aside-heading-line]");
      const asideLead = element.querySelector<HTMLElement>("[data-aside-lead]");

      ScrollTrigger.create({
        trigger: element,
        start: "top 92%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entries.add(() => {
            gsap.fromTo(
              element,
              { clipPath: "inset(0% 0% 10% 0% round 20px)", y: 24 },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                clearProps: "all",
              }
            );

            if (inqHeading) {
              gsap.fromTo(
                inqHeading,
                { yPercent: 105, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", clearProps: "all" }
              );
            }
            if (inqLead) {
              gsap.fromTo(
                inqLead,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, delay: 0.15, ease: "power3.out", clearProps: "all" }
              );
            }
            if (asideHeading.length) {
              gsap.fromTo(
                asideHeading,
                { yPercent: 105, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out", clearProps: "all" }
              );
            }
            if (asideLead) {
              gsap.fromTo(
                asideLead,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, delay: 0.18, ease: "power3.out", clearProps: "all" }
              );
            }
          }),
      });
    });

    const focus = (event: FocusEvent) => {
      const active = event.type === "focusin";
      entries.add(() =>
        gsap.to(root.querySelector(".inquiry-panel"), {
          "--form-focus": active ? 1 : 0,
          duration: 0.35,
          overwrite: "auto",
        })
      );
    };
    const form = root.querySelector("form");
    form?.addEventListener("focusin", focus as EventListener);
    form?.addEventListener("focusout", focus as EventListener);

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      headingTargets.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
      if (heroLead) {
        heroLead.style.opacity = "1";
        heroLead.style.transform = "none";
      }
      if (heroCta) {
        heroCta.style.opacity = "1";
        heroCta.style.transform = "none";
      }
      if (artwork) {
        artwork.style.opacity = "1";
      }
      root.querySelectorAll<HTMLElement>("[data-contact-reveal]").forEach((element) => {
        element.style.clipPath = "none";
        element.style.opacity = "1";
      });
    };
    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      form?.removeEventListener("focusin", focus as EventListener);
      form?.removeEventListener("focusout", focus as EventListener);
      entries.revert();
      media.revert();
    };
  });

  return <div className="contact-cinema" ref={ref}>{children}</div>;
}
