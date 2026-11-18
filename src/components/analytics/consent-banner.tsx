"use client";

import { useState, useSyncExternalStore } from "react";
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

  if (!isHydrated) {
    return null;
  }

  const isOpen = isModalOpen || consent === "unset";
  if (!isOpen) {
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
            We use privacy-conscious Google Analytics cookies to measure
            aggregate website traffic and evaluate how visitors discover our work.
            No tracking occurs without your permission.
          </p>

          {showDetails && (
            <div className="consent-disclosure" id="consent-disclosure-panel">
              <h4>What We Collect With Your Consent:</h4>
              <ul>
                <li>Anonymized page views and general interaction statistics.</li>
                <li>Device, browser, and approximate geographic location (city level).</li>
                <li>
                  An anonymous lead event when a contact inquiry is successfully sent.
                </li>
              </ul>
              <h4>What We Never Collect:</h4>
              <ul>
                <li>Your name, email address, phone number, or inquiry message.</li>
                <li>Contact reference IDs, personal identifiers, or IP addresses.</li>
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
