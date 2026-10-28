"use client";

import { useState, useRef, useCallback } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

const FAQ_ITEMS = [
  {
    question: "What information do I need to start?",
    answer:
      "A short overview of your product idea, target audience, and the key problem you want to solve. If you have existing design references, wireframes, or platform preferences, feel free to include them in your inquiry.",
  },
  {
    question: "Do I need a complete project brief?",
    answer:
      "Not at all. You can start with an early vision and any open questions you have. We collaborate with you to define project scope, technical architecture, and development milestones.",
  },
  {
    question: "When can I expect a response?",
    answer:
      "We review incoming inquiries promptly. You can expect a thoughtful initial reply within one to two business days to evaluate your requirements and schedule an introductory conversation.",
  },
  {
    question: "Can I share design or project links?",
    answer:
      "Yes. Feel free to include links to Figma files, Notion documents, pitch decks, or GitHub repositories directly within your message.",
  },
];

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));

    // Refresh ScrollTrigger after accordion panel transition completes
    setTimeout(() => {
      if (typeof window !== "undefined") {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }
    }, 420);
  }, []);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // In reduced-motion mode, all elements stay in final static positions
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Kinetic Typography Entrance for the FAQ Heading & Intro
      const titleLines = root.querySelectorAll<HTMLElement>("[data-faq-title-line]");
      const introText = root.querySelector<HTMLElement>("[data-faq-intro]");
      const eyebrow = root.querySelector<HTMLElement>(".contact-faq-sidebar .eyebrow");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0
        );
      }

      if (titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            clearProps: "all",
          },
          0.05
        );
      }

      if (introText) {
        tl.fromTo(
          introText,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, clearProps: "transform,opacity" },
          0.25
        );
      }

      // 2. Controlled Stagger Entrance for FAQ Accordion Items
      const items = root.querySelectorAll<HTMLElement>(".faq-accordion-item");
      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          0.15
        );
      }
    });

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      const eyebrow = root.querySelector<HTMLElement>(".contact-faq-sidebar .eyebrow");
      const titleLines = root.querySelectorAll<HTMLElement>("[data-faq-title-line]");
      const introText = root.querySelector<HTMLElement>("[data-faq-intro]");
      const items = root.querySelectorAll<HTMLElement>(".faq-accordion-item");
      if (eyebrow) { eyebrow.style.opacity = "1"; eyebrow.style.transform = "none"; }
      titleLines.forEach(l => { l.style.opacity = "1"; l.style.transform = "none"; });
      if (introText) { introText.style.opacity = "1"; introText.style.transform = "none"; }
      items.forEach(it => { it.style.opacity = "1"; it.style.transform = "none"; });
    };
    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      mm.revert();
    };
  });

  return (
    <div className="contact-faq-grid" ref={containerRef}>
      {/* Left Column: Scroll-Following Sticky Sidebar with Kinetic Typography */}
      <aside className="contact-faq-sidebar" aria-label="FAQ Overview">
        <h2 id="faq-heading" className="contact-faq-heading">
          <span className="faq-title-mask">
            <span className="faq-title-line" data-faq-title-line>
              Got Questions?
            </span>
          </span>
          <span className="faq-title-mask accent">
            <span className="faq-title-line" data-faq-title-line>
              Start Here.
            </span>
          </span>
        </h2>
        <p className="faq-intro-text" data-faq-intro>
          Common questions about working with MOTEKRA, project scoping, response expectations, and collaboration.
        </p>
      </aside>

      {/* Right Column: Interactive FAQ Accordion */}
      <div className="contact-faq-accordion" role="region" aria-label="Frequently Asked Questions">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          const panelId = `faq-panel-${idx}`;
          const buttonId = `faq-btn-${idx}`;

          return (
            <div
              key={item.question}
              className={`faq-accordion-item ${isOpen ? "is-open" : ""}`}
              data-faq-item={idx}
            >
              {/* Restrained Cyan-Blue Animated Divider Hairline */}
              <div className="faq-hairline-accent" aria-hidden="true" />

              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="faq-accordion-header"
                onClick={() => toggle(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(idx);
                  }
                }}
              >
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-accordion-icon" aria-hidden="true">
                  <span className="faq-icon-line faq-icon-h" />
                  <span className={`faq-icon-line faq-icon-v ${isOpen ? "is-open" : ""}`} />
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="faq-accordion-body"
                aria-hidden={!isOpen}
              >
                <div className="faq-accordion-inner">
                  <p className="faq-answer-text">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
