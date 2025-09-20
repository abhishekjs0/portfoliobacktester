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
