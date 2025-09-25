export interface PortfolioRunRequest {
  batchId: string;
  totalCapital: number;
  currency: string;
  dateRange: [string | null, string | null];
}

export interface PortfolioMetric {
  label: string;
  value: number | string;
  format?: "number" | "percent" | "currency";
}

export interface PortfolioSection {
  metrics: PortfolioMetric[];
}

export interface PortfolioRunResponse {
  sections: {
    performance: PortfolioSection;
    tradesAnalysis: PortfolioSection;
    riskRatios: PortfolioSection;
  };
  tradesTable: Array<Record<string, unknown>>;
}