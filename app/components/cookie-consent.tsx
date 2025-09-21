"use client";

import { useEffect, useState } from "react";
import { ANALYTICS_CONSENT_KEY } from "../lib/constants";

type ConsentPayload = {
  analytics: boolean;
  updatedAt: string;
};

function readStoredConsent(): ConsentPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentPayload;
  } catch {
    return null;
  }
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setAnalyticsOptIn(stored.analytics);
      if (stored.analytics) {
        const event = new CustomEvent<ConsentPayload>("analytics-consent", { detail: stored });
        window.dispatchEvent(event);
      }
      return;
    }
    setIsVisible(true);
  }, []);

  const handleSave = () => {
    const payload: ConsentPayload = {
      analytics: analyticsOptIn,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, JSON.stringify(payload));
    setIsVisible(false);
    const event = new CustomEvent<ConsentPayload>("analytics-consent", { detail: payload });
    window.dispatchEvent(event);
  };

  const handleReject = () => {
    const payload: ConsentPayload = { analytics: false, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, JSON.stringify(payload));
    setIsVisible(false);
    const event = new CustomEvent<ConsentPayload>("analytics-consent", { detail: payload });
    window.dispatchEvent(event);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-labelledby="cookie-title">
      <div>
        <h2 id="cookie-title">Cookies & consent</h2>
        <p id="cookie-description">
          We only enable analytics cookies when you opt in. Functional cookies are not used on this page.
        </p>
        <div className="cookie-toggle">
          <input
            type="checkbox"
            id="analytics-consent"
            checked={analyticsOptIn}
            onChange={(event) => setAnalyticsOptIn(event.target.checked)}
            aria-describedby="cookie-description"
          />
          <label htmlFor="analytics-consent">Allow anonymous usage analytics</label>
        </div>
      </div>
      <div className="cookie-actions">
        <button type="button" className="cookie-button secondary" onClick={handleReject}>
          Reject
        </button>
        <button type="button" className="cookie-button" onClick={handleSave}>
          Save preferences
        </button>
      </div>
    </div>
  );
}
