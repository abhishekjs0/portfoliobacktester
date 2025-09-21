export interface UploadResponse {
  batchId: string;
  files: Array<{
    fileId: string;
    ticker: string;
    strategy: string;
    exportDate: string;
    rows: number;
  }>;
}

export interface PortfolioRunResponse {
  equityCurve: Array<{ timestamp: string; value: number }>;
  buyHoldCurve: Array<{ timestamp: string; value: number }>;
  drawdown: Array<{ timestamp: string; value: number }>;
  kpis: Record<string, number>;
  sections: Record<
    string,
    { title: string; metrics: Array<Record<string, unknown>> }
  >;
  tradesTable: Array<Record<string, unknown>>;
}


export interface ParsedFileSummary {
  fileName: string;
  // API base URL and types
  export type BillingInterval = "monthly" | "annual";
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/proxy/").replace(/\/*$/, "/");

  export interface CheckoutSessionPayload {
    plan: string;
    interval: BillingInterval;
  }

  export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
  }

  export async function createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> {
    const res = await fetch(`${API_BASE}api/billing/checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error((await res.json()).detail ?? "Unable to start checkout");
    }
    return res.json();
  }

  export interface FeedbackPayload {
    message: string;
    email?: string;
  }

  export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
    const res = await fetch(`${API_BASE}api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error((await res.json()).detail ?? "Unable to send feedback");
    }
  }

  export interface NpsPayload {
    score: number;
    comment?: string;
  }

  export async function submitNpsResponse(payload: NpsPayload): Promise<void> {
    const res = await fetch(`${API_BASE}api/feedback/nps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error((await res.json()).detail ?? "Unable to record response");
    }
  }
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> {
  const res = await fetch(`${API_BASE}api/billing/checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error((await res.json()).detail ?? "Unable to start checkout");
  }
  return res.json();
}

export interface FeedbackPayload {
  message: string;
  email?: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const res = await fetch(`${API_BASE}api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error((await res.json()).detail ?? "Unable to send feedback");
  }
}

export interface NpsPayload {
  score: number;
  comment?: string;
}

export async function submitNpsResponse(payload: NpsPayload): Promise<void> {
  const res = await fetch(`${API_BASE}api/feedback/nps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error((await res.json()).detail ?? "Unable to record response");
>>>>>>> origin/main
  }
}
