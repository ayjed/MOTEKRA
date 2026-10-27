"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __motekraMotionDiagnostics?: () => { triggers: number };
  }
}

// Internal-only evaluation surface. This component is mounted exclusively in
// the environment-gated lab and removes its diagnostic handle on unmount.
export function LabDiagnostics() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!cancelled) window.__motekraMotionDiagnostics = () => ({ triggers: ScrollTrigger.getAll().length });
    });
    return () => { cancelled = true; delete window.__motekraMotionDiagnostics; };
  }, []);
  return <div className="lab-diagnostics"><button type="button" className="button button-secondary" onClick={() => setCount(window.__motekraMotionDiagnostics?.().triggers ?? 0)}>Inspect timeline lifecycle</button><output aria-live="polite">{count === null ? "Internal diagnostic · no public analytics" : `${count} owned scroll triggers mounted`}</output></div>;
}
