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
  sections: Record<string, { title: string; metrics: Array<Record<string, unknown>> }>;
  tradesTable: Array<Record<string, unknown>>;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/proxy/").replace(/\/*$/, "/");

export interface ParsedFileSummary {
  fileName: string;
  sampleCount: number;
  meanReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  priceColumn: string | null;
}

export async function uploadFiles(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_BASE}api/uploads`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error((await res.json()).detail ?? "Upload failed");
  }
  return res.json();
}

export interface RunPortfolioPayload {
  batchId: string;
  totalCapital: number;
  currency: string;
  dateRange?: [string | null, string | null];
}

export async function runPortfolio(payload: RunPortfolioPayload): Promise<PortfolioRunResponse> {
  const res = await fetch(`${API_BASE}api/portfolio/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error((await res.json()).detail ?? "Portfolio run failed");
  }
  return res.json();
}

export async function getPortfolioRuns(batchId: string): Promise<PortfolioRunResponse[]> {
  const res = await fetch(`${API_BASE}api/portfolio/${batchId}`);
  if (!res.ok) {
    throw new Error("Unable to fetch runs");
  }
  return res.json();
}

export async function shareParsedSummary(summaries: ParsedFileSummary[]): Promise<void> {
  if (summaries.length === 0) return;
  await fetch("/api/uploads/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summaries }),
    keepalive: true,
  });
}

export async function trackEvent(name: string, details: Record<string, unknown> = {}): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: name, details, url: typeof window === "undefined" ? undefined : window.location.pathname }),
      keepalive: true,
    });
  } catch (error) {
    console.debug("analytics event skipped", error);
  }
}
