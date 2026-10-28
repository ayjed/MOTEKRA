"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import "@/styles/preloader.css";

// Declare module/window-level execution tracker for client-side navigation persistence
declare global {
  interface Window {
    __motekra_preloader_done?: boolean;
    __motekra_preloader_active?: boolean;
  }
}

export function CinematicPreloader() {
  // Start with true on initial document load so SSR HTML renders the dark navy stage immediately
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window !== "undefined") {
      // If already executed during this document session or reduced motion, skip rendering
      if (window.__motekra_preloader_done || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }
    }
    return true;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const solidMarkRef = useRef<HTMLDivElement>(null);
  const pieceCenterRef = useRef<HTMLDivElement>(null);
  const pieceTLRef = useRef<HTMLDivElement>(null);
  const pieceBLRef = useRef<HTMLDivElement>(null);
  const pieceTRRef = useRef<HTMLDivElement>(null);
  const pieceBRRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Proactively clear any legacy sessionStorage or localStorage flags from previous versions
    try {
      sessionStorage.removeItem("motekra_preloader_seen");
      localStorage.removeItem("motekra_preloader_seen");
    } catch {
      // Storage access may be restricted in sandboxed iframes or private modes
    }

    // Respect reduced-motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || window.__motekra_preloader_done) {
      window.__motekra_preloader_done = true;
      document.body.classList.remove("preloader-active");
      document.body.classList.add("preloader-finished");
      window.dispatchEvent(new CustomEvent("motekra-preloader-complete"));
      setShouldRender(false);
      return;
    }

    window.__motekra_preloader_active = true;
    document.body.classList.add("preloader-active");

    const ctx = gsap.context(() => {
      if (!containerRef.current || !lockupRef.current || !solidMarkRef.current) return;

      const notifyPageReady = () => {
        window.dispatchEvent(new CustomEvent("motekra-preloader-complete"));
      };

      const finishPreloader = () => {
        window.__motekra_preloader_active = false;
        window.__motekra_preloader_done = true;
        document.body.classList.remove("preloader-active");
        document.body.classList.add("preloader-finished");
        notifyPageReady();
      };

      const tl = gsap.timeline({
        onComplete: () => {
          finishPreloader();
          setShouldRender(false);
        },
      });

      // Initial resting / entry states for authentic digital assembly
      gsap.set(solidMarkRef.current, { opacity: 0, scale: 0.96 });
      if (pieceCenterRef.current) gsap.set(pieceCenterRef.current, { y: -18, opacity: 0, scale: 0.85 });
      if (pieceTLRef.current) gsap.set(pieceTLRef.current, { x: -24, y: -20, opacity: 0, scale: 0.82 });
      if (pieceBLRef.current) gsap.set(pieceBLRef.current, { x: -24, y: 20, opacity: 0, scale: 0.82 });
      if (pieceTRRef.current) gsap.set(pieceTRRef.current, { x: 24, y: -20, opacity: 0, scale: 0.82 });
      if (pieceBRRef.current) gsap.set(pieceBRRef.current, { x: 24, y: 20, opacity: 0, scale: 0.82 });
      if (maskRef.current) gsap.set(maskRef.current, { clipPath: "inset(0 100% 0 0)" });
      if (textRef.current) gsap.set(textRef.current, { x: -20, opacity: 0 });
      if (scanLineRef.current) gsap.set(scanLineRef.current, { left: "0%", opacity: 0 });

      // -----------------------------------------------------------------------
      // STAGE 1: DIGITAL ASSEMBLY OF GEOMETRIC COMPONENTS
      // -----------------------------------------------------------------------
      // Core Center stem drops in first
      if (pieceCenterRef.current) {
        tl.to(
          pieceCenterRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.44,
            ease: "power3.out",
          },
          0.08
        );
      }

      // Left nodes converge inward
      if (pieceTLRef.current) {
        tl.to(
          pieceTLRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.52,
            ease: "back.out(1.5)",
          },
          0.16
        );
      }

      if (pieceBLRef.current) {
        tl.to(
          pieceBLRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.52,
            ease: "back.out(1.5)",
          },
          0.22
        );
      }

      // Right nodes converge inward
      if (pieceTRRef.current) {
        tl.to(
          pieceTRRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.52,
            ease: "back.out(1.5)",
          },
          0.28
        );
      }

      if (pieceBRRef.current) {
        tl.to(
          pieceBRRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.52,
            ease: "back.out(1.5)",
          },
          0.34
        );
      }

      // -----------------------------------------------------------------------
      // STAGE 2: SNAP & LOCK (Master solid mark takes over seamlessly)
      // -----------------------------------------------------------------------
      tl.to(
        solidMarkRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.inOut",
        },
        0.86
      );

      const assemblyPieces = [
        pieceCenterRef.current,
        pieceTLRef.current,
        pieceBLRef.current,
        pieceTRRef.current,
        pieceBRRef.current,
      ].filter(Boolean);

      if (assemblyPieces.length > 0) {
        tl.to(
          assemblyPieces,
          {
            opacity: 0,
            duration: 0.16,
            ease: "power2.inOut",
          },
          0.88
        );
      }

      // Refined cyan energy pulse locking into rest position
      tl.fromTo(
        solidMarkRef.current,
        { filter: "drop-shadow(0 0 28px rgba(18, 205, 228, 0.8))" },
        {
          filter: "drop-shadow(0 4px 18px rgba(22, 136, 247, 0.35))",
          duration: 0.45,
          ease: "power2.out",
        },
        0.86
      );

      // -----------------------------------------------------------------------
      // STAGE 3: HORIZONTAL WORDMARK REVEAL
      // Reveals through horizontal mask as the symbol begins assembling
      // -----------------------------------------------------------------------
      if (scanLineRef.current) {
        tl.set(scanLineRef.current, { opacity: 1 }, 0.45);
        tl.to(
          scanLineRef.current,
          {
            left: "100%",
            duration: 0.7,
            ease: "power3.out",
          },
          0.45
        );
        tl.to(
          scanLineRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power1.out",
          },
          1.15
        );
      }

      if (maskRef.current) {
        tl.to(
          maskRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.7,
            ease: "power3.out",
          },
          0.45
        );
      }

      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
          },
          0.45
        );
      }

      // -----------------------------------------------------------------------
      // STAGE 4: BRIEF COMPOSITION HOLD (Forming one polished composition)
      // -----------------------------------------------------------------------
      tl.to({}, { duration: 0.35 });

      // -----------------------------------------------------------------------
      // STAGE 5: CINEMATIC CURTAIN REVEAL EXIT
      // -----------------------------------------------------------------------
      tl.to(lockupRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });

      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        },
        "-=0.12"
      );

      // Notify page entrance in tandem as curtain starts lifting
      tl.call(notifyPageReady, [], "-=0.55");
    }, containerRef);

    // Guaranteed safety fallback: never leave visitor trapped under overlay
    const safetyTimeout = setTimeout(() => {
      window.__motekra_preloader_active = false;
      window.__motekra_preloader_done = true;
      document.body.classList.remove("preloader-active");
      document.body.classList.add("preloader-finished");
      window.dispatchEvent(new CustomEvent("motekra-preloader-complete"));
      setShouldRender(false);
    }, 3200);

    // Support BFCache restores
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.__motekra_preloader_active = false;
        window.__motekra_preloader_done = true;
        document.body.classList.remove("preloader-active");
        document.body.classList.add("preloader-finished");
        window.dispatchEvent(new CustomEvent("motekra-preloader-complete"));
        setShouldRender(false);
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      clearTimeout(safetyTimeout);
      window.removeEventListener("pageshow", onPageShow);
      ctx.revert();
      document.body.classList.remove("preloader-active");
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      id="motekra-preloader"
      className="motekra-preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading MOTEKRA"
    >
      <div ref={lockupRef} className="motekra-preloader-inner">
        {/* Authentic Geometric Symbol with Component Assembly */}
        <div className="motekra-preloader-symbol">
          {/* Master authentic solid mark (locks in upon assembly completion) */}
          <div ref={solidMarkRef} className="motekra-preloader-mark-solid">
            <Image
              src="/assets/brand/motekra-mark.png"
              alt=""
              width={64}
              height={64}
              priority
              className="motekra-preloader-mark-img"
            />
          </div>

          {/* Authentic assembly pieces clipped from the original mark */}
          <div className="motekra-preloader-assembly-pieces" aria-hidden="true">
            {/* Piece 1: Top-Left Node (Cyan) */}
            <div ref={pieceTLRef} className="assembly-piece assembly-piece-tl">
              <Image
                src="/assets/brand/motekra-mark.png"
                alt=""
                width={64}
                height={64}
                priority
                className="motekra-preloader-mark-img"
              />
            </div>

            {/* Piece 2: Bottom-Left Node (Cyan-Blue) */}
            <div ref={pieceBLRef} className="assembly-piece assembly-piece-bl">
              <Image
                src="/assets/brand/motekra-mark.png"
                alt=""
                width={64}
                height={64}
                priority
                className="motekra-preloader-mark-img"
              />
            </div>

            {/* Piece 3: Center Core Stem & Bridge (Electric Blue) */}
            <div ref={pieceCenterRef} className="assembly-piece assembly-piece-center">
              <Image
                src="/assets/brand/motekra-mark.png"
                alt=""
                width={64}
                height={64}
                priority
                className="motekra-preloader-mark-img"
              />
            </div>

            {/* Piece 4: Top-Right Node (Royal Blue) */}
            <div ref={pieceTRRef} className="assembly-piece assembly-piece-tr">
              <Image
                src="/assets/brand/motekra-mark.png"
                alt=""
                width={64}
                height={64}
                priority
                className="motekra-preloader-mark-img"
              />
            </div>

            {/* Piece 5: Bottom-Right Node (Deep Blue) */}
            <div ref={pieceBRRef} className="assembly-piece assembly-piece-br">
              <Image
                src="/assets/brand/motekra-mark.png"
                alt=""
                width={64}
                height={64}
                priority
                className="motekra-preloader-mark-img"
              />
            </div>
          </div>
        </div>

        {/* Authentic Wordmark with Horizontal Text Mask Reveal */}
        <div ref={maskRef} className="motekra-preloader-wordmark-mask">
          <div ref={textRef} className="motekra-preloader-wordmark-wrap">
            <Image
              src="/assets/brand/motekra-wordmark-white.png"
              alt="MOTEKRA"
              width={220}
              height={20}
              priority
              className="motekra-preloader-wordmark-img"
            />
          </div>
          {/* Luminous leading scanning line along horizontal reveal edge */}
          <div ref={scanLineRef} className="motekra-preloader-scan-line" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
