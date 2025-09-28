import { Card } from "@backtester/ui";

const metrics = [
  { label: "Portfolio CAGR", value: "24.6%" },
  { label: "Max Drawdown", value: "-8.9%" },
  { label: "Sharpe", value: "1.34" },
  { label: "Win rate", value: "58%" },
];

export default function DemoWorkspacePage() {
  return (
    <div className="space-y-12 text-slate-100">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Live preview</p>
        <h1 className="text-3xl font-semibold text-white">Demo workspace</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Explore a mock BacktestLab session showing combined equity curves, aggregated trade logs, and portfolio KPIs.
          This demo uses fabricated data to highlight the experience without exposing customer information.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <Card className="border-slate-800 bg-slate-900/70">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Combined equity curve</p>
              <div className="mt-6 h-48 rounded-xl border border-slate-800 bg-slate-950">
                <div className="flex h-full items-end gap-2 p-4">
                  <div className="h-1/2 flex-1 rounded-full bg-gradient-to-t from-fuchsia-500/30 via-fuchsia-500/60 to-fuchsia-400" />
                  <div className="h-3/4 flex-1 rounded-full bg-gradient-to-t from-indigo-500/30 via-indigo-500/60 to-indigo-300" />
                  <div className="h-2/3 flex-1 rounded-full bg-gradient-to-t from-cyan-500/30 via-cyan-500/60 to-cyan-300" />
                  <div className="h-[85%] flex-1 rounded-full bg-gradient-to-t from-emerald-500/30 via-emerald-500/60 to-emerald-300" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Recent trades</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>2025-01-08 • NIFTY • Long • +1.4R</li>
                <li>2025-01-07 • BANKNIFTY • Short • +0.8R</li>
                <li>2025-01-06 • RELIANCE • Long • -0.3R</li>
              </ul>
            </div>
          </div>
        </Card>
        <Card className="border-slate-800 bg-slate-900/70">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Key metrics</h2>
            <dl className="space-y-3 text-sm text-slate-300">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                  <dt className="font-medium text-slate-400">{metric.label}</dt>
                  <dd className="font-semibold text-white">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </section>
    </div>
  );
}
