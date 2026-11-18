/**
 * MOTEKRA Analytics Consent Management
 *
 * Implements Basic Consent Mode with explicit opt-in.
 * - No tracking scripts or requests are permitted before explicit consent.
 * - Choices ('granted' | 'denied') are stored in localStorage.
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
    if (val === "granted" || val === "denied") {
      return val;
    }
  } catch {
    // localStorage may be restricted in private/incognito contexts
  }
  return "unset";
}

export function setStoredConsent(choice: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: { choice } }));
  } catch {
    // Ignore storage write errors
  }
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === "granted";
}

export function onConsentChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback();
  };

  window.addEventListener(CONSENT_EVENT_NAME, handler);
  return () => {
    window.removeEventListener(CONSENT_EVENT_NAME, handler);
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
