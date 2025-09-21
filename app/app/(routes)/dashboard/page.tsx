"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NpsModal } from "../../../components/nps-modal";
import { OnboardingChecklist } from "../../../components/onboarding-checklist";
import { DateRangePicker } from "../../../components/date-range-picker";
import { EquityChart } from "../../../components/equity-chart";
import { FileTable } from "../../../components/file-table";
import { KPITile } from "../../../components/kpi-tile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { PortfolioRunResponse, runPortfolio } from "../../../lib/api";
import { completeChecklistStep } from "../../../lib/checklist";
import { trackEvent } from "../../../lib/analytics";
import { usePlan } from "../../../lib/use-plan";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId");
  const welcomeName = searchParams.get("welcome");
  const { plan } = usePlan();
  const isFreePlan = plan === "free";
  const [capital, setCapital] = useState(100_000);
  const [currency, setCurrency] = useState("USD");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [data, setData] = useState<PortfolioRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!batchId) return;
    setIsLoading(true);
    setError(null);
    try {
      trackEvent("portfolio_run_requested", { plan });
      const payload = {
        batchId,
        totalCapital: capital,
        currency,
        dateRange: [dateRange.start?.toISOString() ?? null, dateRange.end?.toISOString() ?? null] as [string | null, string | null],
      };
      const response = await runPortfolio(payload);
      setData(response);
      completeChecklistStep("run-backtest");
      completeChecklistStep("view-metrics");
      trackEvent("portfolio_run_completed", { plan });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  const overviewMetrics = useMemo(() => data?.sections?.overview?.metrics ?? [], [data]);
  const additionalKPIs = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Annualized P&L %", value: data.kpis["annualized_return_pct"], format: "percent" as const },
      { label: "Total trade-days", value: data.kpis["total_trade_days"], format: "raw" as const },
      { label: "Avg trade duration (days)", value: data.kpis["avg_trade_duration_days"], format: "raw" as const },
    ];
  }, [data]);

  return (
    <>
      <NpsModal />
      <div className="px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Portfolio dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Equal-capital aggregation across tickers with TradingView-style analytics.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <DateRangePicker onChange={setDateRange} />
            <button
              onClick={fetchData}
              disabled={!batchId || isLoading || (isFreePlan && !!data)}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isLoading ? "Running…" : "Run backtest"}
            </button>
          </div>
        </div>

        {welcomeName && (
          <div className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200" role="status">
            Welcome aboard, {welcomeName}! Upload a CSV to start analysing your portfolio.
          </div>
        )}

        {isFreePlan && (
          <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            Free accounts can explore one simulated run. Upgrade on the pricing page to unlock unlimited reruns, risk ratios,
            and premium analytics.
          </p>
        )}

        <div className="mt-6">
          <OnboardingChecklist />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="tv-card p-5">
            <label className="tv-subtle">Total capital</label>
            <input
              type="number"
              value={capital}
              onChange={(event) => setCapital(Number(event.target.value))}
              className="mt-2 w-full rounded-md border border-white/10 bg-slate-900/80 px-3 py-2 text-white focus:border-brand focus:outline-none"
            />
          </div>
          <div className="tv-card p-5">
            <label className="tv-subtle">Currency</label>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-slate-900/80 px-3 py-2 text-white focus:border-brand focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="tv-card p-5">
            <label className="tv-subtle">Upload</label>
            <div className="mt-2 text-sm text-slate-200">Batch ID: {batchId ?? "–"}</div>
          </div>
        </div>

      {error && <div className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      {data && (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="tv-heading">Overview</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {overviewMetrics.map((metric) => (
                <KPITile
                  key={metric.label as string}
                  label={metric.label as string}
                  value={Number(metric.value)}
                  format={metric.label?.toString().includes("%") ? "percent" : metric.label?.toString().includes("P&L") ? "currency" : "raw"}
                  currency={currency}
                />
              ))}
              {additionalKPIs.map((metric) => (
                <KPITile key={metric.label} label={metric.label} value={metric.value} format={metric.format} />
              ))}
            </div>
          </section>

          <EquityChart equityCurve={data.equityCurve} drawdown={data.drawdown} />

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trades">Trades analysis</TabsTrigger>
              <TabsTrigger value="risk" disabled={isFreePlan} className={isFreePlan ? "opacity-60" : undefined}>
                Risk/performance ratios
              </TabsTrigger>
              <TabsTrigger value="table">List of trades</TabsTrigger>
            </TabsList>
            <TabsContent value="performance">
              <MetricGrid metrics={data.sections.performance.metrics} currency={currency} />
            </TabsContent>
            <TabsContent value="trades">
              <MetricGrid metrics={data.sections.tradesAnalysis.metrics} currency={currency} />
            </TabsContent>
            <TabsContent value="risk">
              {isFreePlan ? (
                <div className="tv-card p-6 text-sm text-slate-200">
                  Upgrade to Standard or Pro to unlock correlation, volatility clusters, and tail risk ratios.
                </div>
              ) : (
                <MetricGrid metrics={data.sections.riskRatios.metrics} currency={currency} />
              )}
            </TabsContent>
            <TabsContent value="table">
              <FileTable trades={data.tradesTable} />
            </TabsContent>
          </Tabs>
        </div>
      )}
      </div>
    </>
  );
}

type MetricGridProps = {
  metrics: Array<Record<string, unknown>>;
  currency: string;
};

function MetricGrid({ metrics, currency }: MetricGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const label = metric.label as string;
        const value = Number(metric.value ?? 0);
        const lower = label.toLowerCase();
        const display = lower.includes("%")
          ? formatPercent(value)
          : lower.includes("p&l") || lower.includes("profit") || lower.includes("loss")
          ? formatCurrency(value, currency)
          : value.toLocaleString();
        return (
          <div key={label} className="tv-card p-4">
            <div className="text-sm text-slate-400">{label}</div>
            <div className="mt-1 text-xl font-semibold text-white">{display}</div>
          </div>
        );
      })}
    </div>
  );
}
