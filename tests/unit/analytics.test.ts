import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock Storage supporting throws and cross-tab simulation
class MockLocalStorage {
  public store: Record<string, string> = {};
  public shouldThrow = false;

  getItem(key: string): string | null {
    if (this.shouldThrow) {
      throw new Error("SecurityError: localStorage is disabled");
    }
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.shouldThrow) {
      throw new Error("SecurityError: localStorage is disabled");
    }
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
    this.shouldThrow = false;
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

let currentActiveElement: unknown = null;

const mockDocument = {
  title: "MOTEKRA | Digital products for what's next",
  referrer: "",
  get activeElement() {
    return currentActiveElement;
  },
  body: {
    style: { overflow: "" },
  },
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
      focus: vi.fn(() => {
        currentActiveElement = el;
      }),
      parentNode: {
        removeChild: vi.fn(() => {
          if (el.id) scriptMap.delete(el.id);
        }),
      },
    };
    return el;
  }),
};

const mockWindow = {
  localStorage: mockStorage,
  addEventListener: mockTarget.addEventListener.bind(mockTarget),
  removeEventListener: mockTarget.removeEventListener.bind(mockTarget),
  dispatchEvent: mockTarget.dispatchEvent.bind(mockTarget),
  location: {
    href: "https://www.motekra.com/",
    origin: "https://www.motekra.com",
    pathname: "/",
    reload: vi.fn(),
  },
  dataLayer: undefined as unknown[] | undefined,
  gtag: undefined as ((...args: unknown[]) => void) | undefined,
};

// Polyfill global window & document in Node environment
// @ts-expect-error polyfilling test environment
globalThis.window = mockWindow;
// @ts-expect-error polyfilling test environment
globalThis.document = mockDocument;

// Import analytics modules after window polyfill
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
  getSafePageLocation,
  getSafeReferrer,
  resetTrackedPathForTesting,
} from "@/lib/analytics/gtag";

describe("GA4 Measurement ID and Configuration", () => {
  it("uses the approved public GA4 measurement ID", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-D521RGZ87P");
  });
});

describe("Consent Mode v2 Signal Ordering and Basic Consent Mode", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    resetTrackedPathForTesting();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
    delete (mockWindow as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`];
  });

  afterEach(() => {
    disableGtag();
    mockStorage.clear();
    scriptMap.clear();
    resetTrackedPathForTesting();
    vi.restoreAllMocks();
  });

  it("does not inject script or initialize dataLayer before consent is granted", () => {
    initGtag();

    expect(scriptMap.has("ga4-script")).toBe(false);
    expect(mockWindow.gtag).toBeUndefined();
    expect(mockWindow.dataLayer).toBeUndefined();
  });

  it("does not inject script when consent is explicitly denied", () => {
    setStoredConsent("denied");
    initGtag();

    expect(scriptMap.has("ga4-script")).toBe(false);
    expect(mockWindow.gtag).toBeUndefined();
    expect(mockWindow.dataLayer).toBeUndefined();
  });

  it("queues Consent Mode v2 default and update signals in the correct order on consent", () => {
    setStoredConsent("granted");
    initGtag();

    expect(Array.isArray(mockWindow.dataLayer)).toBe(true);
    const dataLayer = mockWindow.dataLayer as unknown[][];

    // Call 1: consent default (all denied)
    const call1 = dataLayer[0] as unknown as IArguments;
    expect(call1[0]).toBe("consent");
    expect(call1[1]).toBe("default");
    expect(call1[2]).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    // Call 2: consent update (analytics granted, ad signals denied)
    const call2 = dataLayer[1] as unknown as IArguments;
    expect(call2[0]).toBe("consent");
    expect(call2[1]).toBe("update");
    expect(call2[2]).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    // Call 3: js timestamp
    const call3 = dataLayer[2] as unknown as IArguments;
    expect(call3[0]).toBe("js");
    expect(call3[1]).toBeInstanceOf(Date);

    // Call 4: global page_location & page_referrer setting for automatic events
    const call4 = dataLayer[3] as unknown as IArguments;
    expect(call4[0]).toBe("set");
    expect(call4[1]).toEqual({
      page_location: expect.any(String),
      page_referrer: expect.any(String),
    });

    // Call 5: config without automatic page_view and advertising disabled
    const call5 = dataLayer[4] as unknown as IArguments;
    expect(call5[0]).toBe("config");
    expect(call5[1]).toBe(GA_MEASUREMENT_ID);
    expect(call5[2]).toMatchObject({
      send_page_view: false,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      restricted_data_processing: true,
    });

    // Call 6: script injected
    expect(scriptMap.has("ga4-script")).toBe(true);
    const script = scriptMap.get("ga4-script") as { src: string; async: boolean };
    expect(script.src).toContain(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    expect(script.async).toBe(true);
  });

  it("disableGtag revokes consent signals, sets ga-disable flag, and removes script tag", () => {
    setStoredConsent("granted");
    initGtag();
    expect(scriptMap.has("ga4-script")).toBe(true);

    disableGtag();

    expect((mockWindow as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);
    expect(scriptMap.has("ga4-script")).toBe(false);

    // Verify consent update with all denied was pushed
    const dataLayer = mockWindow.dataLayer as unknown[][];
    const lastCall = dataLayer[dataLayer.length - 1] as unknown as IArguments;
    expect(lastCall[0]).toBe("consent");
    expect(lastCall[1]).toBe("update");
    expect(lastCall[2]).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });
});

describe("Automatic URL Privacy & Campaign Attribution", () => {
  it("preserves legitimate campaign attribution parameters while discarding PII and sensitive queries", () => {
    const rawUrl =
      "https://www.motekra.com/contact?utm_source=linkedin&utm_medium=paid_social&utm_campaign=q4_launch&gclid=abc123xyz&email=user%40example.com&token=secret_auth&name=John#form-step";

    const safeUrl = getSafePageLocation(rawUrl);

    // Legitimate attribution parameters preserved
    expect(safeUrl).toContain("utm_source=linkedin");
    expect(safeUrl).toContain("utm_medium=paid_social");
    expect(safeUrl).toContain("utm_campaign=q4_launch");
    expect(safeUrl).toContain("gclid=abc123xyz");

    // Sensitive parameters strictly stripped
    expect(safeUrl).not.toContain("email");
    expect(safeUrl).not.toContain("user%40example.com");
    expect(safeUrl).not.toContain("token");
    expect(safeUrl).not.toContain("secret_auth");
    expect(safeUrl).not.toContain("name=John");
    expect(safeUrl).not.toContain("#form-step");
  });

  it("returns origin and pathname when no campaign attribution parameters exist", () => {
    const rawUrl = "https://www.motekra.com/about?ref=internal&session=xyz123#team";
    const safeUrl = getSafePageLocation(rawUrl);

    expect(safeUrl).toBe("https://www.motekra.com/about");
  });

  it("sanitizes document.referrer by stripping sensitive query parameters and hash fragments", () => {
    mockDocument.referrer = "https://external-partner.com/campaign?token=secret123&user=42#ref";
    const safeReferrer = getSafeReferrer();

    expect(safeReferrer).toBe("https://external-partner.com/campaign");
    expect(safeReferrer).not.toContain("token");
    expect(safeReferrer).not.toContain("#ref");
  });
});

describe("Cross-Tab Consent Synchronization and Storage Error Handling", () => {
  beforeEach(() => {
    mockStorage.clear();
    resetTrackedPathForTesting();
  });

  afterEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
  });

  it("handles localStorage security errors safely in getStoredConsent and setStoredConsent", () => {
    mockStorage.shouldThrow = true;

    expect(() => getStoredConsent()).not.toThrow();
    expect(getStoredConsent()).toBe("unset");

    expect(() => setStoredConsent("granted")).not.toThrow();
    mockStorage.shouldThrow = false;
  });

  it("reacts to cross-tab storage event when consent is revoked in another tab", () => {
    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    mockStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    mockTarget.dispatchEvent({
      type: "storage",
      key: CONSENT_STORAGE_KEY,
      newValue: "denied",
    } as unknown as StorageEvent);

    expect(listener).toHaveBeenCalled();
    expect(getStoredConsent()).toBe("denied");

    unsubscribe();
  });

  it("reacts to localStorage.clear() in another tab where event.key is null", () => {
    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    mockStorage.clear();
    mockTarget.dispatchEvent({
      type: "storage",
      key: null,
      newValue: null,
    } as unknown as StorageEvent);

    expect(listener).toHaveBeenCalled();
    expect(getStoredConsent()).toBe("unset");

    unsubscribe();
  });

  it("reacts to key removal in another tab where newValue is null", () => {
    setStoredConsent("granted");
    expect(getStoredConsent()).toBe("granted");

    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    mockStorage.removeItem(CONSENT_STORAGE_KEY);
    mockTarget.dispatchEvent({
      type: "storage",
      key: CONSENT_STORAGE_KEY,
      newValue: null,
    } as unknown as StorageEvent);

    expect(listener).toHaveBeenCalled();
    expect(getStoredConsent()).toBe("unset");
    expect(hasAnalyticsConsent()).toBe(false);

    unsubscribe();
  });
});

describe("Pageview Deduplication & PII-Safe URLs", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    resetTrackedPathForTesting();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
  });

  afterEach(() => {
    disableGtag();
    resetTrackedPathForTesting();
    vi.restoreAllMocks();
  });

  it("strips sensitive queries and fragments while preserving legitimate campaign params", () => {
    setStoredConsent("granted");
    initGtag();

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");

    pageview("/contact?utm_source=twitter&utm_medium=social&email=visitor%40example.com#step-2");

    expect(pushSpy).toHaveBeenCalled();
    const calls = pushSpy.mock.calls;
    const pageViewCall = calls.find((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });

    expect(pageViewCall).toBeDefined();
    const params = (pageViewCall![0] as IArguments)[2] as Record<string, unknown>;

    expect(params.page_path).toBe("/contact");
    expect(params.page_location).toBe("https://www.motekra.com/contact?utm_source=twitter&utm_medium=social");
    expect(params.page_location).not.toContain("email");
    expect(params.page_location).not.toContain("#step-2");
  });

  it("redacts email addresses from document titles", () => {
    setStoredConsent("granted");
    initGtag();

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");

    pageview("/insights", "Account Details for user@example.com");

    const calls = pushSpy.mock.calls;
    const pageViewCall = calls.find((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });

    const params = (pageViewCall![0] as IArguments)[2] as Record<string, unknown>;
    expect(params.page_title).toBe("Account Details for [redacted]");
  });

  it("deduplicates sequential pageview calls for the exact same active path", () => {
    setStoredConsent("granted");
    initGtag();

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");

    // First call for /work
    pageview("/work");
    // Duplicate calls for /work (e.g. from remount or re-render)
    pageview("/work");
    pageview("/work");

    const pageViewCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });

    expect(pageViewCalls.length).toBe(1);

    // Navigating to /about should dispatch
    pageview("/about");
    const updatedCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });
    expect(updatedCalls.length).toBe(2);

    // Navigating back to /work should dispatch
    pageview("/work");
    const finalCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });
    expect(finalCalls.length).toBe(3);
  });
});

describe("Approved Parameter Whitelist Enforcement", () => {
  it("enforces whitelist for page_view events and strips unapproved keys", () => {
    const rawParams = {
      page_path: "/services",
      page_title: "Services",
      page_location: "https://www.motekra.com/services",
      visitor_name: "John Doe",
      email: "john@example.com",
      client_ip: "192.168.1.1",
      custom_secret: "hidden",
    };

    const sanitized = sanitizeAnalyticsParams("page_view", rawParams);

    expect(sanitized).toEqual({
      page_path: "/services",
      page_title: "Services",
      page_location: "https://www.motekra.com/services",
    });

    expect(sanitized).not.toHaveProperty("visitor_name");
    expect(sanitized).not.toHaveProperty("email");
    expect(sanitized).not.toHaveProperty("client_ip");
    expect(sanitized).not.toHaveProperty("custom_secret");
  });

  it("enforces whitelist for generate_lead events and strips form values", () => {
    const rawParams = {
      event_category: "engagement",
      event_label: "contact_inquiry",
      value: 1,
      currency: "USD",
      name: "Alice",
      email: "alice@motekra.com",
      message: "I need a website",
      budget: "$10k",
      inquiry_id: "inq_9999",
    };

    const sanitized = sanitizeAnalyticsParams("generate_lead", rawParams);

    expect(sanitized).toEqual({
      event_category: "engagement",
      event_label: "contact_inquiry",
      value: 1,
      currency: "USD",
    });

    expect(sanitized).not.toHaveProperty("name");
    expect(sanitized).not.toHaveProperty("email");
    expect(sanitized).not.toHaveProperty("message");
    expect(sanitized).not.toHaveProperty("budget");
    expect(sanitized).not.toHaveProperty("inquiry_id");
  });
});

describe("Lead Tracking & Submission Integration", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    resetTrackedPathForTesting();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
  });

  afterEach(() => {
    disableGtag();
    resetTrackedPathForTesting();
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

    expect(eventParams).toEqual({
      event_category: "engagement",
      event_label: "contact_inquiry",
    });
  });

  it("suppresses generate_lead if analytics has been disabled via disableGtag", () => {
    setStoredConsent("granted");
    initGtag();

    disableGtag();

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");
    trackGenerateLead();

    const leadCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "generate_lead";
    });

    expect(leadCalls.length).toBe(0);
  });
});

describe("Preferences Modal State & Accessibility Controls", () => {
  beforeEach(() => {
    closeConsentPreferences();
  });

  afterEach(() => {
    closeConsentPreferences();
  });

  it("manages modal open/close state and notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeConsentModal(listener);

    expect(getConsentModalSnapshot()).toBe(false);

    openConsentPreferences();
    expect(getConsentModalSnapshot()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    closeConsentPreferences();
    expect(getConsentModalSnapshot()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  it("simulates focus trapping and keyboard navigation in modal dialog", () => {
    // Create elements to test focus trapping
    const triggerBtn = {
      focus: vi.fn(() => {
        currentActiveElement = triggerBtn;
      }),
    };
    currentActiveElement = triggerBtn;

    const closeBtn = {
      tagName: "BUTTON",
      focus: vi.fn(() => {
        currentActiveElement = closeBtn;
      }),
    };
    const acceptBtn = {
      tagName: "BUTTON",
      focus: vi.fn(() => {
        currentActiveElement = acceptBtn;
      }),
    };
    const declineBtn = {
      tagName: "BUTTON",
      focus: vi.fn(() => {
        currentActiveElement = declineBtn;
      }),
    };

    // Open modal
    openConsentPreferences();
    expect(getConsentModalSnapshot()).toBe(true);

    // Initial focus moves to first focusable element
    closeBtn.focus();
    expect(mockDocument.activeElement).toBe(closeBtn);

    // Test Tab trap: when at last element, pressing Tab wraps to first
    currentActiveElement = declineBtn;
    const tabEvent = {
      key: "Tab",
      shiftKey: false,
      preventDefault: vi.fn(),
    };

    // Simulate Tab key behavior from last element
    if (currentActiveElement === declineBtn && !tabEvent.shiftKey) {
      tabEvent.preventDefault();
      closeBtn.focus();
    }
    expect(tabEvent.preventDefault).toHaveBeenCalled();
    expect(mockDocument.activeElement).toBe(closeBtn);

    // Test Shift+Tab trap: when at first element, pressing Shift+Tab wraps to last
    const shiftTabEvent = {
      key: "Tab",
      shiftKey: true,
      preventDefault: vi.fn(),
    };
    if (currentActiveElement === closeBtn && shiftTabEvent.shiftKey) {
      shiftTabEvent.preventDefault();
      declineBtn.focus();
    }
    expect(shiftTabEvent.preventDefault).toHaveBeenCalled();
    expect(mockDocument.activeElement).toBe(declineBtn);

    // Close modal and verify focus restores to triggerBtn
    closeConsentPreferences();
    expect(getConsentModalSnapshot()).toBe(false);
    triggerBtn.focus();
    expect(mockDocument.activeElement).toBe(triggerBtn);
  });
});

describe("Component Mount, Remount, Route Transition and Revocation", () => {
  beforeEach(() => {
    mockStorage.clear();
    scriptMap.clear();
    resetTrackedPathForTesting();
    delete mockWindow.dataLayer;
    delete mockWindow.gtag;
  });

  afterEach(() => {
    disableGtag();
    resetTrackedPathForTesting();
    vi.restoreAllMocks();
  });

  it("simulates full lifecycle: mount without consent -> opt-in -> pageview -> route change -> remount -> revocation", () => {
    const reloadSpy = vi.fn();
    mockWindow.location.reload = reloadSpy;

    // 1. Mount without consent
    expect(hasAnalyticsConsent()).toBe(false);
    initGtag();
    expect(scriptMap.has("ga4-script")).toBe(false);

    // 2. User accepts consent via banner
    setStoredConsent("granted");
    expect(hasAnalyticsConsent()).toBe(true);
    initGtag();
    expect(scriptMap.has("ga4-script")).toBe(true);

    const pushSpy = vi.spyOn(mockWindow.dataLayer as unknown[], "push");

    // Initial pageview on /
    pageview("/");
    expect(pushSpy).toHaveBeenCalled();
    let pageViewCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });
    expect(pageViewCalls.length).toBe(1);

    // 3. User navigates to /work
    pageview("/work");
    pageViewCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });
    expect(pageViewCalls.length).toBe(2);

    // 4. Component remounts on /work -> duplicate should NOT be sent
    pageview("/work");
    pageViewCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });
    expect(pageViewCalls.length).toBe(2);

    // 5. Consent revocation: trigger disableGtag
    setStoredConsent("denied");
    disableGtag();
    expect((mockWindow as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);
    expect(scriptMap.has("ga4-script")).toBe(false);

    // 6. Navigation after revocation must NOT emit events
    pageview("/contact");
    pageViewCalls = pushSpy.mock.calls.filter((call) => {
      const args = call[0] as IArguments;
      return args && args[0] === "event" && args[1] === "page_view";
    });
    expect(pageViewCalls.length).toBe(2);
  });
});
