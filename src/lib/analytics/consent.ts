/**
 * MOTEKRA Analytics Consent Management
 *
 * Implements Basic Consent Mode with explicit opt-in.
 * - No tracking scripts or requests are permitted before explicit consent.
 * - Choices ('granted' | 'denied') are stored in localStorage.
 * - Cross-tab synchronization via browser 'storage' event.
 * - Handles key removal and localStorage.clear() across tabs.
 * - Synchronizes state with React components via useSyncExternalStore.
 */

export type ConsentChoice = "granted" | "denied" | "unset";

export const CONSENT_STORAGE_KEY = "motekra_analytics_consent";
export const CONSENT_EVENT_NAME = "motekra:consent-change";

let isModalOpen = false;
const modalListeners = new Set<() => void>();

export function getStoredConsent(): ConsentChoice {
  if (typeof window === "undefined") return "unset";
  try {
    const val = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (val === "granted") {
      return "granted";
    }
    if (val === "denied") {
      return "denied";
    }
  } catch {
    // localStorage may be restricted in private/incognito contexts or iframes
  }
  return "unset";
}

export function setStoredConsent(choice: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Handle QuotaExceededError or SecurityError safely
  }

  // Dispatch local custom event for current window
  try {
    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT_NAME, { detail: { choice } })
    );
  } catch {
    // Fallback if CustomEvent is not supported
  }
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === "granted";
}

/**
 * Subscribes to consent state changes in both the current window
 * and across browser tabs via the 'storage' event.
 * Handles item updates, key removal, and localStorage.clear() (where event.key === null).
 */
export function onConsentChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const localHandler = () => {
    callback();
  };

  const storageHandler = (event: StorageEvent) => {
    // event.key === null occurs when localStorage.clear() is invoked in another tab
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) {
      callback();
    }
  };

  window.addEventListener(CONSENT_EVENT_NAME, localHandler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(CONSENT_EVENT_NAME, localHandler);
    window.removeEventListener("storage", storageHandler);
  };
}

export function openConsentPreferences(): void {
  if (typeof window === "undefined") return;
  isModalOpen = true;
  modalListeners.forEach((listener) => listener());
}

export function closeConsentPreferences(): void {
  isModalOpen = false;
  modalListeners.forEach((listener) => listener());
}

export function subscribeConsentModal(listener: () => void): () => void {
  modalListeners.add(listener);
  return () => {
    modalListeners.delete(listener);
  };
}

export function getConsentModalSnapshot(): boolean {
  return isModalOpen;
}
