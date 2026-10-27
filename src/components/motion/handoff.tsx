"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function HeroHandoff({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, _ScrollTrigger, root) => {
    const visual = root.querySelector("[data-handoff-visual]");
    if (!visual) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 10%", end: "bottom 80%", scrub: .65, invalidateOnRefresh: true } });
      timeline.to(visual, { y: () => Math.min(innerHeight * .14, 140), xPercent: 8, scale: .83, rotationY: -13, rotationZ: -4, ease: "none" }, 0)
        .fromTo(root.querySelector("[data-handoff-energy]"), { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
    });
    return () => media.revert();
  });
  return <div ref={ref} className="hero-handoff" data-handoff>{children}</div>;
}
