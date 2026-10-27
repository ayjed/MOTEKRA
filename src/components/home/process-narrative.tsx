"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function ProcessNarrative({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const steps = root.querySelectorAll<HTMLElement>("[data-process-step]");
    const line = root.querySelector(".process-energy-fill");
    const setStage = (index: number) => {
      root.dataset.stage = String(index);
      steps.forEach((step, i) => { if (i === index) step.setAttribute("aria-current", "step"); else step.removeAttribute("aria-current"); });
    };
    setStage(0);
    steps.forEach((step, index) => {
      ScrollTrigger.create({ trigger: step, start: "top 78%", end: "bottom 64%", onEnter: () => setStage(index), onEnterBack: () => setStage(index) });
    });
    gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 72%", scrub: .35 } });
    return () => { delete root.dataset.stage; steps.forEach((step) => step.removeAttribute("aria-current")); };
  });
  return <div className="process-narrative" ref={ref} data-stage="0">{children}</div>;
}
