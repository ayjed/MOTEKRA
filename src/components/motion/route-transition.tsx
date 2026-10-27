"use client";

import { usePathname } from "next/navigation";
import { animate } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useMedia } from "@/lib/animations/hooks";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef(pathname);
  const allow = useMedia("(prefers-reduced-motion: no-preference)");
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const element = root.current;
    if (!element) return;
    // Never intercept navigation or defer the new server payload. Next owns
    // scroll/back restoration. Focus without scroll avoids breaking that work.
    if (!location.hash) element.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    const animation = allow ? animate(element, { opacity: [.94, 1], y: [10, 0] }, { duration: .32, ease: [.22, 1, .36, 1] }) : null;
    return () => { animation?.stop(); element.style.removeProperty("transform"); element.style.removeProperty("opacity"); };
  }, [pathname, allow]);
  // Next provides the route live announcement; do not announce the title twice.
  return <div ref={root} className="route-surface">{children}</div>;
}
