"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePlan } from "@/lib/use-plan";

type BacktestStatus = "complete" | "processing" | "queued";

type BacktestRow = {
  id: string;
  name: string;
  strategy: string;
  createdAt: string;
  status: BacktestStatus;
  cagr?: number;
  maxDrawdown?: number;
  sharpe?: number;
};

type SortKey = "createdAt" | "cagr" | "maxDrawdown" | "sharpe";

const STATUS_STYLES: Record<BacktestStatus, string> = {
  complete: "bg-emerald-500/20 text-emerald-200",
  processing: "bg-amber-400/20 text-amber-200",
  queued: "bg-slate-500/20 text-slate-200",
};

const STATUS_COPY: Record<BacktestStatus, string> = {
  complete: "Complete",
  processing: "Processing",
  queued: "Queued",
};

function StatusChip({ status }: { status: BacktestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {STATUS_COPY[status]}
    </span>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeSort,
  onSort,
  numeric = false,
}: {
  label: string;
  sortKey: SortKey;
  activeSort: { key: SortKey; direction: "asc" | "desc" };
  onSort: (key: SortKey) => void;
  numeric?: boolean;
}) {
  const isActive = activeSort.key === sortKey;
  const direction = isActive ? activeSort.direction : undefined;
  const ariaSort: "ascending" | "descending" | "none" = isActive
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";
  return (
    <th scope="col" className={`px-4 py-3 ${numeric ? "text-right" : "text-left"}`} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white"
      >
        {label}
        <span aria-hidden="true" className="text-xs">
          {direction === "asc" ? "▲" : direction === "desc" ? "▼" : ""}
        </span>
      </button>
    </th>
  );
}

function BacktestsContent() {
  const searchParams = useSearchParams();
  const { plan } = usePlan();
  const isFreePlan = plan === "free";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "createdAt",
    direction: "desc",
  });
  const [runs] = useState<BacktestRow[]>([]);

  const filteredRuns = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return runs;
    return runs.filter((run) => {
      const haystack = [run.name, run.strategy].join(" ").toLowerCase();
      return haystack.includes(normalised);
    });
  }, [runs, query]);

  const sortedRuns = useMemo(() => {
    const sortable = [...filteredRuns];
    sortable.sort((a, b) => {
      const { key, direction } = sort;
      const aValue = a[key] ?? 0;
      const bValue = b[key] ?? 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
      return direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
    return sortable;
  }, [filteredRuns, sort]);

  const toggleSort = (nextKey: SortKey) => {
    setSort((current) => {
      if (current.key === nextKey) {
        return { key: nextKey, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key: nextKey, direction: "desc" };
    });
  };

  const showUpgradePrompt = isFreePlan && searchParams.get("limit") === "hit";
  const hasRuns = sortedRuns.length > 0;

  return (
    <div className="px-6 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Portfolio runs</span>
          <h1 className="mt-3 text-3xl font-bold text-white">Review backtests and compare strategies</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Track each upload, monitor portfolio-level KPIs, and jump into comparisons when you are ready to refine sizing.
          </p>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
        >
          Run New Portfolio Backtest
        </Link>
      </header>

      {showUpgradePrompt && (
        <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          You’ve reached 3 runs today. Upgrade to Trader for 50 daily runs.
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search backtests by name, strategy, or symbol."
            className="w-full rounded-full border border-white/10 bg-slate-900/70 px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/guide"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-brand hover:text-brand"
          >
            See How It Works
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-brand hover:text-brand"
          >
            See pricing
          </Link>
        </div>
      </div>

      {hasRuns ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm text-white">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                    Name
                  </th>
                  <SortableHeader label="Created" sortKey="createdAt" activeSort={sort} onSort={toggleSort} />
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                    Strategy
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                    Status
                  </th>
                  <SortableHeader label="CAGR" sortKey="cagr" activeSort={sort} onSort={toggleSort} numeric />
                  <SortableHeader label="Max DD" sortKey="maxDrawdown" activeSort={sort} onSort={toggleSort} numeric />
                  <SortableHeader label="Sharpe" sortKey="sharpe" activeSort={sort} onSort={toggleSort} numeric />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-white">{run.name}</p>
                        <p className="text-xs text-slate-400">ID: {run.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{run.strategy}</td>
                    <td className="px-4 py-3">
                      <StatusChip status={run.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">
                      {typeof run.cagr === "number" ? `${run.cagr.toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">
                      {typeof run.maxDrawdown === "number" ? `${run.maxDrawdown.toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">
                      {typeof run.sharpe === "number" ? run.sharpe.toFixed(2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
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
              <path d="M6 12H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 20H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 6V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 6V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="mt-6 text-2xl font-semibold text-white">No portfolio runs captured yet</h2>
          <p className="mt-3 max-w-md text-sm text-slate-300">
            Upload a batch of Strategy Tester exports to see them listed here with sortable KPIs. Your most recent runs will appear at the top.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
            >
              Upload CSVs
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-brand hover:text-brand"
            >
              See pricing
            </Link>
          </div>
        </section>
      )}

      {hasRuns && (
        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Compare strategies</h3>
            <p className="mt-1 text-sm text-slate-300">
              Select completed runs to line up equity curves and KPIs in the comparison view.
            </p>
          </div>
          <Link
            href="/dashboard?view=compare"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand hover:text-white"
          >
            Compare strategies
          </Link>
        </div>
      )}

      <Link
        href="/upload"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-brand-dark"
      >
        Upload CSVs
      </Link>
    </div>
  );
}

export default function BacktestsPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-slate-300">Loading backtests…</div>}>
      <BacktestsContent />
    </Suspense>
  );
}
