"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/davka-process.css";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the idea, the people and the problem."
  },
  {
    number: "02",
    title: "Define",
    description: "Shape a clear direction and agree on what matters."
  },
  {
    number: "03",
    title: "Design",
    description: "Explore the experience, from flow to interface."
  },
  {
    number: "04",
    title: "Develop",
    description: "Bring the product together with considered engineering."
  },
  {
    number: "05",
    title: "Launch",
    description: "Review, refine and prepare the product for its next chapter."
  }
];

export function HomeProcess() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const cards = root.querySelectorAll<HTMLElement>(".davka-process-card");
    const header = root.querySelector<HTMLElement>(".davka-process-left");

    // Smooth card entrance animations as section enters viewport
    gsap.fromTo(
      header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  });

  return (
    <section className="section davka-process-section" id="process" ref={containerRef} aria-labelledby="process-heading">
      <div className="container davka-process-grid">
        {/* Left Column: Sticky Header */}
        <div className="davka-process-left">
          <div className="davka-process-eyebrow">
            <span className="davka-process-dot" aria-hidden="true" />
            <span>Process</span>
          </div>
          <h2 id="process-heading" className="davka-process-title">
            From Idea<br />
            <span>to Impact.</span>
          </h2>
          <p className="davka-process-lead">
            Every step makes the next one clearer. A structured, collaborative path from early vision to a production-ready digital product.
          </p>

          <div className="davka-process-highlights">
            <div className="davka-highlight-item">
              <span className="davka-highlight-val">5 Phases</span>
              <span className="davka-highlight-lbl">Clear, milestone-driven delivery</span>
            </div>
            <div className="davka-highlight-item">
              <span className="davka-highlight-val">End-to-End</span>
              <span className="davka-highlight-lbl">From concept through production</span>
            </div>
          </div>

          <div className="davka-process-cta-wrap">
            <Link href="/contact" className="davka-process-btn">
              <span>Start a Project</span>
              <span className="davka-btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Stacking Process Cards */}
        <div className="davka-process-stack">
          {steps.map((step, idx) => (
            <article
              key={step.number}
              className="davka-process-card"
              style={{
                "--card-index": idx,
                zIndex: idx + 1
              } as React.CSSProperties}
            >
              <div className="davka-card-tab" aria-hidden="true">
                <span className="davka-tab-badge">{step.number}</span>
                <div className="davka-tab-dashes">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="davka-card-content">
                <div className="davka-card-header">
                  <h3 className="davka-card-title">{step.title}</h3>
                  <span className="davka-ghost-number" aria-hidden="true">{step.number}</span>
                </div>
                <p className="davka-card-description">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
