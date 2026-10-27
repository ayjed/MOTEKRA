"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-m";
import { useEffect, useRef, useState, useCallback } from "react";
import { useGsapScope, useMedia } from "@/lib/animations/hooks";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileNavigation({ pathname }: { pathname: string }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const reduce = !useMedia("(prefers-reduced-motion: no-preference)");
  const isDesktop = useMedia("(min-width: 768px)");

  // Close drawer if screen resizes to desktop
  useEffect(() => {
    if (isDesktop && dialogRef.current?.open) {
      dialogRef.current.close();
      setOpen(false);
    }
  }, [isDesktop]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const openDrawer = useCallback(() => {
    if (!dialogRef.current?.showModal) return;
    dialogRef.current.showModal();
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    if (reduce) {
      dialogRef.current?.close();
    } else {
      setTimeout(() => {
        if (dialogRef.current?.open) {
          dialogRef.current.close();
        }
      }, 350);
    }
    triggerRef.current?.focus();
  }, [reduce]);

  // Keyboard accessibility and focus trap inside modal dialog
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex="0"]'
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      closeDrawer();
    }
  };

  return (
    <div className="mobile-navigation">
      <button
        type="button"
        ref={triggerRef}
        className="mobile-menu-toggle"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-dialog"
        onClick={open ? closeDrawer : openDrawer}
      >
        <span className="hamburger-box" aria-hidden="true">
          <span className={`hamburger-line ${open ? "is-open" : ""}`} />
          <span className={`hamburger-line ${open ? "is-open" : ""}`} />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-nav-dialog"
        className="nav-dialog"
        aria-label="Site navigation"
        onKeyDown={handleKeyDown}
        onCancel={(e) => {
          e.preventDefault();
          closeDrawer();
        }}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="nav-drawer"
          initial={false}
          animate={{
            x: open || reduce ? "0%" : "100%",
            opacity: open ? 1 : 0.7,
          }}
          transition={{
            duration: reduce ? 0 : 0.38,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => {
            if (!open && dialogRef.current?.open) {
              dialogRef.current.close();
            }
          }}
        >
          <div className="drawer-heading">
            <div className="drawer-brand">
              <span className="drawer-brand-dot" aria-hidden="true" />
              <span>MOTEKRA / NAVIGATION</span>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={closeDrawer}
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>

          <nav className="drawer-nav" aria-label="Mobile navigation">
            {navLinks.map(({ href, label }) => {
              const active = isLinkActive(pathname, href);
              return (
                <Link
                  prefetch={false}
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`drawer-link ${active ? "is-active" : ""}`}
                  onClick={closeDrawer}
                >
                  <span className="drawer-link-label">{label}</span>
                  {active ? (
                    <span className="drawer-link-badge">CURRENT</span>
                  ) : (
                    <span className="drawer-link-arrow" aria-hidden="true">
                      ↗
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="drawer-footer">
            <p className="drawer-tagline">
              Digital products for what’s next.
            </p>
            <Link
              prefetch={false}
              href="/contact"
              className="button button-primary drawer-cta"
              onClick={closeDrawer}
            >
              Start a Project <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </motion.div>
      </dialog>
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const desktop = useMedia("(min-width: 768px)");
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(
    ref,
    (gsap, _trigger, root) => {
      if (pathname === "/") return; // Home coordinates entrance with its own hero timeline
      gsap.from(root.querySelectorAll(".desktop-nav > a"), {
        y: -6,
        opacity: 0.5,
        duration: 0.45,
        stagger: 0.04,
        ease: "power2.out",
      });
    },
    desktop
  );

  return (
    <div ref={ref} className="navigation">
      <nav className="desktop-nav" aria-label="Main navigation">
        {navLinks.map(({ href, label }) => {
          const active = isLinkActive(pathname, href);
          return (
            <Link
              prefetch={false}
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`nav-link ${active ? "is-active" : ""}`}
            >
              <span>{label}</span>
              {active && (
                <motion.span
                  className="active-nav-indicator"
                  layoutId="activeNavIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
      <MobileNavigation key={pathname} pathname={pathname} />
    </div>
  );
}
