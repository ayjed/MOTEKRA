import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Setup browser globals for Node.js Vitest environment
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

class MockEventTarget {
  private listeners: Record<string, Array<(event: unknown) => void>> = {};

  addEventListener(type: string, listener: (event: unknown) => void): void {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (event: unknown) => void): void {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
  }

  dispatchEvent(event: { type: string }): boolean {
    const list = this.listeners[event.type] || [];
    for (const listener of list) {
      listener(event);
    }
    return true;
  }
}

const mockTarget = new MockEventTarget();
const mockStorage = new MockLocalStorage();
const scriptMap = new Map<string, unknown>();

const mockDocument = {
  title: "MOTEKRA | Digital products for what's next",
  head: {
    appendChild: vi.fn((el: { id: string }) => {
      scriptMap.set(el.id, el);
      return el;
    }),
  },
  getElementById: vi.fn((id: string) => scriptMap.get(id) || null),
  createElement: vi.fn((tag: string) => {
    const el = {
      tagName: tag.toUpperCase(),
      id: "",
      src: "",
      async: false,
      parentNode: {
        removeChild: vi.fn(() => {
          if (el.id) scriptMap.delete(el.id);
        }),
      },
    };
    return el;
  }),
};

// Polyfill global window & document if in Node environment
const mockWindow = {
  localStorage: mockStorage,
  addEventListener: mockTarget.addEventListener.bind(mockTarget),
  removeEventListener: mockTarget.removeEventListener.bind(mockTarget),
  dispatchEvent: mockTarget.dispatchEvent.bind(mockTarget),
  location: { href: "https://www.motekra.com/", reload: vi.fn() },
  dataLayer: undefined as unknown[] | undefined,
  gtag: undefined as ((...args: unknown[]) => void) | undefined,
};

// @ts-expect-error polyfilling test environment
globalThis.window = mockWindow;
// @ts-expect-error polyfilling test environment
globalThis.document = mockDocument;

// Import analytics modules after window is available
import {
  getStoredConsent,
  setStoredConsent,
  hasAnalyticsConsent,
  onConsentChange,
  openConsentPreferences,
  closeConsentPreferences,
  subscribeConsentModal,
  getConsentModalSnapshot,
  CONSENT_STORAGE_KEY,
} from "@/lib/analytics/consent";
import {
  GA_MEASUREMENT_ID,
  initGtag,
  disableGtag,
  pageview,
  trackGenerateLead,
  sanitizeAnalyticsParams,
} from "@/lib/analytics/gtag";

describe("GA4 Measurement ID and Configuration", () => {
  it("uses the approved public GA4 measurement ID", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-D521RGZ87P");
  });
});

describe("Consent Management Lifecycle", () => {
  beforeEach(() => {
    mockStorage.clear();
    closeConsentPreferences();
  });

  afterEach(() => {
    mockStorage.clear();
    closeConsentPreferences();
    vi.restoreAllMocks();
  });

  it("defaults to 'unset' when no preference has been recorded", () => {
    expect(getStoredConsent()).toBe("unset");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("persists 'granted' preference and triggers change listeners", () => {
    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    setStoredConsent("granted");

    expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
    expect(getStoredConsent()).toBe("granted");
    expect(hasAnalyticsConsent()).toBe(true);
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("persists 'denied' preference and triggers change listeners", () => {
    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    setStoredConsent("denied");

    expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
    expect(getStoredConsent()).toBe("denied");
    expect(hasAnalyticsConsent()).toBe(false);
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("controls modal state via openConsentPreferences and closeConsentPreferences", () => {
    const modalListener = vi.fn();
    const unsubscribe = subscribeConsentModal(modalListener);

    expect(getConsentModalSnapshot()).toBe(false);

    openConsentPreferences();
    expect(getConsentModalSnapshot()).toBe(true);
    expect(modalListener).toHaveBeenCalledTimes(1);

    closeConsentPreferences();
    expect(getConsentModalSnapshot()).toBe(false);
    expect(modalListener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });
});

describe("Basic Consent Mode & Script Isolation", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
    delete (mockWindow as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`];
  });

  afterEach(() => {
    disableGtag();
    mockStorage.clear();
    scriptMap.clear();
    vi.restoreAllMocks();
  });

  it("does not inject gtag.js or initialize dataLayer when consent is unset", () => {
    initGtag();

    expect(scriptMap.has("ga4-script")).toBe(false);
    expect(mockWindow.gtag).toBeUndefined();
    expect(mockWindow.dataLayer).toBeUndefined();
  });

  it("does not inject gtag.js or initialize dataLayer when consent is denied", () => {
    setStoredConsent("denied");
    initGtag();

    expect(scriptMap.has("ga4-script")).toBe(false);
    expect(mockWindow.gtag).toBeUndefined();
    expect(mockWindow.dataLayer).toBeUndefined();
  });

  it("injects gtag.js with proper URL and configures dataLayer only when consent is granted", () => {
    setStoredConsent("granted");
    initGtag();

    expect(scriptMap.has("ga4-script")).toBe(true);
    const script = scriptMap.get("ga4-script") as { src: string; async: boolean };
    expect(script.src).toContain(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    expect(script.async).toBe(true);
    expect(typeof mockWindow.gtag).toBe("function");
    expect(Array.isArray(mockWindow.dataLayer)).toBe(true);
    expect((mockWindow as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(false);
  });

  it("disableGtag sets the ga-disable flag and removes script from DOM", () => {
    setStoredConsent("granted");
    initGtag();
    expect(scriptMap.has("ga4-script")).toBe(true);

    disableGtag();

    expect((mockWindow as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);
    expect(scriptMap.has("ga4-script")).toBe(false);
  });
});

describe("Pageview and Navigation Tracking", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
  });

  afterEach(() => {
    disableGtag();
    vi.restoreAllMocks();
  });

  it("suppresses pageview events when consent is not granted", () => {
    const gtagSpy = vi.fn();
    mockWindow.gtag = gtagSpy;

    pageview("/work");

    expect(gtagSpy).not.toHaveBeenCalled();
  });

  it("emits page_view with sanitized route parameters when consent is granted", () => {
    setStoredConsent("granted");
    initGtag();

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");

    pageview("/about", "About — MOTEKRA");

    expect(pushSpy).toHaveBeenCalled();
    const calls = pushSpy.mock.calls;
    const pageViewCall = calls.find((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });

    expect(pageViewCall).toBeDefined();
    const eventParams = (pageViewCall![0] as IArguments)[2] as Record<string, unknown>;
    expect(eventParams.page_path).toBe("/about");
    expect(eventParams.page_title).toBe("About — MOTEKRA");
  });
});

describe("Lead Tracking & Zero-PII Enforcement", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
  });

  afterEach(() => {
    disableGtag();
    vi.restoreAllMocks();
  });

  it("suppresses generate_lead when consent is not granted", () => {
    const gtagSpy = vi.fn();
    mockWindow.gtag = gtagSpy;

    trackGenerateLead();

    expect(gtagSpy).not.toHaveBeenCalled();
  });

  it("emits generate_lead on successful contact inquiry with zero PII", () => {
    setStoredConsent("granted");
    initGtag();

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");

    trackGenerateLead();

    expect(pushSpy).toHaveBeenCalled();
    const calls = pushSpy.mock.calls;
    const leadCall = calls.find((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "generate_lead";
    });

    expect(leadCall).toBeDefined();
    const eventParams = (leadCall![0] as IArguments)[2] as Record<string, unknown>;

    // Strict non-PII verification
    expect(eventParams).toEqual({
      event_category: "engagement",
      event_label: "contact_inquiry",
    });

    // Explicitly verify no PII fields exist
    expect(eventParams).not.toHaveProperty("name");
    expect(eventParams).not.toHaveProperty("email");
    expect(eventParams).not.toHaveProperty("phone");
    expect(eventParams).not.toHaveProperty("message");
    expect(eventParams).not.toHaveProperty("reference");
  });

  it("sanitizeAnalyticsParams strips all sensitive keys and PII patterns", () => {
    const raw = {
      page_path: "/contact",
      event_category: "engagement",
      name: "Alice Smith",
      email: "alice@example.com",
      user_phone: "+1234567890",
      contactReference: "ref_12345",
      inquiry_message: "Hello world",
      auth_token: "secret_token",
      user_address: "123 Main St",
      safeMetric: 42,
    };

    const sanitized = sanitizeAnalyticsParams(raw);

    expect(sanitized).toEqual({
      page_path: "/contact",
      event_category: "engagement",
      safeMetric: 42,
    });

    expect(sanitized).not.toHaveProperty("name");
    expect(sanitized).not.toHaveProperty("email");
    expect(sanitized).not.toHaveProperty("user_phone");
    expect(sanitized).not.toHaveProperty("contactReference");
    expect(sanitized).not.toHaveProperty("inquiry_message");
    expect(sanitized).not.toHaveProperty("auth_token");
    expect(sanitized).not.toHaveProperty("user_address");
  });
});
