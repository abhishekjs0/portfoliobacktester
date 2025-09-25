import type { PortfolioMetric, PortfolioRunRequest } from "../types/api";

export type PortfolioRunResponse = {
  sections: {
    performance: { metrics: PortfolioMetric[] };
    tradesAnalysis: { metrics: PortfolioMetric[] };
    riskRatios: { metrics: PortfolioMetric[] };
  };
  tradesTable: Record<string, unknown>[]; // TODO: Define proper trade type
};

export type RunPortfolioPayload = PortfolioRunRequest;
export type BillingInterval = "monthly" | "annual";
export type CheckoutSessionPayload = {
  plan: string;
  interval: BillingInterval;
};

export async function runPortfolio(
  payload: RunPortfolioPayload,
): Promise<PortfolioRunResponse> {
  void payload;

  const demoMetrics: PortfolioMetric[] = [
    { label: "Total Return", value: 12.5, format: "percent" },
    { label: "Max Drawdown", value: -8.3, format: "percent" },
    { label: "Win Rate", value: 65.2, format: "percent" },
  ];

  return {
    sections: {
      performance: { metrics: demoMetrics },
      tradesAnalysis: { metrics: demoMetrics },
      riskRatios: { metrics: demoMetrics },
    },
    tradesTable: [],
  };
}

export async function submitFeedback(feedback: unknown): Promise<unknown> {
  void feedback;

  return {};
}

export async function submitNpsResponse(payload: unknown): Promise<unknown> {
  void payload;

  return {};
}

export async function createCheckoutSession(
  payload: CheckoutSessionPayload,
): Promise<{ sessionId?: string; url?: string }> {
  void payload;

  return {};
}

export async function uploadFiles(
  files: File[],
): Promise<{ files: File[]; batchId: string }> {
  // TODO: implement upload logic
  return { files, batchId: "" };
}

export function trackEvent(event: string, data?: unknown): void {
  void event;
  void data;
  // TODO: implement event tracking
}
