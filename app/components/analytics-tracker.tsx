"use client";

import { useEffect } from "react";
import { ANALYTICS_CONSENT_KEY } from "../lib/constants";
import { trackEvent } from "../lib/api";

type ConsentPayload = {
  analytics: boolean;
  updatedAt: string;
};

function hasAnalyticsConsent(): boolean {
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as ConsentPayload;
    return Boolean(parsed.analytics);
  } catch {
    return false;
  }
}

export function AnalyticsTracker() {
  useEffect(() => {
    let enabled = false;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const actionable = target?.closest<HTMLElement>("[data-analytics-event]");
      if (!actionable) {
        return;
      }
      const name = actionable.getAttribute("data-analytics-event") ?? "interaction";
      void trackEvent(name, { label: actionable.textContent?.trim() });
    };

    const start = () => {
      if (enabled) return;
      enabled = true;
      void trackEvent("page_view");
      document.addEventListener("click", handleClick, true);
    };

    const stop = () => {
      if (!enabled) return;
      enabled = false;
      document.removeEventListener("click", handleClick, true);
    };

    if (hasAnalyticsConsent()) {
      start();
    }

    const handleConsent = (event: Event) => {
      const detail = (event as CustomEvent<ConsentPayload>).detail;
      if (detail?.analytics) {
        start();
      } else {
        stop();
      }
    };

    window.addEventListener("analytics-consent", handleConsent);

    return () => {
      window.removeEventListener("analytics-consent", handleConsent);
      stop();
    };
  }, []);

  return null;
}
