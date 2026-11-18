"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  getStoredConsent,
  hasAnalyticsConsent,
  onConsentChange,
} from "@/lib/analytics/consent";
import { initGtag, disableGtag, pageview } from "@/lib/analytics/gtag";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);
  const hadConsentRef = useRef<boolean>(false);

  useEffect(() => {
    hadConsentRef.current = hasAnalyticsConsent();

    // If visitor previously granted consent, initialize tracking on mount
    if (hadConsentRef.current) {
      initGtag();
      if (pathname && lastPathRef.current !== pathname) {
        pageview(pathname);
        lastPathRef.current = pathname;
      }
    }

    // Subscribe to consent state changes (e.g. user clicks Accept or Revoke)
    const unsubscribe = onConsentChange(() => {
      const choice = getStoredConsent();
      if (choice === "granted") {
        hadConsentRef.current = true;
        initGtag();
        if (pathname) {
          pageview(pathname);
          lastPathRef.current = pathname;
        }
      } else if (choice === "denied") {
        const wasGranted = hadConsentRef.current;
        hadConsentRef.current = false;
        disableGtag();
        lastPathRef.current = null;

        // If tag was already loaded into runtime, perform a controlled refresh
        // to cleanly purge memory and active Google sockets.
        if (wasGranted && typeof window !== "undefined") {
          window.location.reload();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pathname]);

  // Track client-side route transitions when consent is granted
  useEffect(() => {
    if (!pathname) return;
    if (hasAnalyticsConsent() && lastPathRef.current !== pathname) {
      pageview(pathname);
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
}
