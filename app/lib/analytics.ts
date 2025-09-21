"use client";

interface AnalyticsPayload {
  [key: string]: unknown;
}

const ANALYTICS_ENDPOINT = "/api/proxy/api/analytics/events";

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const body = JSON.stringify({ event: eventName, payload, timestamp: new Date().toISOString() });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
      return;
    }
  } catch (error) {
    console.warn("analytics beacon failed", error);
  }

  void fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch((error) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("analytics request failed", error);
    }
  });
}
