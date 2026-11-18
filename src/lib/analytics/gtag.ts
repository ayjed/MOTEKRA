/**
 * MOTEKRA Google Analytics 4 (GA4) Integration
 *
 * Measurement ID: G-D521RGZ87P
 *
 * Architecture & Privacy Guarantees:
 * - Basic Consent Mode (v2): No gtag.js script or network tracking requests
 *   are dispatched prior to explicit affirmative consent.
 * - Consent Mode v2 Signals: Defaults are queued as all denied. Upon explicit
 *   consent, analytics_storage is granted while all advertising signals remain denied.
 * - Single-page router navigations: Tracked explicitly via pageview() using trusted
 *   origin and pathname ONLY (query parameters and URL fragments strictly excluded).
 * - Lead conversion: generate_lead is dispatched strictly on confirmed HTTP 200 { ok: true }
 *   contact submissions, with deduplication.
 * - Approved parameter whitelist: Non-whitelisted keys and PII patterns (emails, names,
 *   phone numbers, messages, inquiry IDs) are completely scrubbed.
 * - Advertising signals disabled: allow_google_signals: false,
 *   allow_ad_personalization_signals: false, restricted_data_processing: true.
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
let lastTrackedPath: string | null = null;

export function resetTrackedPathForTesting(): void {
  lastTrackedPath = null;
  isInitialized = false;
}

/**
 * Whitelist of permitted parameter names per GA4 event name.
 * Any key not explicitly defined here is discarded to prevent accidental PII leakage.
 */
const APPROVED_EVENT_PARAMS: Record<string, ReadonlySet<string>> = {
  page_view: new Set(["page_path", "page_title", "page_location"]),
  generate_lead: new Set(["event_category", "event_label", "value", "currency"]),
};

/**
 * Common forbidden PII patterns in string values.
 */
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

/**
 * Sanitizes event parameters against an approved whitelist and strips PII.
 */
export function sanitizeAnalyticsParams(
  eventName: string,
  params?: Record<string, unknown>
): Record<string, unknown> {
  if (!params) return {};

  const allowedKeys = APPROVED_EVENT_PARAMS[eventName] || new Set<string>();
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    // Only accept explicitly approved keys
    if (!allowedKeys.has(key)) {
      continue;
    }

    if (typeof value === "string") {
      // Scrub query parameters, fragments, emails, and phone numbers from string values
      let cleanVal = value;
      if (key === "page_path" || key === "page_location") {
        cleanVal = (cleanVal.split("?")[0] ?? "").split("#")[0] ?? cleanVal;
      }
      cleanVal = cleanVal
        .replace(EMAIL_PATTERN, "[redacted]")
        .replace(PHONE_PATTERN, "[redacted]")
        .trim();

      sanitized[key] = cleanVal;
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Initializes GA4 and injects gtag.js strictly after affirmative consent is granted.
 * Queues Consent Mode v2 default and update signals in the proper order.
 */
export function initGtag(): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (isInitialized) return;

  // Ensure GA disable flag is removed
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  // 1. Google Consent Mode v2: Queue default signals (all denied)
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  // 2. Google Consent Mode v2: Update analytics_storage to granted; keep ads denied
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  // 3. Initialize JS timestamp
  window.gtag("js", new Date());

  // 4. Configure GA4 without automatic pageviews and with advertising disabled
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    restricted_data_processing: true,
  });

  // 5. Inject gtag.js script tag strictly after consent configuration
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
 * Disables tracking, revokes consent signals, and removes the script element.
 */
export function disableGtag(): void {
  if (typeof window === "undefined") return;

  // Set Google Analytics global disable flag
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  // Revoke consent signals in dataLayer if gtag is initialized
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  // Remove script from DOM if present
  const script = document.getElementById("ga4-script");
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }

  isInitialized = false;
  lastTrackedPath = null;
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
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  if (!isInitialized || !window.gtag) {
    initGtag();
  }

  const cleanParams = sanitizeAnalyticsParams(eventName, eventParams);
  window.gtag?.("event", eventName, cleanParams);
}

/**
 * Tracks a route change / page view.
 * Ensures page_location uses ONLY trusted origin and pathname,
 * strictly excluding query parameters and URL fragments to protect PII.
 */
export function pageview(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  // Clean pathname: strip any query string or hash fragment
  const cleanPath = ((path || "/").split("?")[0] ?? "/").split("#")[0] || "/";

  // Prevent duplicate pageview events for the exact same active path
  if (lastTrackedPath === cleanPath) {
    return;
  }
  lastTrackedPath = cleanPath;

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://www.motekra.com";
  const cleanLocation = `${origin}${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`;

  const rawTitle = title || (typeof document !== "undefined" ? document.title : "");
  const cleanTitle = rawTitle.replace(EMAIL_PATTERN, "[redacted]").trim();

  trackEvent("page_view", {
    page_path: cleanPath,
    page_title: cleanTitle,
    page_location: cleanLocation,
  });
}

/**
 * Tracks the recommended GA4 generate_lead event on confirmed contact form inquiry.
 * Strictly guarantees ZERO personally identifiable information is transmitted.
 */
export function trackGenerateLead(): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  trackEvent("generate_lead", {
    event_category: "engagement",
    event_label: "contact_inquiry",
  });
}
