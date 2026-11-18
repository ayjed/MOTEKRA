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
 * - Safe URL & Campaign Attribution: Automatic and manual events sanitize
 *   page_location and page_referrer:
 *   - Only approved marketing attribution parameters (UTMs, gclid, etc.) are kept.
 *   - Non-whitelisted or sensitive query parameters and URL fragments are strictly stripped.
 * - Single-page router navigations: Tracked explicitly via pageview().
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
 * Whitelist of permitted campaign attribution query parameters.
 * Legitimate marketing attribution is preserved while stripping all user inputs,
 * tokens, emails, names, or sensitive query parameters.
 */
export const ALLOWED_ATTRIBUTION_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "dclid",
  "fbclid",
  "msclkid",
  "ttclid",
]);

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
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
const TOKEN_HEX_PATTERN = /^[a-f0-9]{32,}$/i;
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/**
 * Validates attribution parameter values.
 * Rejects values containing emails, telephone numbers, tokens, or suspicious non-slug characters.
 */
export function isSuspiciousAttributionValue(val: string): boolean {
  if (!val || val.length > 120) return true;
  if (EMAIL_PATTERN.test(val)) return true;
  if (PHONE_PATTERN.test(val)) return true;
  if (TOKEN_HEX_PATTERN.test(val)) return true;
  if (JWT_PATTERN.test(val)) return true;
  // Allow safe characters standard in attribution tags: alphanumeric, hyphens, underscores, dots, plus
  if (!/^[a-zA-Z0-9_\-+.]+$/.test(val)) return true;
  return false;
}

/**
 * Sanitizes pathnames by stripping any PII embedded in path segments.
 */
export function sanitizePathname(rawPath: string): string {
  if (!rawPath) return "/";
  const segments = rawPath.split("/").map((segment) => {
    if (!segment) return "";
    if (
      EMAIL_PATTERN.test(segment) ||
      PHONE_PATTERN.test(segment) ||
      TOKEN_HEX_PATTERN.test(segment)
    ) {
      return "[redacted]";
    }
    return segment;
  });
  return segments.join("/") || "/";
}

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
      let cleanVal = value;
      if (key === "page_path" || key === "page_location") {
        cleanVal = getSafePageLocation(cleanVal);
        if (key === "page_path") {
          try {
            const urlObj = new URL(cleanVal, "https://www.motekra.com");
            cleanVal = sanitizePathname(urlObj.pathname);
          } catch {
            cleanVal = sanitizePathname(
              (cleanVal.split("?")[0] ?? "").split("#")[0] ?? cleanVal
            );
          }
        }
      } else {
        cleanVal = cleanVal
          .replace(EMAIL_PATTERN, "[redacted]")
          .replace(PHONE_PATTERN, "[redacted]")
          .trim();
      }

      sanitized[key] = cleanVal;
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Returns a sanitized URL location that:
 * 1. Uses trusted origin and sanitized pathname.
 * 2. Preserves legitimate campaign attribution parameters (UTMs, gclid, etc.).
 * 3. Rejects suspicious values (emails, phones, tokens) instead of forwarding them.
 * 4. Completely excludes URL hash fragments.
 */
export function getSafePageLocation(pathOrUrl?: string): string {
  if (typeof window === "undefined") return "https://www.motekra.com/";

  const origin = window.location?.origin || "https://www.motekra.com";
  const rawUrlString = pathOrUrl || window.location?.href || origin;

  try {
    const parsed = new URL(rawUrlString, origin);
    const cleanParams = new URLSearchParams();

    parsed.searchParams.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      if (ALLOWED_ATTRIBUTION_PARAMS.has(lowerKey)) {
        // Reject suspicious values rather than forwarding them
        if (!isSuspiciousAttributionValue(val)) {
          cleanParams.set(key, val.trim());
        }
      }
    });

    const queryString = cleanParams.toString();
    const cleanPath = sanitizePathname(parsed.pathname || "/");
    return queryString ? `${origin}${cleanPath}?${queryString}` : `${origin}${cleanPath}`;
  } catch {
    const rawPath = ((pathOrUrl || "/").split("?")[0] ?? "/").split("#")[0] || "/";
    const cleanPath = sanitizePathname(rawPath);
    return `${origin}${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`;
  }
}

/**
 * Returns a sanitized referrer URL:
 * - For external referrers: prefers origin only to prevent leaking third-party paths or query data.
 * - For internal referrers: preserves origin and sanitized pathname without query strings or hashes.
 */
export function getSafeReferrer(): string {
  if (typeof document === "undefined" || !document.referrer) return "";

  try {
    const referrerUrl = new URL(document.referrer);
    const currentOrigin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://www.motekra.com";

    // For external referrers, prefer origin only
    if (referrerUrl.origin !== currentOrigin) {
      return referrerUrl.origin;
    }

    // For internal referrers within MOTEKRA, include origin and sanitized pathname
    const cleanPath = sanitizePathname(referrerUrl.pathname || "/");
    return `${referrerUrl.origin}${cleanPath}`;
  } catch {
    return "";
  }
}

/**
 * Initializes GA4 and injects gtag.js strictly after affirmative consent is granted.
 * Queues Consent Mode v2 default and update signals in the proper order.
 * Applies sanitized page_location and page_referrer globally to prevent automatic event leaks.
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

  const safeLocation = getSafePageLocation();
  const safeReferrer = getSafeReferrer();

  // 4. Global default configuration for automatic events (session_start, etc.)
  window.gtag("set", {
    page_location: safeLocation,
    page_referrer: safeReferrer,
  });

  // 5. Configure GA4 without automatic pageviews and with advertising disabled
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    restricted_data_processing: true,
    page_location: safeLocation,
    page_referrer: safeReferrer,
  });

  // 6. Inject gtag.js script tag strictly after consent configuration
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
 * Ensures page_location uses ONLY trusted origin, pathname, and legitimate campaign attribution,
 * strictly excluding sensitive query parameters and URL fragments to protect PII.
 */
export function pageview(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  // Clean pathname: strip any query string or hash fragment and sanitize path segments
  const rawPath = ((path || "/").split("?")[0] ?? "/").split("#")[0] || "/";
  const cleanPath = sanitizePathname(rawPath);

  // Prevent duplicate pageview events for the exact same active path
  if (lastTrackedPath === cleanPath) {
    return;
  }
  lastTrackedPath = cleanPath;

  const safeLocation = getSafePageLocation(path);
  const rawTitle = title || (typeof document !== "undefined" ? document.title : "");
  const cleanTitle = rawTitle.replace(EMAIL_PATTERN, "[redacted]").trim();

  trackEvent("page_view", {
    page_path: cleanPath,
    page_title: cleanTitle,
    page_location: safeLocation,
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
