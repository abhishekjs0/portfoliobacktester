import { Link } from "react-router-dom";
import { Button, Card } from "@backtester/ui";

const steps = [
  {
    icon: "🆕",
    title: "Create Account",
    description: "Sign up and land on a guided dashboard with a ready-to-go empty state so you know exactly what to do next.",
  },
  {
    icon: "📂",
    title: "Upload CSVs",
    description: "Drag & drop up to 100 TradingView Strategy Tester exports — we validate format instantly so you can iterate fast.",
  },
  {
    icon: "📈",
    title: "View Results",
    description: "Watch real-time processing and review the combined equity curve, KPIs, and trade breakdowns without spreadsheets.",
  },
];

const benefits = [
  {
    icon: "⏱",
    title: "Save Hours",
    description: "Automate CSV merging and reclaim 2+ hours each week that would have been spent wrangling Excel.",
  },
  {
    icon: "📊",
    title: "Portfolio-Level Insight",
    description: "See aggregate equity, Sharpe, drawdown, and hit rate across every symbol in one workspace.",
  },
  {
    icon: "🖥️",
    title: "Familiar Workspace",
    description: "TradingView-inspired overlays mean zero learning curve and absolutely no code required.",
  },
  {
    icon: "🔒",
    title: "Data Stays Private",
    description: "Process locally by default with encrypted uploads when you opt-in to cloud storage.",
  },
];

const comparisonSlides = [
  {
    title: "Compare strategies side by side",
    description:
      "Stack equity curves, toggle benchmarks, and sort trade tables to understand which variations deserve more capital.",
  },
  {
    title: "Share findings with teammates",
    description:
      "Export summary snapshots or invite collaborators to review runs inside the same dark-terminal workspace.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    perks: [
      "Up to 10 CSVs per portfolio run",
      "Client-side processing",
      "Downloadable trade logs",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    perks: [
      "Up to 100 CSVs & portfolio templates",
      "Priority equity curve rendering",
      "Inline upgrade prompts when limits are hit",
    ],
  },
];

const faqs = [
  {
    question: "Do I need to code or write Pine Script?",
    answer:
      "No. Export trades from TradingView’s Strategy Tester, drag the CSVs into BacktestLab, and we handle the rest.",
  },
  {
    question: "How big can uploads be?",
    answer:
      "Each CSV can be up to 20 MB, supporting hundreds of thousands of trades so you can backtest years of history.",
  },
  {
    question: "Will my data stay private?",
    answer:
      "Yes. Processing happens locally by default with encrypted in-transit uploads when you choose to sync to the cloud.",
  },
  {
    question: "Can I compare multiple strategy versions?",
    answer:
      "Absolutely. Duplicate runs, tag them, and review KPIs side by side inside sortable tables and overlay charts.",
  },
];

const badges = [
  "Client-side option",
  "GDPR-compliant",
  "Encrypted in transit",
];

const testimonials = [
  {
    name: "Ava, Swing Trader",
    quote:
      "This saved me hours of spreadsheet pain — I can now iterate twice as fast on new multi-symbol ideas.",
  },
  {
    name: "Noah, Prop Desk Analyst",
    quote:
      "Seeing drawdown and Sharpe across the whole basket gives me confidence to size positions aggressively.",
  },
  {
    name: "Lena, Quant Researcher",
    quote:
      "Uploading 80 CSVs at once and getting a combined equity curve in under a minute feels like magic.",
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-16">
      <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">User Guide</p>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Portfolio Backtesting for TradingView Power Users
            </h1>
            <p className="max-w-2xl text-base text-slate-300">
              Upload up to 100 Strategy Tester CSVs, merge them into a single portfolio run, and see equity curves, KPIs, and trade breakdowns instantly — no spreadsheets required.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="bg-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-400"
            >
              <Link to="/signup">Start Free Backtest</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="border border-slate-700 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 shadow-inner shadow-slate-900/30 hover:border-slate-500 hover:bg-slate-900"
            >
              <Link to="/examples/demo">See Demo Results</Link>
            </Button>
          </div>
          <p className="text-sm font-medium text-slate-400">
            Go from signup to first portfolio result in under 3 minutes.
          </p>
        </div>
        <Card className="h-full overflow-hidden border-slate-800 bg-slate-900/70">
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Workspace preview</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Multi-symbol equity overlays</h2>
              <p className="mt-3 text-sm text-slate-300">
                Live equity curves, KPI tiles, and trade breakdowns update as soon as your CSVs finish processing.
              </p>
            </div>
            <div className="relative h-40 overflow-hidden rounded-md border border-slate-800 bg-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_60%)]" aria-hidden="true" />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Equity Curve</span>
                  <span>Sharpe 1.42</span>
                </div>
                <div className="flex flex-1 items-end gap-2">
                  <span className="h-16 w-full rounded bg-gradient-to-t from-slate-800 to-fuchsia-500/70" />
                  <span className="h-12 w-full rounded bg-gradient-to-t from-slate-800 to-indigo-500/70" />
                  <span className="h-20 w-full rounded bg-gradient-to-t from-slate-800 to-emerald-500/70" />
                  <span className="h-10 w-full rounded bg-gradient-to-t from-slate-800 to-sky-500/70" />
                  <span className="h-14 w-full rounded bg-gradient-to-t from-slate-800 to-violet-500/70" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">Get from export to insight in three guided steps</h2>
          <p className="hidden text-sm text-slate-400 lg:block">No spreadsheets, just rapid iterations on portfolio ideas.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="h-full border-slate-800 bg-slate-900/60 p-6">
              <div className="text-3xl" aria-hidden="true">
                {step.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Why traders are switching to BacktestLab</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="h-full border-slate-800 bg-slate-900/60 p-6">
              <div className="text-3xl" aria-hidden="true">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{benefit.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{benefit.description}</p>
            </Card>
          ))}
        </div>
        <div>
          <Button
            asChild
            className="bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          >
            <Link to="/signup">Try Multi-Symbol Backtest</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Visualize comparisons and plan upgrades</h2>
            <p className="text-sm text-slate-300">
              Overlay strategies in a responsive carousel and preview how Free versus Pro tiers unlock more headroom right when you need it.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <Card className="border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Upgrade when limits hit</h3>
            <p className="mt-2 text-sm text-slate-300">
              The app surfaces inline upgrade prompts when you run into CSV or storage limits, so you never lose momentum mid-iteration.
            </p>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex gap-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 p-6">
            {comparisonSlides.map((slide) => (
              <div key={slide.title} className="min-w-[260px] max-w-sm space-y-4 rounded-md border border-slate-800 bg-slate-900/60 p-5">
                <div className="h-32 rounded bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_65%)]" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white">{slide.title}</h3>
                <p className="text-sm text-slate-300">{slide.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className="border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <span className="text-sm font-semibold text-fuchsia-400">{plan.price}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1 text-emerald-400">
                        •
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6" id="faq">
        <h2 className="text-2xl font-semibold text-white">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-slate-800 bg-slate-900/60 text-left">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white marker:hidden">
                {faq.question}
                <span className="text-xs text-slate-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">What traders are saying</h2>
        <div className="flex gap-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="min-w-[220px] max-w-xs space-y-4 rounded-md border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-300">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{testimonial.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 text-center">
        <h2 className="text-3xl font-semibold text-white">Get Portfolio-Level Insights Today</h2>
        <p className="text-sm text-slate-300">
          Join early access and backtest smarter portfolios in minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="bg-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-400"
          >
            <Link to="/signup">Create Free Account</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="border border-slate-700 bg-slate-950/60 px-6 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-900"
          >
            <Link to="/pricing">See Pricing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
