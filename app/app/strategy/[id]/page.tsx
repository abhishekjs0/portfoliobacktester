import Link from "next/link";
import { notFound } from "next/navigation";
import { KPITile } from "../../../components/kpi-tile";
import { FileTable } from "../../../components/file-table";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { mockBacktests } from "../../../lib/mock-data";
import { StrategyEquity } from "./strategy-equity";

export default function StrategyDetailPage({ params }: { params: { id: string } }) {
  const run = mockBacktests.find((item) => item.id === params.id);
  if (!run) {
    notFound();
  }

  return (
    <div className="strategy-page">
      <div className="landing-container">
        <header className="strategy-header">
          <div>
            <span className="landing-badge">Portfolio result</span>
            <h1>{run.name}</h1>
            <p>{run.strategy} • {run.symbols.length} symbols • {run.timeframe} timeframe</p>
            <div className="backtest-card__tags">
              {run.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Link href="/backtests" className="button button--outline">
            ← Back to backtests
          </Link>
        </header>

        {run.equityCurve.length > 0 ? (
          <StrategyEquity equityCurve={run.equityCurve} drawdown={run.drawdown} />
        ) : (
          <div className="tv-card p-6 text-sm text-slate-300">This backtest is still processing. Check again shortly.</div>
        )}

        <section className="strategy-metrics" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading">Key metrics</h2>
          <div className="strategy-metrics__grid">
            <KPITile label="Net profit" value={run.metrics.netProfit} format="currency" />
            <KPITile label="Portfolio CAGR" value={run.metrics.cagr} format="percent" />
            <KPITile label="Max drawdown" value={run.metrics.maxDrawdown} format="percent" />
            <KPITile label="Sharpe" value={run.metrics.sharpe} format="raw" />
            <KPITile label="Win rate" value={run.metrics.winRate} format="percent" />
            <KPITile label="Total trades" value={run.metrics.totalTrades} format="raw" />
          </div>
        </section>

        <section className="strategy-notes" aria-labelledby="notes-heading">
          <h2 id="notes-heading">Run notes</h2>
          <p>{run.notes ?? "No notes captured for this run yet."}</p>
        </section>

        <section className="strategy-trades" aria-labelledby="trades-heading">
          <div className="strategy-trades__heading">
            <div>
              <h2 id="trades-heading">Trades preview</h2>
              <p>First {run.tradesTable.length || "0"} trades from the merged CSVs.</p>
            </div>
            <div className="strategy-trades__totals">
              <span>Total P&L: {formatCurrency(run.metrics.netProfit)}</span>
              <span>Win rate: {formatPercent(run.metrics.winRate)}</span>
            </div>
          </div>
          <FileTable trades={run.tradesTable} />
        </section>
      </div>
    </div>
  );
}
