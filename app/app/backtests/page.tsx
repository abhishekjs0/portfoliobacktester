"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockBacktests } from "../../lib/mock-data";
import { formatCurrency, formatPercent } from "../../lib/format";

function BacktestsContent() {
  const searchParams = useSearchParams();
  const startDemoSelected = searchParams.get("demo") === "1";
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    startDemoSelected ? mockBacktests.slice(0, 2).map((run) => run.id) : [],
  );

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return mockBacktests;
    return mockBacktests.filter((run) => {
      const haystack = [run.name, run.strategy, run.symbols.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalised);
    });
  }, [query]);

  const selectedRuns = useMemo(
    () => mockBacktests.filter((run) => selectedIds.includes(run.id)),
    [selectedIds],
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="backtests-page">
      <div className="landing-container">
        <header className="backtests-header">
          <div>
            <span className="landing-badge">Portfolio runs</span>
            <h1>Review backtests and compare strategies</h1>
            <p>
              Monitor completed uploads, queue new simulations and overlay
              performance to find the portfolio mix that wins.
            </p>
          </div>
          <Link href="/upload" className="button button--primary">
            New backtest
          </Link>
        </header>

        <div className="backtests-toolbar">
          <input
            type="search"
            placeholder="Search by name, strategy or symbol"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="backtests-toolbar__actions">
            <Link href="/dashboard" className="button button--outline">
              Open dashboard
            </Link>
            <Link href="/features" className="button button--outline">
              Learn the workflow
            </Link>
          </div>
        </div>

        <div className="backtests-grid">
          {filtered.map((run) => (
            <article key={run.id} className="backtest-card">
              <header>
                <div className="backtest-card__title">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(run.id)}
                    onChange={() => toggleSelection(run.id)}
                    aria-label={`Select ${run.name} for comparison`}
                  />
                  <div>
                    <Link href={`/strategy/${run.id}`}>{run.name}</Link>
                    <p>{run.strategy}</p>
                  </div>
                </div>
                <span
                  className={`tag ${run.status !== "complete" ? "tag--warning" : "tag--success"}`}
                >
                  {run.status === "complete"
                    ? "Complete"
                    : run.status === "processing"
                      ? "Processing"
                      : "Queued"}
                </span>
              </header>
              <div className="backtest-card__meta">
                <span>{run.symbols.length} symbols</span>
                <span>{run.timeframe}</span>
                <span>{new Date(run.createdAt).toLocaleDateString()}</span>
              </div>
              <dl className="backtest-card__metrics">
                <div>
                  <dt>Net profit</dt>
                  <dd>{formatCurrency(run.metrics.netProfit)}</dd>
                </div>
                <div>
                  <dt>CAGR</dt>
                  <dd>{formatPercent(run.metrics.cagr)}</dd>
                </div>
                <div>
                  <dt>Max DD</dt>
                  <dd>{formatPercent(run.metrics.maxDrawdown)}</dd>
                </div>
                <div>
                  <dt>Sharpe</dt>
                  <dd>{run.metrics.sharpe.toFixed(2)}</dd>
                </div>
              </dl>
              <footer>
                <div className="backtest-card__tags">
                  {run.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/strategy/${run.id}`}
                  className="button button--outline"
                >
                  View details
                </Link>
              </footer>
            </article>
          ))}
        </div>

        {selectedRuns.length >= 2 && (
          <section
            className="comparison-panel"
            aria-labelledby="comparison-heading"
          >
            <div className="comparison-header">
              <h2 id="comparison-heading">Side-by-side comparison</h2>
              <p>
                {selectedRuns.length} runs selected. Toggle the checkboxes above
                to add or remove strategies from this view.
              </p>
            </div>
            <div className="comparison-table" role="table">
              <div
                className="comparison-table__row comparison-table__row--head"
                role="row"
              >
                <div role="columnheader">Metric</div>
                {selectedRuns.map((run) => (
                  <div key={run.id} role="columnheader">
                    {run.name}
                  </div>
                ))}
              </div>
              {renderMetricRow(
                "Net profit",
                selectedRuns.map((run) =>
                  formatCurrency(run.metrics.netProfit),
                ),
              )}
              {renderMetricRow(
                "CAGR",
                selectedRuns.map((run) => formatPercent(run.metrics.cagr)),
              )}
              {renderMetricRow(
                "Max drawdown",
                selectedRuns.map((run) =>
                  formatPercent(run.metrics.maxDrawdown),
                ),
              )}
              {renderMetricRow(
                "Sharpe",
                selectedRuns.map((run) => run.metrics.sharpe.toFixed(2)),
              )}
              {renderMetricRow(
                "Win rate",
                selectedRuns.map((run) => formatPercent(run.metrics.winRate)),
              )}
              {renderMetricRow(
                "Total trades",
                selectedRuns.map((run) => run.metrics.totalTrades.toString()),
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function BacktestsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BacktestsContent />
    </Suspense>
  );
}

function renderMetricRow(label: string, values: string[]) {
  return (
    <div className="comparison-table__row" role="row" key={label}>
      <div role="cell" className="comparison-table__label">
        {label}
      </div>
      {values.map((value, index) => (
        <div role="cell" key={`${label}-${index}`}>
          {value}
        </div>
      ))}
    </div>
  );
}
