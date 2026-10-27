"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonialsRow1, testimonialsRow2, type Testimonial } from "@/content/testimonials";
import "@/styles/testimonials.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TestimonialCard({
  item,
  isDuplicate = false,
  onCardFocus,
  onCardBlur
}: {
  item: Testimonial;
  isDuplicate?: boolean;
  onCardFocus?: () => void;
  onCardBlur?: () => void;
}) {
  return (
    <article
      className="testimonial-card"
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? "true" : undefined}
      onFocus={isDuplicate ? undefined : onCardFocus}
      onBlur={isDuplicate ? undefined : onCardBlur}
    >
      <div className="testimonial-card-header">
        <div className="testimonial-author-block">
          <div className="testimonial-avatar-frame" aria-hidden="true">
            <Image
              src={item.avatarSrc}
              alt=""
              width={48}
              height={48}
              className="testimonial-avatar-img"
              draggable={false}
              priority={false}
            />
          </div>
          <div className="testimonial-author-info">
            <h4 className="testimonial-author-name">{item.author}</h4>
            <p className="testimonial-author-role">
              - {item.role} at {item.company}
            </p>
          </div>
        </div>
        <div className="testimonial-stars" aria-label={`${item.rating} out of 5 stars`}>
          {"★".repeat(item.rating)}
        </div>
      </div>

      <p className="testimonial-message">
        {item.quote}
      </p>
    </article>
  );
}

export function TestimonialsMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1TrackRef = useRef<HTMLDivElement>(null);
  const row2TrackRef = useRef<HTMLDivElement>(null);

  const row1TweenRef = useRef<gsap.core.Tween | null>(null);
  const row2TweenRef = useRef<gsap.core.Tween | null>(null);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Smooth deceleration on hover / focus
  const slowDownTween = useCallback((tween: gsap.core.Tween | null) => {
    if (!tween) return;
    gsap.to(tween, { timeScale: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
  }, []);

  // Smooth acceleration when unhovered
  const speedUpTween = useCallback((tween: gsap.core.Tween | null) => {
    if (!tween || isManuallyPaused) return;
    gsap.to(tween, { timeScale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
  }, [isManuallyPaused]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const track1 = row1TrackRef.current;
    const track2 = row2TrackRef.current;
    const section = sectionRef.current;
    if (!track1 || !track2 || !section) return;

    const ctx = gsap.context(() => {
      // Row 1: Right to Left (0% -> -50%)
      const tween1 = gsap.fromTo(
        track1,
        { xPercent: 0 },
        {
          xPercent: -50,
          duration: 38,
          ease: "none",
          repeat: -1,
          paused: true
        }
      );
      row1TweenRef.current = tween1;

      // Row 2: Left to Right (-50% -> 0%)
      const tween2 = gsap.fromTo(
        track2,
        { xPercent: -50 },
        {
          xPercent: 0,
          duration: 42,
          ease: "none",
          repeat: -1,
          paused: true
        }
      );
      row2TweenRef.current = tween2;

      // Start immediately when the section enters 95% of the viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        end: "bottom top",
        invalidateOnRefresh: true,
        onEnter: () => {
          if (!isManuallyPaused) {
            tween1.play();
            tween2.play();
          }
        },
        onLeave: () => {
          tween1.pause();
          tween2.pause();
        },
        onEnterBack: () => {
          if (!isManuallyPaused) {
            tween1.play();
            tween2.play();
          }
        },
        onLeaveBack: () => {
          tween1.pause();
          tween2.pause();
        }
      });
    }, section);

    // Pause when switching tabs to prevent waste
    const handleVisibilityChange = () => {
      if (document.hidden) {
        row1TweenRef.current?.pause();
        row2TweenRef.current?.pause();
      } else if (!isManuallyPaused) {
        row1TweenRef.current?.play();
        row2TweenRef.current?.play();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      ctx.revert();
    };
  }, [isManuallyPaused]);

  const handleTogglePlayPause = () => {
    setIsManuallyPaused((prev) => {
      const next = !prev;
      if (next) {
        slowDownTween(row1TweenRef.current);
        slowDownTween(row2TweenRef.current);
      } else {
        speedUpTween(row1TweenRef.current);
        speedUpTween(row2TweenRef.current);
      }
      return next;
    });
  };

  return (
    <section
      ref={sectionRef}
      className="section home-testimonials"
      id="home-testimonials"
      data-home-section="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="container testimonials-header-center">
        {/* Pill Badge matching Magika reference */}
        <div className="testimonials-badge">
          <svg
            className="testimonials-badge-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Testimonials</span>
        </div>

        <h2 id="testimonials-title" className="testimonials-title">
          Feedback that fuels us
        </h2>

        <p className="testimonials-subtitle">
          See how our design partnership turned client ideas into momentum - and why they keep coming back.
        </p>

        <div className="testimonials-controls">
          <button
            type="button"
            className="marquee-toggle-btn"
            data-paused={isManuallyPaused}
            onClick={handleTogglePlayPause}
            aria-label={isManuallyPaused ? "Resume feedback marquee animation" : "Pause feedback marquee animation"}
          >
            <i aria-hidden="true" />
            <span>{isManuallyPaused ? "Resume Motion" : "Pause Motion"}</span>
          </button>
        </div>
      </div>

      <div
        className="testimonials-marquee-viewport"
        role="region"
        aria-label="Client testimonials continuous showcase"
      >
        {/* Row 1: Right to Left */}
        <div
          className="marquee-row marquee-row-1"
          onMouseEnter={() => slowDownTween(row1TweenRef.current)}
          onMouseLeave={() => speedUpTween(row1TweenRef.current)}
        >
          <div ref={row1TrackRef} className="marquee-track">
            {testimonialsRow1.map((item) => (
              <TestimonialCard
                key={item.id}
                item={item}
                onCardFocus={() => slowDownTween(row1TweenRef.current)}
                onCardBlur={() => speedUpTween(row1TweenRef.current)}
              />
            ))}
            {/* Cloned set for mathematical seamless infinite loop */}
            {testimonialsRow1.map((item) => (
              <TestimonialCard
                key={`${item.id}-clone`}
                item={item}
                isDuplicate
              />
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div
          className="marquee-row marquee-row-2"
          onMouseEnter={() => slowDownTween(row2TweenRef.current)}
          onMouseLeave={() => speedUpTween(row2TweenRef.current)}
        >
          <div ref={row2TrackRef} className="marquee-track">
            {testimonialsRow2.map((item) => (
              <TestimonialCard
                key={item.id}
                item={item}
                onCardFocus={() => slowDownTween(row2TweenRef.current)}
                onCardBlur={() => speedUpTween(row2TweenRef.current)}
              />
            ))}
            {/* Cloned set for mathematical seamless infinite loop */}
            {testimonialsRow2.map((item) => (
              <TestimonialCard
                key={`${item.id}-clone`}
                item={item}
                isDuplicate
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
