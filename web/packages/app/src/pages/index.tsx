import { Link } from "react-router-dom";
import { Button, Card } from "@backtester/ui";

const kpis = [
  { label: "Portfolio CAGR", value: "24.6%", icon: "🚀", description: "Compounded across 32 symbols" },
  { label: "Max Drawdown", value: "-8.9%", icon: "🛡️", description: "Risk managed with overlap controls" },
  { label: "Win Rate", value: "58%", icon: "🎯", description: "Across 12k trades in the basket" },
  { label: "Sharpe", value: "1.34", icon: "📈", description: "Net of fees and slippage" },
];

const painPoints = [
  {
    icon: "📉",
    title: "Single-Symbol Testing",
    copy: "Portfolio risk stays hidden when strategies never meet.",
  },
  {
    icon: "🧮",
    title: "Spreadsheet Gymnastics",
    copy: "Hours disappear merging exports just to see the whole picture.",
  },
  {
    icon: "🕒",
    title: "Slow Iteration",
    copy: "Parameter tweaks stall because every change restarts the manual process.",
  },
  {
    icon: "⚠️",
    title: "Confidence Gap",
    copy: "No aggregated equity curve means hesitant sizing when it matters.",
  },
];

const valueProps = [
  {
    icon: "🔄",
    title: "Upload Once, Merge Everything",
    copy: "Stack up to 100 TradingView CSVs and stitch them automatically.",
  },
  {
    icon: "🖥️",
    title: "TradingView-Like Workspace",
    copy: "Overlay equity curves, inspect trades, and stay in a familiar layout.",
  },
  {
    icon: "📊",
    title: "Decision-Ready Analytics",
    copy: "Scan CAGR, drawdown, hit rate, and exposure heatmaps at a glance.",
  },
  {
    icon: "⚡",
    title: "Iterate Without Chaos",
    copy: "Compare parameter runs side-by-side without touching Excel.",
  },
];

const roadmapItems = [
  {
    title: "Strategy templates",
    description: "Pre-built baskets for momentum, mean reversion, and hedged overlays.",
    eta: "Q2 2025",
  },
  {
    title: "Multi-broker syncing",
    description: "Stream executions from Zerodha, Interactive Brokers, and Alpaca.",
    eta: "Q3 2025",
  },
  {
    title: "Team workspaces",
    description: "Share runs with collaborators and collect feedback inline.",
    eta: "Q4 2025",
  },
];

export default function HomePage() {
  return (
    <main className="space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black px-8 py-16 text-white shadow-2xl">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-fuchsia-500/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">Portfolio backtesting workspace</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Portfolio Backtesting for TradingView Power Users
            </h1>
            <p className="text-lg text-slate-200">
              Upload up to 100 Strategy Tester CSVs and get a combined equity curve, Sharpe, drawdown, and trade log — all in your browser, in seconds.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="w-full bg-fuchsia-500 px-6 py-3 text-base font-semibold shadow-xl shadow-fuchsia-500/30 hover:bg-fuchsia-400 sm:w-auto"
              >
                <Link to="/signup">Start Free Backtest</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full border border-slate-700/80 bg-transparent px-6 py-3 text-base font-semibold text-slate-100 hover:border-fuchsia-400 hover:bg-slate-900/60 hover:text-white sm:w-auto"
              >
                <Link to="/examples/demo">View Demo Workspace</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1">
                <span className="text-lg">⭐</span> Used by 500+ TradingView quants
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1">
                <span className="text-lg">🔒</span> Processing stays local – your data is private
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-widest text-slate-400">
              <span>No coding required</span>
              <span className="text-slate-600">•</span>
              <span>Excel optional, not mandatory</span>
            </div>
          </div>
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-fuchsia-500/20">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Equity overlay</span>
              <span>Last 2 years</span>
            </div>
            <div className="mt-4 h-48 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
              <div className="flex h-full items-end gap-2">
                <div className="h-1/2 flex-1 rounded-full bg-gradient-to-t from-fuchsia-500/30 via-fuchsia-500/60 to-fuchsia-400" />
                <div className="h-3/4 flex-1 rounded-full bg-gradient-to-t from-indigo-500/30 via-indigo-500/60 to-indigo-300" />
                <div className="h-2/3 flex-1 rounded-full bg-gradient-to-t from-cyan-500/30 via-cyan-500/60 to-cyan-300" />
                <div className="h-[85%] flex-1 rounded-full bg-gradient-to-t from-emerald-500/30 via-emerald-500/60 to-emerald-300" />
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Combined CAGR</span>
                <span className="font-semibold text-emerald-400">24.6%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Sharpe</span>
                <span className="font-semibold text-sky-400">1.34</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Max DD</span>
                <span className="font-semibold text-rose-400">-8.9%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="backtests" className="space-y-10" aria-labelledby="metrics-heading">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="metrics-heading" className="text-3xl font-semibold text-white">Decision-grade stats in a single upload</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              Stack exports, review the combined equity curve, and trust portfolio KPIs rendered instantly. Every calculation runs locally for privacy.
            </p>
          </div>
          <Button
            asChild
            className="bg-fuchsia-500/90 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:bg-fuchsia-400/90"
          >
            <Link to="/signup">Start Free Backtest</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <Card
              key={kpi.label}
              className="border-slate-800 bg-slate-900/60 backdrop-blur transition duration-200 hover:border-fuchsia-500/60 hover:shadow-lg hover:shadow-fuchsia-500/10"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{kpi.icon}</span>
                <span className="rounded-full border border-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {kpi.label}
                </span>
              </div>
              <p className="mt-6 text-4xl font-semibold text-white">{kpi.value}</p>
              <p className="mt-3 text-sm text-slate-300">{kpi.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="pain-heading" className="space-y-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">The current workaround is broken</p>
          <h2 id="pain-heading" className="mt-3 text-3xl font-semibold text-white">What slows portfolio builders down</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {painPoints.map((pain) => (
            <Card
              key={pain.title}
              className="flex h-full flex-col gap-4 border-slate-800 bg-slate-900/60 p-6 text-left shadow-md shadow-slate-900/40"
            >
              <span className="text-3xl">{pain.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-white">{pain.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{pain.copy}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" aria-labelledby="value-heading" className="space-y-12">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Why traders are switching</p>
            <h2 id="value-heading" className="text-3xl font-semibold text-white">BacktestLab is built for portfolio-level confidence</h2>
            <p className="text-base text-slate-300">
              Swap spreadsheet marathons for a real-time workspace that feels like TradingView. Every feature is tuned for high-signal iteration.
            </p>
          </div>
          <Button
            asChild
            className="bg-emerald-500/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400/90"
          >
            <Link to="/signup">Try Multi-Symbol Backtest</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {valueProps.map((feature) => (
            <Card
              key={feature.title}
              className="h-full border-slate-800 bg-slate-900/60 p-6 shadow-md shadow-slate-900/40 transition duration-200 hover:border-emerald-500/60 hover:shadow-emerald-500/10"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="guide-heading" className="space-y-12" id="guide">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">From upload to insight</p>
          <h2 id="guide-heading" className="text-3xl font-semibold text-white">Three steps to prove your portfolio edge</h2>
          <p className="text-base text-slate-300">
            Everything runs in the browser so you can iterate faster than spreadsheets ever allow.
          </p>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {["Upload CSVs", "Review combined equity", "Decide with KPIs"].map((step, index) => (
            <li
              key={step}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-6 text-lg font-semibold text-white">{step}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {index === 0
                  ? "Drop in TradingView exports or drag a folder. We auto-detect sizing and capital."
                  : index === 1
                    ? "See portfolio equity curves, drawdown bands, and overlapping trades instantly."
                    : "Sharpe, Sortino, win rate, and exposure metrics are ready for your next decision."}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="roadmap" aria-labelledby="roadmap-heading" className="space-y-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">On the horizon</p>
          <h2 id="roadmap-heading" className="mt-3 text-3xl font-semibold text-white">BacktestLab product roadmap</h2>
        </div>
        <div className="space-y-6">
          {roadmapItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-md shadow-slate-900/40 md:flex-row md:items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-slate-800/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                ETA {item.eta}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="lead-heading" className="rounded-3xl border border-slate-800 bg-slate-900/70 px-8 py-12 shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h2 id="lead-heading" className="text-2xl font-semibold text-white">Not ready yet?</h2>
            <p className="text-sm text-slate-300">Get notified of new features, roadmap drops, and done-for-you strategy templates.</p>
          </div>
          <form className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="lead-email" className="sr-only">
              Email address
            </label>
            <input
              id="lead-email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
            />
            <Button type="submit" className="bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400">
              Notify me
            </Button>
          </form>
        </div>
      </section>

      <section aria-labelledby="final-cta" className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black px-8 py-14 text-white shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h2 id="final-cta" className="text-3xl font-semibold">Build Confidence in Your Strategy Today</h2>
            <p className="text-base text-slate-200">
              Join hundreds of traders using BacktestLab to unlock portfolio-level insights.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="w-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 sm:w-auto"
            >
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full border border-slate-700/80 bg-transparent px-6 py-3 text-base font-semibold text-white hover:border-emerald-400 hover:bg-slate-900/60 sm:w-auto"
            >
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
