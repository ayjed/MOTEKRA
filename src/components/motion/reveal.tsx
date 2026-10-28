"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function Reveal({
  children,
  kind = "lines",
  className = "",
}: {
  children: ReactNode;
  kind?: "lines" | "image" | "stagger" | "fade" | "paragraph";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const targets = root.querySelectorAll<HTMLElement>(
      kind === "lines"
        ? "[data-line]"
        : kind === "paragraph"
        ? "[data-paragraph], p"
        : kind === "image"
        ? "[data-image]"
        : kind === "fade"
        ? "[data-fade]"
        : "[data-stagger]"
    );
    if (!targets.length) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => {
        gsap.set(target, { clearProps: "all" });
        target.style.opacity = "1";
        target.style.transform = "none";
      });
      return;
    }

    const animations = gsap.context(() => {}, root);

    // Initial state setup:
    // Pure vertical slide-in from bottom to top; zero rotation; zero horizontal displacement
    const fromVars =
      kind === "lines"
        ? { yPercent: 110, opacity: 0 }
        : kind === "paragraph"
        ? { y: 24, opacity: 0 }
        : kind === "image"
        ? { clipPath: "inset(12% 7% 12% 7% round 24px)", scale: 0.94 }
        : { y: 22, opacity: 0 };

    const toVars =
      kind === "lines"
        ? { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.12, ease: "power3.out" }
        : kind === "paragraph"
        ? { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        : kind === "image"
        ? { clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1, duration: 1.15, ease: "power3.out" }
        : { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" };

    ScrollTrigger.create({
      trigger: root,
      start: "top 90%",
      once: true,
      onEnter: () => {
        animations.add(() =>
          gsap.fromTo(targets, fromVars, {
            ...toVars,
            onComplete: () => {
              targets.forEach((target) => {
                gsap.set(target, { clearProps: "all" });
                target.style.opacity = "1";
                target.style.transform = "none";
                target.style.removeProperty("clip-path");
              });
            },
          })
        );
      },
    });

    // Safety recovery: Never allow text to remain stuck at opacity:0 or offscreen on tab switch / resize
    const ensureVisible = () => {
      targets.forEach((target) => {
        gsap.set(target, { clearProps: "all" });
        target.style.opacity = "1";
        target.style.transform = "none";
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
      animations.revert();
    };
  });

  return (
    <div ref={ref} className={`motion-reveal ${className}`} data-reveal={kind}>
      {children}
    </div>
  );
}

