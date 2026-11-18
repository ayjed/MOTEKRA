"use client";

import { openConsentPreferences } from "@/lib/analytics/consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="footer-cookie-btn"
      onClick={openConsentPreferences}
      aria-haspopup="dialog"
    >
      Cookie Preferences
    </button>
  );
}
