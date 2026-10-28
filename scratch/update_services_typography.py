# 1. Update services-page.tsx
with open('src/components/services/services-page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '<p className="lead" data-services-intro-elem>',
    '<p className="lead" data-services-hero-lead>'
)
text = text.replace(
    '<div data-services-intro-elem className="services-intro-meta">',
    '<div data-services-hero-meta className="services-intro-meta">'
)
text = text.replace(
    '<div className="services-intro-right" data-services-intro-elem>',
    '<div className="services-intro-right" data-services-hero-callout>'
)

old_scope = '''            <p>
              These capabilities are tailored to each engagement. Deliverables, platforms, timelines, responsibilities and milestones are rigorously aligned before implementation begins.
            </p>
            <Link prefetch={false} href="/contact" className="services-scope-btn">
              Discuss the proposed scope
            </Link>'''

new_scope = '''            <p data-scope-lead>
              These capabilities are tailored to each engagement. Deliverables, platforms, timelines, responsibilities and milestones are rigorously aligned before implementation begins.
            </p>
            <Link prefetch={false} href="/contact" className="services-scope-btn" data-scope-cta>
              Discuss the proposed scope
            </Link>'''

assert old_scope in text, "old_scope not found"
text = text.replace(old_scope, new_scope, 1)

with open('src/components/services/services-page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated services-page.tsx successfully!')

# 2. Update services-cinema.tsx
new_services_cinema = '''"use client";

import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function ServicesCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    // 1. Entrance timeline for introduction section (activates immediately at top 95%)
    const introSection = root.querySelector<HTMLElement>(".services-intro-section");
    const headingLines = introSection
      ? introSection.querySelectorAll<HTMLElement>("[data-services-heading-line]")
      : root.querySelectorAll<HTMLElement>("[data-services-heading-line]");
    const lead = root.querySelector<HTMLElement>("[data-services-hero-lead]");
    const meta = root.querySelector<HTMLElement>("[data-services-hero-meta]");
    const callout = root.querySelector<HTMLElement>("[data-services-hero-callout]");

    if (introSection) {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introSection,
          start: "top 95%",
          once: true,
        },
      });

      if (headingLines.length) {
        introTl.fromTo(
          headingLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        );
      }

      if (lead) {
        introTl.fromTo(
          lead,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
          },
          0.22
        );
      }

      if (meta) {
        introTl.fromTo(
          meta,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "all",
          },
          0.34
        );
      }

      if (callout) {
        introTl.fromTo(
          callout,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
          },
          0.32
        );
      }
    }

    // 2. Entrance timeline for dark services container (activates immediately at top 95%)
    const container = root.querySelector<HTMLElement>("[data-services-container]");
    if (container) {
      const containerTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 95%",
          once: true,
        },
      });

      containerTl.fromTo(
        container,
        { y: 35, opacity: 0, scale: 0.99 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
        }
      );

      // Ensure all accordion items and preview card inside are immediately visible
      const previewCard = container.querySelector<HTMLElement>(".services-preview-card");
      if (previewCard) {
        gsap.set(previewCard, { opacity: 1 });
      }
      const accordionItems = container.querySelectorAll<HTMLElement>("[data-accordion-item]");
      accordionItems.forEach((item) => gsap.set(item, { opacity: 1, clearProps: "opacity" }));
    }

    // 3. Entrance timeline for scope section
    const scopeSection = root.querySelector<HTMLElement>(".services-scope-section");
    const scopeLines = scopeSection
      ? scopeSection.querySelectorAll<HTMLElement>("[data-scope-heading-line]")
      : root.querySelectorAll<HTMLElement>("[data-scope-heading-line]");
    const scopeLead = root.querySelector<HTMLElement>("[data-scope-lead]");
    const scopeCta = root.querySelector<HTMLElement>("[data-scope-cta]");

    if (scopeSection) {
      const scopeTl = gsap.timeline({
        scrollTrigger: {
          trigger: scopeSection,
          start: "top 88%",
          once: true,
        },
      });

      if (scopeLines.length) {
        scopeTl.fromTo(
          scopeLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        );
      }

      if (scopeLead) {
        scopeTl.fromTo(
          scopeLead,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
          },
          0.22
        );
      }

      if (scopeCta) {
        scopeTl.fromTo(
          scopeCta,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "all",
          },
          0.34
        );
      }
    }

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      headingLines.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      scopeLines.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      if (lead) {
        lead.style.opacity = "1";
        lead.style.transform = "none";
      }
      if (meta) {
        meta.style.opacity = "1";
        meta.style.transform = "none";
      }
      if (callout) {
        callout.style.opacity = "1";
        callout.style.transform = "none";
      }
      if (scopeLead) {
        scopeLead.style.opacity = "1";
        scopeLead.style.transform = "none";
      }
      if (scopeCta) {
        scopeCta.style.opacity = "1";
        scopeCta.style.transform = "none";
      }
      if (container) {
        container.style.opacity = "1";
        container.style.transform = "none";
      }
    };
    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
    };
  });

  return (
    <div className="services-cinema" ref={ref}>
      {children}
    </div>
  );
}
'''

with open('src/components/services/services-cinema.tsx', 'w', encoding='utf-8') as f:
    f.write(new_services_cinema)

print('Updated services-cinema.tsx successfully!')

