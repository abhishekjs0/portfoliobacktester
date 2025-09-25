import type { 
  PortfolioRunRequest,
  PortfolioMetric
} from "../types/api";

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

export function runPortfolio(_payload: RunPortfolioPayload): Promise<PortfolioRunResponse> {
	// TODO: implement portfolio logic
	const demoMetrics: PortfolioMetric[] = [
		{ label: "Total Return", value: 12.5, format: "percent" },
		{ label: "Max Drawdown", value: -8.3, format: "percent" },
		{ label: "Win Rate", value: 65.2, format: "percent" }
	];

	return Promise.resolve({
		sections: {
			performance: { metrics: demoMetrics },
			tradesAnalysis: { metrics: demoMetrics },
			riskRatios: { metrics: demoMetrics }
		},
		tradesTable: []
	});
}

export function submitFeedback(_: unknown): Promise<unknown> {
	// TODO: implement feedback logic
	return Promise.resolve({});
}

export function submitNpsResponse(_: unknown): Promise<unknown> {
	// TODO: implement NPS response logic
	return Promise.resolve({});
}

export function createCheckoutSession(_: CheckoutSessionPayload): Promise<{ sessionId?: string; url?: string }> {
	// TODO: implement checkout session logic
	return Promise.resolve({});
}

export function uploadFiles(files: File[]): Promise<{ files: File[]; batchId: string }> {
	// TODO: implement upload logic
	return Promise.resolve({ files, batchId: "" });
}

export function trackEvent(_event: string, _data?: unknown): void {
	// TODO: implement event tracking
}