/**
 * MOTEKRA Google Analytics 4 (GA4) Integration
 *
 * Measurement ID: G-D521RGZ87P
 *
 * Architecture:
 * - Basic Consent Mode: The gtag.js script is loaded ONLY after explicit consent ('granted').
 * - Automatic pageviews are disabled (send_page_view: false) to prevent duplicate
 *   events on initial load or conflicting browser history listeners.
 * - Single-page router navigations are explicitly tracked via pageview().
 * - Lead conversion (generate_lead) is emitted ONLY on verified contact form success.
 * - Strict PII filter ensures no names, emails, phone numbers, inquiry text,
 *   or reference IDs are ever transmitted to GA4.
 */

import { hasAnalyticsConsent } from "./consent";

export const GA_MEASUREMENT_ID = "G-D521RGZ87P";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let isInitialized = false;

/**
 * Initializes GA4 and injects the script tag strictly after consent is granted.
 */
export function initGtag(): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (isInitialized) return;

  // Un-disable GA if it was previously disabled
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag("js", new Date());

  // Disable auto page_view to prevent duplicate events with Next.js router
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  // Inject gtag.js script only after consent
  const existingScript = document.getElementById("ga4-script");
  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  isInitialized = true;
}

/**
 * Disables tracking and sets Google's disable flag.
 */
export function disableGtag(): void {
  if (typeof window === "undefined") return;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  isInitialized = false;

  // Remove script if present in DOM
  const script = document.getElementById("ga4-script");
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

/**
 * Strips any sensitive PII parameters before dispatching to GA4.
 */
export function sanitizeAnalyticsParams(
  params?: Record<string, unknown>
): Record<string, unknown> {
  if (!params) return {};
  const sanitized: Record<string, unknown> = {};
  const forbiddenPatterns = [
    /email/i,
    /name/i,
    /phone/i,
    /message/i,
    /contact/i,
    /reference/i,
    /token/i,
    /secret/i,
    /address/i,
  ];

  for (const [key, value] of Object.entries(params)) {
    const isForbidden = forbiddenPatterns.some((pattern) => pattern.test(key));
    if (!isForbidden && typeof value !== "function") {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Safely dispatches a GA4 event if analytics consent is currently granted.
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (!window.gtag) {
    initGtag();
  }

  const cleanParams = sanitizeAnalyticsParams(eventParams);
  window.gtag?.("event", eventName, cleanParams);
}

/**
 * Tracks a route change / page view.
 */
export function pageview(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  trackEvent("page_view", {
    page_path: path,
    page_title: title || (typeof document !== "undefined" ? document.title : undefined),
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
  });
}

/**
 * Tracks the recommended GA4 generate_lead event on confirmed contact form inquiry.
 * Strictly guarantees ZERO personally identifiable information is transmitted.
 */
export function trackGenerateLead(): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  trackEvent("generate_lead", {
    event_category: "engagement",
    event_label: "contact_inquiry",
  });
}
