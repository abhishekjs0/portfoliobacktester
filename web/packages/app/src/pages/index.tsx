import { Link } from "react-router-dom";
import { Button, Card, MetricCard } from "@backtester/ui";

const struggles = [
  {
    title: "One symbol at a time",
    description: "Manual runs hide what happens when trades overlap and capital is shared.",
  },
  {
    title: "Spreadsheet blind spots",
    description: "Summed P&L misses drawdown, correlation, and exposure heatmaps.",
  },
  {
    title: "Slow iteration loop",
    description: "Hours of copy-paste blocks discovering which parameters actually help.",
  },
];

const outcomes = [
  {
    title: "Evidence over anecdotes",
    description: "Decide with portfolio-level metrics including Sharpe, Sortino, and overlap analysis.",
  },
  {
    title: "Faster iteration",
    description: "Upload CSVs or connect APIs once then re-run entire baskets in minutes.",
  },
  {
    title: "Confidence to deploy",
    description: "See combined equity, drawdown, and heatmaps before risking real capital.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-white shadow-xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-widest text-indigo-300">Portfolio backtesting workspace</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Trade with confidence across your entire portfolio
          </h1>
          <p className="mt-6 text-lg text-indigo-100">
            Backtest multi-symbol strategies, analyze risk, and optimize allocations in minutes. No more spreadsheet stitching
            or one-off chart guesses.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/signup">Start free trial</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="#how">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="struggles-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="struggles-heading" className="text-2xl font-semibold text-slate-900 dark:text-white">
            Why portfolios fail in spreadsheets
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {struggles.map((struggle) => (
              <Card key={struggle.title} heading={struggle.title} className="bg-white/70 backdrop-blur">
                <p className="text-sm text-slate-600 dark:text-slate-300">{struggle.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mt-16" aria-labelledby="how-heading">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 id="how-heading" className="text-2xl font-semibold text-slate-900 dark:text-white">
              How BacktestPro accelerates your workflow
            </h2>
            <ol className="mt-8 space-y-6">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">1</span>
                <div>
                  <h3 className="text-lg font-semibold">Assemble your basket</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Upload CSV exports or connect APIs, set capital, position sizing, and concurrency rules.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">2</span>
                <div>
                  <h3 className="text-lg font-semibold">Simulate portfolio</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Run realistic fills with slippage, overlaps, and exposure tracking across all symbols.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">3</span>
                <div>
                  <h3 className="text-lg font-semibold">Optimize allocation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Compare parameter sets, weights, and rebalance cadence for risk-adjusted returns.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div className="grid gap-6">
            <MetricCard label="Portfolio CAGR" value="18.4%" trend="up" srLabel="Portfolio CAGR 18.4 percent" />
            <MetricCard label="Max drawdown" value="-9.7%" trend="down" srLabel="Max drawdown negative 9.7 percent" />
            <MetricCard label="Sharpe" value="1.21" trend="up" srLabel="Sharpe ratio 1.21" />
          </div>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="outcomes-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="outcomes-heading" className="text-2xl font-semibold text-slate-900 dark:text-white">
            Outcomes you can expect
          </h2>
          <dl className="mt-8 grid gap-6 md:grid-cols-3">
            {outcomes.map((outcome) => (
              <div key={outcome.title} className="rounded-2xl border border-slate-200 bg-white/60 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                <dt className="text-lg font-semibold">{outcome.title}</dt>
                <dd className="mt-2 text-sm text-slate-600 dark:text-slate-300">{outcome.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-indigo-600 px-6 py-12 text-white" aria-labelledby="cta-heading">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-sm uppercase tracking-widest text-indigo-200">Limited beta</span>
            <h2 id="cta-heading" className="mt-2 text-3xl font-semibold">
              Join the early access cohort
            </h2>
            <p className="mt-2 text-indigo-100">
              We onboard a handful of teams each month to ensure fast support and insightful onboarding.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form className="flex flex-col gap-3 sm:flex-row" aria-label="Email capture" onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor="cta-email">
                Work email
              </label>
              <input
                id="cta-email"
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-indigo-400/60 bg-indigo-500/40 px-4 py-3 text-white placeholder:text-indigo-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button type="submit">Reserve my spot</Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
