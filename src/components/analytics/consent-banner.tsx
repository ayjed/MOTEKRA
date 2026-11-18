"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getStoredConsent,
  setStoredConsent,
  onConsentChange,
  closeConsentPreferences,
  subscribeConsentModal,
  getConsentModalSnapshot,
} from "@/lib/analytics/consent";
import "@/styles/consent.css";

const emptySubscribe = () => () => {};

export function ConsentBanner() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const consent = useSyncExternalStore(onConsentChange, getStoredConsent, () => "unset");
  const isModalOpen = useSyncExternalStore(subscribeConsentModal, getConsentModalSnapshot, () => false);
  const [showDetails, setShowDetails] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap, Escape key handling, and background lock for modal dialog
  useEffect(() => {
    if (!isModalOpen) return;

    // 1. Capture previously focused element to restore upon close
    if (typeof document !== "undefined") {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
    }

    // 2. Move focus into the dialog
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0]?.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 20);

    // 3. Trap Tab and Shift+Tab navigation, handle Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeConsentPreferences();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      // 4. Restore focus to the trigger element
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
        previousActiveElement.current.focus();
      }
    };
  }, [isModalOpen]);

  if (!isHydrated) {
    return null;
  }

  const handleAccept = () => {
    setStoredConsent("granted");
    closeConsentPreferences();
    setShowDetails(false);
  };

  const handleDecline = () => {
    setStoredConsent("denied");
    closeConsentPreferences();
    setShowDetails(false);
  };

  // Render Preferences Modal Dialog when opened from footer
  if (isModalOpen) {
    return (
      <div
        className="consent-modal-overlay"
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeConsentPreferences();
        }}
      >
        <div
          ref={modalRef}
          className="consent-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
          aria-describedby="consent-modal-desc"
          tabIndex={-1}
        >
          <div className="consent-modal-header">
            <h3 id="consent-modal-title" className="consent-modal-title">
              Analytics & Cookie Preferences
            </h3>
            <button
              type="button"
              className="consent-modal-close"
              onClick={closeConsentPreferences}
              aria-label="Close preferences dialog"
            >
              ✕
            </button>
          </div>

          <div id="consent-modal-desc" className="consent-modal-body">
            <p className="consent-status-badge">
              Current status:{" "}
              <strong
                className={
                  consent === "granted"
                    ? "status-granted"
                    : consent === "denied"
                    ? "status-denied"
                    : "status-unset"
                }
              >
                {consent === "granted"
                  ? "Active (Opted In)"
                  : consent === "denied"
                  ? "Disabled (Opted Out)"
                  : "Not yet chosen"}
              </strong>
            </p>

            <p className="consent-text">
              We use Google Analytics 4 in Basic Consent Mode to gather
              aggregate insights into visitor traffic and site performance.
              No tracking code or network requests run without your explicit consent.
            </p>

            <div className="consent-disclosure-section">
              <h4>What We Process With Your Consent:</h4>
              <ul>
                <li>Aggregate page views, navigational flows, and session durations.</li>
                <li>
                  Technical browser, device, and network data processed by Google
                  to derive coarse geographic region (e.g. city level). Google
                  states that Google Analytics 4 does not log or store individual IP addresses.
                </li>
                <li>
                  Legitimate marketing campaign attribution (e.g. UTM parameters),
                  while completely stripping personal or sensitive URL queries.
                </li>
                <li>
                  An anonymous lead event when a contact form is successfully sent,
                  excluding all contact details.
                </li>
              </ul>

              <h4>What We Never Collect:</h4>
              <ul>
                <li>Your name, email address, phone number, or inquiry message.</li>
                <li>Contact reference IDs, personal authentication tokens, or form inputs.</li>
                <li>
                  Advertising personalization, cross-site remarketing, and Google
                  signals are explicitly disabled.
                </li>
              </ul>
            </div>
          </div>

          <div className="consent-modal-footer">
            <div className="consent-actions">
              {consent !== "granted" ? (
                <button
                  type="button"
                  className="button button-primary consent-btn-accept"
                  onClick={handleAccept}
                >
                  <span>Accept Analytics</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-secondary consent-btn-decline"
                  onClick={handleDecline}
                >
                  <span>Revoke / Disable Analytics</span>
                </button>
              )}
              {consent === "granted" && (
                <button
                  type="button"
                  className="button button-primary consent-btn-accept"
                  onClick={closeConsentPreferences}
                >
                  <span>Keep Active</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Initial Floating Banner if choice has not been made yet
  if (consent !== "unset") {
    return null;
  }

  return (
    <aside
      className="consent-banner-wrapper"
      role="region"
      aria-label="Privacy and Cookie Preferences"
    >
      <div className="consent-banner-card">
        <div className="consent-content">
          <p className="consent-eyebrow">Privacy & Analytics</p>
          <p className="consent-text">
            With your permission, we use Google Analytics to measure aggregate
            traffic and evaluate site performance. Google Analytics processes
            technical network and browser metadata to derive coarse location;
            Google states it does not log or store individual IP addresses.
            No tracking occurs unless you opt in.
          </p>

          {showDetails && (
            <div
              className="consent-disclosure"
              id="consent-disclosure-panel"
            >
              <h4>What We Process With Your Consent:</h4>
              <ul>
                <li>Aggregated page views and navigation metrics.</li>
                <li>
                  Technical browser and network metadata to estimate coarse geographic
                  region. Google states it does not log or store individual IP addresses.
                </li>
                <li>
                  Legitimate marketing campaign attribution (e.g. UTM parameters),
                  while completely stripping personal or sensitive URL queries.
                </li>
                <li>
                  An anonymous lead event when an inquiry form is successfully sent.
                </li>
              </ul>
              <h4>What We Never Collect:</h4>
              <ul>
                <li>Names, emails, phone numbers, or free-text inquiry messages.</li>
                <li>
                  Advertising personalization, cross-site remarketing, and Google signals
                  are explicitly disabled.
                </li>
              </ul>
              <p className="consent-subnote">
                You can change or withdraw your choice at any time using the
                &ldquo;Cookie Preferences&rdquo; link in the footer.
              </p>
            </div>
          )}
        </div>

        <div className="consent-controls">
          <div className="consent-actions">
            <button
              type="button"
              className="button button-primary consent-btn-accept"
              onClick={handleAccept}
            >
              <span>Accept Analytics</span>
            </button>
            <button
              type="button"
              className="button button-secondary consent-btn-decline"
              onClick={handleDecline}
            >
              <span>Decline</span>
            </button>
          </div>

          <button
            type="button"
            className="consent-toggle-details"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls="consent-disclosure-panel"
          >
            {showDetails ? "Hide Details ↑" : "Cookie Details & Privacy ↓"}
          </button>
        </div>
      </div>
    </aside>
  );
}
