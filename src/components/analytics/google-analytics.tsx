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
  const hadConsentRef = useRef<boolean>(false);

  useEffect(() => {
    hadConsentRef.current = hasAnalyticsConsent();

    // If visitor previously granted consent, initialize tracking on mount
    if (hadConsentRef.current) {
      initGtag();
      if (pathname) {
        pageview(pathname);
      }
    }

    // Subscribe to consent state changes (both local and cross-tab storage events)
    const unsubscribe = onConsentChange(() => {
      const choice = getStoredConsent();
      if (choice === "granted") {
        hadConsentRef.current = true;
        initGtag();
        if (pathname) {
          pageview(pathname);
        }
      } else if (choice === "denied") {
        const wasGranted = hadConsentRef.current;
        hadConsentRef.current = false;
        disableGtag();

        // If tag was already loaded into runtime, perform a controlled refresh
        // to cleanly purge memory, active Google sockets, and script execution.
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
    if (hasAnalyticsConsent()) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}
