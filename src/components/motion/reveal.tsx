"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function Reveal({ children, kind = "lines", className = "" }: { children: ReactNode; kind?: "lines" | "image" | "stagger"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const targets = root.querySelectorAll<HTMLElement>(kind === "lines" ? "[data-line]" : kind === "image" ? "[data-image]" : "[data-stagger]");
    if (!targets.length) return;
    const animations = gsap.context(() => {}, root);
    ScrollTrigger.create({ trigger: root, start: "top 90%", once: true, onEnter: () => {
      animations.add(() => gsap.fromTo(targets,
        kind === "lines" ? { yPercent: 108, rotation: 2 } : kind === "image" ? { clipPath: "inset(12% 7% 12% 7% round 24px)", scale: .94, rotationY: -8 } : { x: -28, rotationY: -6 },
        { ...(kind === "lines" ? { yPercent: 0, rotation: 0 } : kind === "image" ? { clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1, rotationY: 0 } : { x: 0, rotationY: 0 }),
          duration: kind === "image" ? 1.15 : .85, stagger: .11, ease: "power3.out",
          onComplete: () => targets.forEach((target) => { target.style.removeProperty("transform"); target.style.removeProperty("clip-path"); }),
        }));
    } });
    // Offscreen content stays readable until its own entrance begins. A resize
    // cannot reset a completed heading to a masked start state.
    return () => animations.revert();
  });
  return <div ref={ref} className={`motion-reveal ${className}`} data-reveal={kind}>{children}</div>;
}
