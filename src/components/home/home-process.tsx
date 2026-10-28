"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useGsapScope } from "@/lib/animations/hooks";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/process.css";

const stages = [
  {
    id: "discover",
    name: "Discover",
    tagline: "Understand the idea, the people and the problem.",
    category: "USER RESEARCH & DISCOVERY",
    title: "Start with the right questions."
  },
  {
    id: "define",
    name: "Define",
    tagline: "Shape a clear direction and agree on what matters.",
    category: "ARCHITECTURE & SPECIFICATION",
    title: "A clear, considered direction."
  },
  {
    id: "design",
    name: "Design",
    tagline: "Explore the experience, from flow to interface.",
    category: "FIGMA WORKFLOW & COMPONENT SYSTEM",
    title: "Give the idea an interface."
  },
  {
    id: "develop",
    name: "Develop",
    tagline: "Bring the product together with considered engineering.",
    category: "FULL-STACK IMPLEMENTATION",
    title: "Make the experience real."
  },
  {
    id: "launch",
    name: "Launch",
    tagline: "Review, refine and prepare the product for its next chapter.",
    category: "PRODUCTION RELEASE & TELEMETRY",
    title: "Ready for production."
  }
];

export function HomeProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const scrollToStage = useCallback((idx: number) => {
    const trigger = triggerRef.current;
    if (trigger) {
      const stageCenters = [0.10, 0.30, 0.50, 0.70, 0.90];
      const center = stageCenters[idx] ?? 0.10;
      const targetScroll = trigger.start + center * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    } else {
      setActiveStage(idx);
    }
  }, []);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const steps = root.querySelectorAll<HTMLElement>("[data-process-step]");
    const line = root.querySelector<HTMLElement>(".process-energy-fill");
    const header = root.querySelector<HTMLElement>(".process-section-header");
    const stepList = root.querySelector<HTMLElement>(".process-step-list");
    const panes = root.querySelectorAll<HTMLElement>(".process-pane");
    const footerIndicators = root.querySelectorAll<HTMLElement>(".footer-stage-indicator");

    const titleLines = root.querySelectorAll<HTMLElement>("[data-process-title-line]");
    const lead = root.querySelector<HTMLElement>("[data-process-lead]");

    if (header) {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      if (titleLines.length) {
        headerTl.fromTo(
          titleLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            clearProps: "all",
          },
          0
        );
      }

      if (lead) {
        headerTl.fromTo(
          lead,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            clearProps: "all",
          },
          0.15
        );
      }
    }

    let currentStage = 0;

    const setStage = (index: number) => {
      currentStage = index;
      setActiveStage(index);
      root.dataset.stage = String(index);

      // 1. Highlight authoritative timeline item
      steps.forEach((step, i) => {
        if (i === index) {
          step.classList.add("is-active");
          step.setAttribute("aria-current", "step");
        } else {
          step.classList.remove("is-active");
          step.removeAttribute("aria-current");
        }
      });

      // 2. Active visual pane transition
      panes.forEach((pane, i) => {
        if (i === index) {
          pane.classList.add("is-active");
        } else {
          pane.classList.remove("is-active");
        }
      });

      // 3. Footer stage indicators
      footerIndicators.forEach((ind, i) => {
        if (i === index) {
          ind.classList.add("is-active");
        } else {
          ind.classList.remove("is-active");
        }
      });
    };

    // Ensure Stage 0 is active initially
    setStage(0);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setStage(0);
      if (line) {
        line.style.transform = "scaleY(1)";
      }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (stepList) {
        // ONE Authoritative ScrollTrigger for all 5 stages and progress line
        const processTrigger = ScrollTrigger.create({
          trigger: stepList,
          start: "top 46%",
          end: "bottom 56%",
          onUpdate: (self) => {
            const progress = self.progress;

            // Connect energy line progressively in exact lockstep with scroll
            if (line) {
              line.style.transform = `scaleY(${progress})`;
            }

            // Five equal intervals: [0, 0.2), [0.2, 0.4), [0.4, 0.6), [0.6, 0.8), [0.8, 1.0]
            // with a ±0.015 hysteresis band to eliminate boundary flickering
            const thresholds = [0.20, 0.40, 0.60, 0.80];
            const h = 0.015;
            let target = 0;

            if (progress <= 0) {
              target = 0;
            } else if (progress >= 1) {
              target = 4;
            } else {
              for (let i = 0; i < thresholds.length; i++) {
                const t = thresholds[i] ?? 0;
                const effectiveT = currentStage <= i ? t + h : t - h;
                if (progress >= effectiveT) {
                  target = i + 1;
                }
              }
            }

            if (target !== currentStage) {
              setStage(target);
            }
          },
        });

        triggerRef.current = processTrigger;
      }
    });

    const ensureProcessVisible = () => {
      titleLines.forEach((l) => {
        gsap.set(l, { clearProps: "all" });
        l.style.opacity = "1";
        l.style.transform = "none";
      });
      if (lead) {
        gsap.set(lead, { clearProps: "all" });
        lead.style.opacity = "1";
        lead.style.transform = "none";
      }
    };
    document.addEventListener("visibilitychange", ensureProcessVisible);
    window.addEventListener("focus", ensureProcessVisible);
    window.addEventListener("pageshow", ensureProcessVisible);
    window.addEventListener("motekra-tab-restored", ensureProcessVisible);

    return () => {
      document.removeEventListener("visibilitychange", ensureProcessVisible);
      window.removeEventListener("focus", ensureProcessVisible);
      window.removeEventListener("pageshow", ensureProcessVisible);
      window.removeEventListener("motekra-tab-restored", ensureProcessVisible);
      triggerRef.current = null;
      mm.revert();
    };
  });

  return (
    <section className="section dark home-process" id="process" ref={containerRef} aria-labelledby="process-heading">
      <div className="container">
        {/* Section Header */}
        <div className="process-section-header">
          <div className="process-header-grid">
            <h2 id="process-heading" className="process-title" aria-label="From Idea to Impact.">
              <span className="process-title-mask" aria-hidden="true">
                <span data-process-title-line>From Idea</span>
              </span>
              <span className="process-title-mask" aria-hidden="true">
                <span data-process-title-line>to Impact.</span>
              </span>
            </h2>
            <p className="process-lead" data-process-lead>
              Every step makes the next one clearer. A structured, collaborative path from early vision to a production-ready digital product.
            </p>
          </div>
        </div>

        {/* Two-Column Interactive Storytelling Narrative */}
        <div className="process-narrative" data-stage={activeStage}>
          {/* Left Column: Sticky Large Process Visual */}
          <div className="process-product" aria-hidden="true">
            <div className="process-product-bar">
              <i /><i /><i />
              <span className="process-bar-brand">MOTEKRA / SYSTEM DEVELOPMENT FLOW</span>
            </div>

            <div className="process-visual-steps">
              {/* Stage: Discover (Research board, user needs, brainstorming) */}
              <div className={`process-pane pane-0 ${activeStage === 0 ? "is-active" : ""}`}>
                <div className="pane-header">
                  <span className="pane-tag">DISCOVER · USER RESEARCH</span>
                  <span className="pane-chip">EXPLORATION</span>
                </div>
                <strong className="pane-headline">Start with the right questions.</strong>
                <div className="discovery-board">
                  <div className="discovery-sticky sticky-pain">
                    <span className="sticky-label">USER PAIN POINT</span>
                    <p>Complex multi-step workflows create friction and high bounce rates.</p>
                  </div>
                  <div className="discovery-sticky sticky-need">
                    <span className="sticky-label">BEHAVIORAL NEED</span>
                    <p>Ambitious teams demand instant data synthesis without cognitive overhead.</p>
                  </div>
                  <div className="discovery-sticky sticky-opp">
                    <span className="sticky-label">STRATEGIC OPPORTUNITY</span>
                    <p>A unified contextual workspace delivers 3x faster task completion.</p>
                  </div>
                </div>
                <div className="discovery-pillars">
                  <span>✦ User Personas</span>
                  <span>✦ Friction Mapping</span>
                  <span>✦ Product Validation</span>
                </div>
              </div>

              {/* Stage: Define (Product requirements and project scope) */}
              <div className={`process-pane pane-1 ${activeStage === 1 ? "is-active" : ""}`}>
                <div className="pane-header">
                  <span className="pane-tag">DEFINE · SPECIFICATION</span>
                  <span className="pane-chip">BLUEPRINT</span>
                </div>
                <strong className="pane-headline">A clear, considered direction.</strong>
                <div className="define-matrix">
                  <div className="matrix-row">
                    <span className="matrix-badge p0">P0 CORE</span>
                    <div className="matrix-info">
                      <strong>Architecture Foundation</strong>
                      <span>Next.js 16 + React 19 + GSAP cinematic engine with zero layout shift.</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-badge p0">P0 DATA</span>
                    <div className="matrix-info">
                      <strong>Security &amp; Performance Budget</strong>
                      <span>Sub-15ms edge response, zero client data leakage, 100% accessible.</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-badge p1">P1 SCALE</span>
                    <div className="matrix-info">
                      <strong>Scalable Design Tokens</strong>
                      <span>Tailored HSL palette, dark navy elevation, and kinetic typography.</span>
                    </div>
                  </div>
                </div>
                <div className="define-footer-tags">
                  <span>✦ Scope Matrix</span>
                  <span>✦ System Architecture</span>
                  <span>✦ Milestone Roadmap</span>
                </div>
              </div>

              {/* Stage: Design (Real Figma-style design workflow) */}
              <div className={`process-pane pane-2 ${activeStage === 2 ? "is-active" : ""}`}>
                <div className="pane-header">
                  <span className="pane-tag">DESIGN · FIGMA WORKFLOW</span>
                  <span className="pane-chip">CANVAS</span>
                </div>
                <strong className="pane-headline">Give the idea an interface.</strong>
                <div className="figma-workspace">
                  <div className="figma-toolbar">
                    <span className="figma-tool active">❖ Frame</span>
                    <span className="figma-tool">▭ Shape</span>
                    <span className="figma-tool">✎ Pen</span>
                    <span className="figma-tool">T Text</span>
                    <span className="figma-zoom">100%</span>
                  </div>
                  <div className="figma-canvas">
                    <div className="figma-frame-mock">
                      <div className="frame-top-bar">
                        <span className="frame-dot" /><span className="frame-dot" /><span className="frame-dot" />
                        <span className="frame-title">Hero / Desktop (1440 × 900)</span>
                      </div>
                      <div className="frame-content">
                        <div className="frame-element hero-text-ph" />
                        <div className="frame-element hero-btn-ph" />
                        <div className="frame-element hero-3d-ph">
                          <span className="ph-glow" />
                          <span>3D Canvas</span>
                        </div>
                      </div>
                    </div>
                    <div className="figma-tokens-panel">
                      <span className="token-label">Design Tokens</span>
                      <div className="token-swatch bg-navy"><span>#08152B</span></div>
                      <div className="token-swatch bg-blue"><span>#1688F7</span></div>
                      <div className="token-swatch bg-cyan"><span>#12CDE4</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage: Develop (Code editor and browser application preview) */}
              <div className={`process-pane pane-3 ${activeStage === 3 ? "is-active" : ""}`}>
                <div className="pane-header">
                  <span className="pane-tag">DEVELOP · ENGINEERING</span>
                  <span className="pane-chip">TYPESCRIPT</span>
                </div>
                <strong className="pane-headline">Make the experience real.</strong>
                <div className="ide-workspace">
                  <div className="ide-tab-bar">
                    <span className="ide-tab active">
                      <span className="tab-icon ts">TS</span>
                      <span>DigitalEngine.tsx</span>
                    </span>
                    <span className="ide-tab">
                      <span className="tab-icon css">#</span>
                      <span>motion.css</span>
                    </span>
                  </div>
                  <div className="ide-code-view">
                    <div className="code-lines">
                      <div><span className="line-num">1</span><span className="kw">export</span> <span className="fn">function</span> <span className="comp">DigitalEngine</span>() &#123;</div>
                      <div><span className="line-num">2</span>  <span className="kw">const</span> &#123; <span className="prop">latency</span>, <span className="prop">fps</span> &#125; = <span className="fn">useTelemetry</span>();</div>
                      <div><span className="line-num">3</span>  <span className="kw">return</span> (</div>
                      <div><span className="line-num">4</span>    &lt;<span className="comp">InteractiveScene</span></div>
                      <div><span className="line-num">5</span>      <span className="prop">precision</span>=<span className="str">&quot;high&quot;</span></div>
                      <div><span className="line-num">6</span>      <span className="prop">targetFPS</span>=&#123;60&#125;</div>
                      <div><span className="line-num">7</span>      <span className="prop">responsive</span>=&#123;<span className="kw">true</span>&#125;</div>
                      <div><span className="line-num">8</span>    /&gt;</div>
                      <div><span className="line-num">9</span>  );</div>
                      <div><span className="line-num">10</span>&#125;</div>
                    </div>
                  </div>
                  <div className="ide-status-bar">
                    <span className="ide-status-item">✓ TypeScript: 0 errors</span>
                    <span className="ide-status-item">⚡ Next.js Turbopack: 1.8s</span>
                  </div>
                </div>
              </div>

              {/* Stage: Launch (Deployment dashboard and production release) */}
              <div className={`process-pane pane-4 ${activeStage === 4 ? "is-active" : ""}`}>
                <div className="pane-header">
                  <span className="pane-tag">LAUNCH · PRODUCTION</span>
                  <span className="pane-chip pulse">LIVE</span>
                </div>
                <strong className="pane-headline">Ready for production.</strong>
                <div className="launch-console">
                  <div className="launch-header-status">
                    <span className="status-ping" />
                    <strong>Production Status: Active &amp; Verified</strong>
                  </div>
                  <div className="launch-metrics-grid">
                    <div className="launch-metric-box">
                      <span className="m-label">GLOBAL UPTIME</span>
                      <strong className="m-val highlight">99.98%</strong>
                      <span className="m-sub">SLA guaranteed</span>
                    </div>
                    <div className="launch-metric-box">
                      <span className="m-label">P95 LATENCY</span>
                      <strong className="m-val highlight">&lt; 14ms</strong>
                      <span className="m-sub">Edge globally cached</span>
                    </div>
                    <div className="launch-metric-box">
                      <span className="m-label">BUILD STATUS</span>
                      <strong className="m-val">Passed</strong>
                      <span className="m-sub">0 errors · 23 static pages</span>
                    </div>
                  </div>
                  <div className="launch-checklist">
                    <span className="check-item">✓ SSL A+ Certificate</span>
                    <span className="check-item">✓ SEO Structured Data</span>
                    <span className="check-item">✓ Core Web Vitals Passed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="process-product-footer">
              {stages.map((s, idx) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => scrollToStage(idx)}
                  className={`footer-stage-indicator ${activeStage === idx ? "is-active" : ""}`}
                  aria-label={`Jump to stage ${s.name}`}
                >
                  {s.name.toUpperCase()} {idx < stages.length - 1 ? <span className="arrow">→</span> : null}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Vertical Five-Stage Timeline */}
          <div className="process-step-list" role="region" aria-label="Process Timeline">
            <div className="process-energy" aria-hidden="true">
              <div className="process-energy-fill" />
            </div>

            <ol>
              {stages.map((stage, idx) => {
                const isActive = activeStage === idx;
                return (
                  <li
                    key={stage.id}
                    data-process-step
                    className={`process-timeline-item ${isActive ? "is-active" : ""}`}
                    onClick={() => scrollToStage(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        scrollToStage(idx);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Stage ${idx + 1}: ${stage.name}`}
                  >
                    <span className="step-orb" aria-hidden="true">
                      <span className="step-orb-inner" />
                    </span>

                    <div className="step-content">
                      <span className="step-category">{stage.category}</span>
                      <h3 className="step-title">{stage.name}</h3>
                      <p className="step-description">{stage.tagline}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
