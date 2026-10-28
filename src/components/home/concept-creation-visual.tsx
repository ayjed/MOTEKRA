"use client";

import { useRef } from "react";
import { useGsapScope } from "@/lib/animations/hooks";
import "@/styles/concept-creation.css";

export function ConceptCreationVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapScope(containerRef, (gsap, ScrollTrigger, root) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // In reduced-motion mode, show elements statically in their final creation state
      const elements = root.querySelectorAll<HTMLElement>(
        ".concept-wireframe-artboard, .creation-product-window, .creation-stagger-item, .creation-trend-curve, .creation-status-badge, .creation-verify-chip"
      );
      gsap.set(elements, { clearProps: "all", opacity: 1, visibility: "visible", transform: "none" });
      const wireframe = root.querySelector<HTMLElement>(".concept-wireframe-artboard");
      if (wireframe) {
        gsap.set(wireframe, { clipPath: "none", opacity: 0.7 });
      }
      const scanLine = root.querySelector<HTMLElement>(".concept-scan-line");
      if (scanLine) {
        gsap.set(scanLine, { display: "none" });
      }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = root.querySelector<HTMLElement>(".concept-creation-stage");
      const wireframe = root.querySelector<HTMLElement>(".concept-wireframe-artboard");
      const scanLine = root.querySelector<HTMLElement>(".concept-scan-line");
      const windowFrame = root.querySelector<HTMLElement>(".creation-product-window");
      const staggerItems = root.querySelectorAll<HTMLElement>(".creation-stagger-item");
      const curve = root.querySelector<SVGPathElement>(".creation-trend-curve");
      const badge = root.querySelector<HTMLElement>(".creation-status-badge");
      const verifyChip = root.querySelector<HTMLElement>(".creation-verify-chip");

      if (!stage) return;

      const contactSection = root.closest<HTMLElement>("#home-contact") || stage;

      // Curve preparation
      const curveLength = curve && curve.getTotalLength ? curve.getTotalLength() : 360;
      if (curve) {
        gsap.set(curve, { strokeDasharray: curveLength, strokeDashoffset: curveLength });
      }

      // Initial visual states
      if (wireframe) {
        gsap.set(wireframe, { clipPath: "inset(0 100% 0 0)", opacity: 0.95 });
      }
      if (scanLine) {
        gsap.set(scanLine, { left: "0%", opacity: 1 });
      }
      if (windowFrame) {
        gsap.set(windowFrame, { opacity: 0, y: 22, scale: 0.97 });
      }
      if (staggerItems.length) {
        gsap.set(staggerItems, { opacity: 0, y: 8 });
      }
      if (badge) {
        gsap.set(badge, { opacity: 0, scale: 0.85 });
      }
      if (verifyChip) {
        gsap.set(verifyChip, { opacity: 0, y: 10, scale: 0.9 });
      }

      // Viewport entrance animation timeline - responds immediately as section enters
      const tl = gsap.timeline({ paused: true });

      // 1. Reveal wireframe through controlled mask with leading scan line
      if (wireframe && scanLine) {
        tl.to(
          wireframe,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.5,
            ease: "power2.inOut",
          },
          0
        ).to(
          scanLine,
          {
            left: "100%",
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(scanLine, { opacity: 0, duration: 0.2 });
            },
          },
          0
        );
      }

      // 2. Finished digital product window assembles into view over the wireframe
      if (windowFrame) {
        tl.to(
          windowFrame,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
          },
          0.2
        );
      }

      // 3. Staggered interface elements assemble into place
      if (staggerItems.length) {
        tl.to(
          staggerItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
          },
          0.38
        );
      }

      // 4. Draw telemetry curve
      if (curve) {
        tl.to(
          curve,
          {
            strokeDashoffset: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          0.48
        );
      }

      // 5. Badge snaps in
      if (badge) {
        tl.to(
          badge,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.8)",
          },
          0.55
        );
      }

      // 6. Floating verification chip settles
      if (verifyChip) {
        tl.to(
          verifyChip,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          0.62
        );
      }

      // 7. Wireframe rest settle
      if (wireframe) {
        tl.to(
          wireframe,
          {
            opacity: 0.75,
            duration: 0.4,
            ease: "power2.out",
          },
          0.68
        );
      }

      // Trigger animation immediately upon viewport entry
      let hasTriggered = false;
      const triggerPlay = () => {
        if (hasTriggered) return;
        hasTriggered = true;
        tl.play();
      };

      const st = ScrollTrigger.create({
        trigger: contactSection,
        start: "top 90%",
        once: true,
        onEnter: triggerPlay,
      });

      let observer: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                triggerPlay();
                if (observer) observer.disconnect();
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(contactSection);
      }

      // Pointer-responsive movement (desktop only, smooth physical depth, no endless drifting)
      let activePointer = false;

      const handlePointerMove = (e: PointerEvent) => {
        if (window.innerWidth < 768) return;
        activePointer = true;
        const rect = stage.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(stage, {
          rotateY: nx * 5,
          rotateX: -ny * 3.5,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (wireframe) {
          gsap.to(wireframe, {
            x: nx * -8,
            y: ny * -6,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const handlePointerLeave = () => {
        if (!activePointer) return;
        activePointer = false;

        gsap.to(stage, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (wireframe) {
          gsap.to(wireframe, {
            x: 0,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      stage.addEventListener("pointermove", handlePointerMove);
      stage.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        if (observer) observer.disconnect();
        st.kill();
        stage.removeEventListener("pointermove", handlePointerMove);
        stage.removeEventListener("pointerleave", handlePointerLeave);
      };
    });

    return () => mm.revert();
  });

  return (
    <div ref={containerRef} className="concept-creation-wrap">
      <div className="concept-creation-stage" aria-label="Concept to Creation digital product interface visual">
        {/* ========================================================
            1. Blueprint / Wireframe Artboard Layer (Behind)
            ======================================================== */}
        <div className="concept-wireframe-artboard" aria-hidden="true">
          <div className="wireframe-grid-pattern" />

          <div className="wireframe-header">
            <div className="wireframe-badge">
              <span className="wireframe-dot" />
              <span>01 CONCEPT // WIREFRAME_SPEC</span>
            </div>
            <div className="wireframe-meta">1440 × 900 • 12-COL GRID</div>
          </div>

          <div className="wireframe-body">
            <div className="wireframe-sidebar">
              <div className="wireframe-bar-short" />
              <div className="wireframe-bar-short" />
              <div className="wireframe-bar-short" />
              <div className="wireframe-bar-short" />
            </div>

            <div className="wireframe-content">
              <div className="wireframe-top-row">
                <div className="wireframe-box-card" />
                <div className="wireframe-box-card" />
                <div className="wireframe-box-card" />
              </div>

              <div className="wireframe-chart-zone">
                <div className="wireframe-chart-axis" />
                <div className="wireframe-dashed-curve" />
              </div>

              <div className="wireframe-row-list">
                <div className="wireframe-line-item" />
                <div className="wireframe-line-item" />
              </div>
            </div>
          </div>

          <span className="blueprint-crosshair top-left">+</span>
          <span className="blueprint-crosshair top-right">+</span>
          <span className="blueprint-crosshair bottom-left">+</span>
          <span className="blueprint-crosshair bottom-right">+</span>

          {/* Controlled mask reveal leading scan line */}
          <div className="concept-scan-line" />
        </div>

        {/* ========================================================
            2. Finished Digital Product Window Layer (Foreground)
            ======================================================== */}
        <div className="creation-product-window">
          {/* macOS / Web App Window Header */}
          <div className="creation-window-header creation-stagger-item">
            <div className="window-traffic-controls" aria-hidden="true">
              <span className="traffic-dot dot-close" />
              <span className="traffic-dot dot-min" />
              <span className="traffic-dot dot-max" />
            </div>

            <div className="window-url-bar">
              <svg
                className="window-lock-icon"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="window-url-text">app.motekra.com/platform</span>
              <span className="window-live-indicator" title="Live status" aria-hidden="true">
                <span className="pulse-ping" />
                <span className="pulse-dot" />
              </span>
            </div>

            <div className="creation-status-badge">
              <span>02 PRODUCTION</span>
            </div>
          </div>

          {/* Window Body & Software Canvas */}
          <div className="creation-window-body">
            {/* Mini Sidebar Navigation */}
            <aside className="creation-sidebar creation-stagger-item" aria-label="Demo platform sidebar">
              <div className="sidebar-brand-icon" aria-hidden="true">
                <span className="brand-dot-m" />
              </div>

              <div className="sidebar-nav-icons" aria-hidden="true">
                <span className="sidebar-nav-item is-active" title="Dashboard">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </span>
                <span className="sidebar-nav-item" title="Telemetry">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </span>
                <span className="sidebar-nav-item" title="Services">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </span>
                <span className="sidebar-nav-item" title="Settings">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
              </div>
            </aside>

            {/* Main Application Canvas */}
            <div className="creation-main-canvas">
              {/* Top KPI Metrics Row */}
              <div className="creation-metrics-grid">
                <div className="creation-kpi-card creation-stagger-item">
                  <span className="kpi-label">API REQUESTS</span>
                  <div className="kpi-val-row">
                    <span className="kpi-number">142.8k</span>
                    <span className="kpi-delta">+18%</span>
                  </div>
                </div>

                <div className="creation-kpi-card creation-stagger-item">
                  <span className="kpi-label">SUCCESS RATE</span>
                  <div className="kpi-val-row">
                    <span className="kpi-number">99.8%</span>
                    <span className="kpi-tag-good">Optimal</span>
                  </div>
                </div>

                <div className="creation-kpi-card creation-stagger-item">
                  <span className="kpi-label">AVG LATENCY</span>
                  <div className="kpi-val-row">
                    <span className="kpi-number">16ms</span>
                    <span className="kpi-dot-live">● SLA</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Chart Panel */}
              <div className="creation-telemetry-panel creation-stagger-item">
                <div className="telemetry-panel-header">
                  <span className="telemetry-title">Telemetry &amp; Active Throughput</span>
                  <span className="telemetry-badge">Real-time Stream</span>
                </div>
                <div className="telemetry-svg-wrap">
                  <svg viewBox="0 0 340 76" className="telemetry-svg" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="telemetryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1688f7" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#1688f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,58 Q45,28 85,42 T170,22 T255,34 T340,12 L340,76 L0,76 Z"
                      fill="url(#telemetryGradient)"
                    />
                    <path
                      className="creation-trend-curve"
                      d="M0,58 Q45,28 85,42 T170,22 T255,34 T340,12"
                      fill="none"
                      stroke="#1688f7"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="340" cy="12" r="3.5" fill="#1688f7" />
                    <circle cx="340" cy="12" r="7" fill="#1688f7" opacity="0.3" className="telemetry-pulse-ring" />
                  </svg>
                </div>
              </div>

              {/* Service Activity Feed */}
              <div className="creation-activity-list creation-stagger-item">
                <div className="activity-item">
                  <span className="activity-method-badge post">POST</span>
                  <span className="activity-route">/v1/auth/tokens</span>
                  <span className="activity-status success">200 OK</span>
                  <span className="activity-time">12ms</span>
                </div>
                <div className="activity-item">
                  <span className="activity-method-badge get">GET</span>
                  <span className="activity-route">/v1/telemetry/live</span>
                  <span className="activity-status success">200 OK</span>
                  <span className="activity-time">8ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Verified Chip */}
          <div className="creation-verify-chip" aria-hidden="true">
            <span className="verify-icon">✓</span>
            <span>Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
