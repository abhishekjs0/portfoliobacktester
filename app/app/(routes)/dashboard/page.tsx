"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePlan } from "@/lib/use-plan";
import { trackEvent } from "@/lib/analytics";
import { runPortfolio } from "@/lib/api";
import { completeChecklistStep } from "@/lib/checklist";
import type { PortfolioMetric, PortfolioRunResponse } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NpsModal } from "@/components/nps-modal";
import { DateRangePicker } from "@/components/date-range-picker";
import { KPITile } from "@/components/kpi-tile";
import { FileTable } from "@/components/file-table";

type MetricGridProps = {
  metrics: PortfolioMetric[];
  currency: string;
};

function MetricGrid({ metrics, currency }: MetricGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        let numberValue = typeof metric.value === "string" 
          ? parseFloat(metric.value) 
          : metric.value;

        if (isNaN(numberValue)) {
          numberValue = 0;
        }

        const format = metric.format === "number" 
          ? "raw" 
          : (metric.format || "raw");

        return (
          <KPITile
            key={metric.label}
            label={metric.label}
            value={numberValue}
            format={format}
            currency={currency}
          />
        );
      })}
    </div>
  );
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId");
  const welcomeName = searchParams.get("welcome");
  const { plan } = usePlan();
  const isFreePlan = plan === "free";
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";
  const shouldGateResults = Boolean(batchId && !isAuthenticated && !isSessionLoading);

  const [capital] = useState(100_000);
  const [currency] = useState("USD");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [data, setData] = useState<PortfolioRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedRun, setHasCompletedRun] = useState(false);
  const [runsToday, setRunsToday] = useState(0);

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("backtestlab:runsToday");
      if (!stored) return;
      const parsed = JSON.parse(stored) as { date: string; count: number } | null;
      if (parsed && parsed.date === todayKey) {
        setRunsToday(parsed.count);
      }
    } catch (storageError) {
      console.warn("Unable to read run counter", storageError);
    }
  }, [todayKey]);

  const fetchData = async () => {
    if (!batchId) return;
    if (shouldGateResults) return;
    setIsLoading(true);
    setError(null);
    try {
      trackEvent("portfolio_run_requested", { plan });
      const payload = {
        batchId,
        totalCapital: capital,
        currency,
        dateRange: [
          dateRange.start?.toISOString() ?? null,
          dateRange.end?.toISOString() ?? null,
        ] as [string | null, string | null],
      };
      const response = await runPortfolio(payload);
      setData(response);
      completeChecklistStep("run-backtest");
      completeChecklistStep("view-metrics");
      trackEvent("portfolio_run_completed", { plan });
      setHasCompletedRun(true);
      setRunsToday((current) => {
        const next = current + 1;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "backtestlab:runsToday",
            JSON.stringify({ date: todayKey, count: next }),
          );
        }
        return next;
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasReachedFreeLimit = isFreePlan && runsToday >= 3;

  return (
    <>
      <NpsModal />
      {welcomeName && (
        <div
          role="status"
          className="mx-6 mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        >
          Welcome aboard, {welcomeName}! Your workspace is ready to start backtesting.
        </div>
      )}
      <div className="px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Portfolio dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Equal-capital aggregation across tickers with TradingView-style analytics.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="/upload"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-brand hover:text-brand"
            >
              Upload CSVs
            </Link>
            <DateRangePicker onChange={setDateRange} />
            <button
              onClick={fetchData}
              disabled={!batchId || isLoading || (isFreePlan && !!data) || shouldGateResults || isSessionLoading}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isLoading ? "Running…" : "Run portfolio backtest"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-900/50 p-4 text-red-200">
            {error}
          </div>
        )}

        {hasReachedFreeLimit && (
          <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100" role="status">
            You’ve reached 3 runs today. Upgrade to Trader for 50 daily runs.
          </div>
        )}

        {!data && !batchId && (
          <section className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-white/20 bg-slate-900/60">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="text-white/70"
              >
                <path
                  d="M8 24C8 21.7909 9.79086 20 12 20H20C22.2091 20 24 21.7909 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 16C13.2386 16 11 13.7614 11 11C11 8.23858 13.2386 6 16 6C18.7614 6 21 8.23858 21 11C21 13.7614 18.7614 16 16 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M6 6L26 26"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-white">No portfolio backtests yet</h2>
            <p className="mt-3 max-w-md text-sm text-slate-300">
              Upload your first TradingView exports to generate a combined equity curve, KPI tiles, and trade breakdowns.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
              >
                Upload CSVs
              </Link>
              <Link
                href="/guide"
                className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-brand hover:text-brand"
              >
                See How It Works
              </Link>
            </div>
          </section>
        )}

        {shouldGateResults && (
          <section className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/80 p-6">
              <div className="pointer-events-none absolute inset-0 bg-slate-900/80 backdrop-blur-sm" aria-hidden="true" />
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Preview locked</p>
                <p className="mt-3 text-lg font-semibold text-white">Combined equity curve</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="h-32 rounded-xl border border-white/10 bg-gradient-to-r from-slate-700/60 via-slate-600/40 to-slate-700/60" />
                  <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="h-3 rounded-full bg-slate-700/70" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-700/40" />
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {["Sharpe", "Drawdown", "Win rate", "CAGR"].map((label) => (
                        <div key={label} className="rounded-lg border border-white/10 bg-slate-900/60 p-3 text-center text-xs text-slate-400">
                          <p className="font-semibold text-white/80">{label}</p>
                          <p className="mt-1 font-mono text-sm text-white/60">•••</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Sign up to unlock your results</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Sign up or log in to see your combined equity curve and KPIs.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/signup?next=${encodeURIComponent(`/dashboard?batchId=${batchId ?? ""}`)}`}
                  className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
                >
                  Sign Up Free
                </Link>
                <Link
                  href={`/login?next=${encodeURIComponent(`/dashboard?batchId=${batchId ?? ""}`)}`}
                  className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-brand hover:text-brand"
                >
                  Log In
                </Link>
              </div>
            </div>
          </section>
        )}

        {data && !error && !shouldGateResults && (
          <div className="mt-8">
            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="trades">Trades analysis</TabsTrigger>
                <TabsTrigger 
                  value="risk" 
                  disabled={isFreePlan}
                  className={isFreePlan ? "opacity-60" : undefined}
                >
                  Risk/performance ratios
                </TabsTrigger>
                <TabsTrigger value="table">List of trades</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <MetricGrid
                  metrics={data.sections.performance.metrics}
                  currency={currency}
                />
              </TabsContent>

              <TabsContent value="trades">
                <MetricGrid
                  metrics={data.sections.tradesAnalysis.metrics}
                  currency={currency}
                />
              </TabsContent>

              <TabsContent value="risk">
                {isFreePlan ? (
                  <div className="tv-card p-6 text-sm text-slate-200">
                    Upgrade to Standard or Pro to unlock correlation, volatility clusters, and tail risk ratios.
                  </div>
                ) : (
                  <MetricGrid 
                    metrics={data.sections.riskRatios.metrics} 
                    currency={currency}
                  />
                )}
              </TabsContent>

              <TabsContent value="table">
                <FileTable trades={data.tradesTable} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {hasCompletedRun && !shouldGateResults && (
          <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Compare strategies</h3>
              <p className="mt-1 text-sm text-slate-300">
                Overlay runs side by side to validate parameter tweaks without spreadsheets.
              </p>
            </div>
            <Link
              href="/backtests?compare=1"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand hover:text-white"
            >
              Compare strategies
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-300">Loading dashboard…</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}
