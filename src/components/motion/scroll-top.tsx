"use client";

import { Magnetic } from "./tactile";

export function ScrollTop() {
  return <Magnetic><a href="#top" aria-label="Back to top" onClick={(event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    document.querySelector<HTMLElement>(".site-header .brand")?.focus({ preventScroll: true });
  }}>Back to top ↑</a></Magnetic>;
}
