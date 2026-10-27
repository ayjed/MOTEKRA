"use client";

import { useEffect, useRef } from "react";
import "@/styles/custom-cursor.css";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate custom cursor on fine pointer devices (desktop/mouse)
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isHovering = false;
    let isProject = false;
    let isPressed = false;
    let rafId: number;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lerpFactor = reducedMotion ? 1 : 0.22;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = targetX;
        currentY = targetY;
        cursor.style.opacity = "1";
        document.body.classList.add("custom-cursor-active");
      }

      // Check if target is a project card or general interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const projectCard = target.closest(
          ".davka-project-card, .home-project-card, [data-work-card], .work-editorial-card"
        );

        if (projectCard) {
          if (!isProject) {
            isProject = true;
            cursor.classList.add("is-project");
          }
          if (isHovering) {
            isHovering = false;
            cursor.classList.remove("is-hovering");
          }
        } else {
          if (isProject) {
            isProject = false;
            cursor.classList.remove("is-project");
          }

          const interactive = target.closest(
            "a, button, summary, [role='button'], input[type='submit'], input[type='button'], .davka-card, .interactive-service, .accordion-header, .filter-chip"
          );

          if (interactive && !isHovering) {
            isHovering = true;
            cursor.classList.add("is-hovering");
          } else if (!interactive && isHovering) {
            isHovering = false;
            cursor.classList.remove("is-hovering");
          }
        }
      }
    };

    const onPointerDown = () => {
      isPressed = true;
      cursor.classList.add("is-active");
    };

    const onPointerUp = () => {
      isPressed = false;
      cursor.classList.remove("is-active");
    };

    const onMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      cursor.style.opacity = "1";
    };

    const render = () => {
      if (isVisible) {
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="cursor-arrow" aria-hidden="true">↗</span>
    </div>
  );
}
