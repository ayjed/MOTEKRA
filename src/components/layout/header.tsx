"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { ButtonLink } from "../ui/primitives";
import { Navigation } from "./navigation";
import { useGsapScope } from "@/lib/animations/hooks";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Scroll detection for dynamic liquid-glass opacity & contrast response
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cinematic GSAP Entrance Sequence
  useGsapScope(
    headerRef,
    (gsap, _trigger, root) => {
      // Respect reduced motion preference
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const glass = root.querySelector<HTMLElement>(".site-header-glass");
      const logo = root.querySelector<HTMLElement>(".brand");
      const cta = root.querySelector<HTMLElement>(".header-actions");
      const links = root.querySelectorAll<HTMLElement>(".desktop-nav .nav-link");

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          gsap.set([root, glass, logo, cta, links], { clearProps: "all" });
        },
      });

      // 1. Entire floating header drops in smoothly
      tl.fromTo(
        root,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
        0
      );

      // 2. MOTEKRA logo settles into place
      if (logo) {
        tl.fromTo(
          logo,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.45 },
          0.08
        );
      }

      // 3. Navigation links stagger in (on non-home routes; home-cinema coordinates home entrance)
      if (pathname !== "/" && links.length > 0) {
        tl.fromTo(
          links,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
          0.16
        );
      }

      // 4. CTA button reveals last
      if (cta) {
        tl.fromTo(
          cta,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.4 },
          0.26
        );
      }
    },
    true
  );

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-scrolled={isScrolled ? "true" : "false"}
    >
      <div className={`site-header-glass ${isScrolled ? "is-scrolled" : ""}`}>
        <span className="glass-specular-sweep" aria-hidden="true" />
        <Brand />
        <Navigation />
        <div className="header-actions">
          <ButtonLink href="/contact">Start a Project</ButtonLink>
        </div>
      </div>
    </header>
  );
}
