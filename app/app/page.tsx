import Link from "next/link";

const struggles = [
  {
    title: "One symbol at a time",
    description:
      "Switching tickers and re-running backtests breaks flow and hides what happens when trades overlap.",
  },
  {
    title: "Spreadsheet blind spots",
    description:
      "Summed P&L misses correlation, capital rules, and true drawdown across a basket.",
  },
  {
    title: "Slow iteration loop",
    description:
      "Dozens of manual runs per symbol stall parameter tuning and block evidence-based decisions.",
  },
  {
    title: "Single-chart edge illusion",
    description:
      "What wins on one chart can sink a portfolio when signals cluster and risks compound.",
  },
];

const steps = [
  {
    label: "Assemble your basket",
    copy: "Pick symbols or strategy mix; define capital, position sizing, and concurrency.",
  },
  {
    label: "Simulate portfolio",
    copy: "Run multi-symbol backtests with real-world fills, slippage, and overlap handling.",
  },
  {
    label: "Analyze risk",
    copy: "Get combined equity, drawdown, correlation, exposure heatmaps, and factor tilts.",
  },
  {
    label: "Optimize allocation",
    copy: "Test weights, parameter sets, and rebalancing schedules to target risk-adjusted returns.",
  },
];

const outcomes = [
  {
    title: "Evidence over anecdotes",
    description:
      "Decide with portfolio-level facts: true drawdown, capital usage, and correlation across holdings.",
  },
  {
    title: "Speed to insight",
    description:
      "Turn hours of manual runs into minutes. Iterate faster on what actually improves risk-adjusted returns.",
  },
  {
    title: "Smarter allocations",
    description: "Find weights and rebalancing rules that reduce volatility without killing edge.",
  },
  {
    title: "Confidence to deploy",
    description: "Avoid nasty surprises from overlapping signals and clustered losses before you go live.",
  },
];

export default function Home() {
  return (
    <main className="landing-root">
      <section className="landing-hero" aria-labelledby="hero-heading">
        <div className="landing-container">
          <span className="landing-badge">Portfolio Backtesting Workspace</span>
          <h1 id="hero-heading" className="landing-hero-title">
            Go from single-symbol guesses to true portfolio intelligence
          </h1>
          <p className="landing-hero-sub">
            Run multi-symbol simulations, see combined equity curves, and optimize allocations in minutes. No more
            tab-hopping or spreadsheet stitching.
          </p>
          <div className="landing-hero-cta" role="group" aria-label="Primary call to action">
            <Link className="landing-btn" href="/upload">
              Start free – 14 days
            </Link>
            <a className="landing-btn secondary" href="#how">
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section" id="pain" aria-labelledby="pain-heading">
        <div className="landing-container">
          <h2 id="pain-heading" className="landing-section-title">
            Current Struggles
          </h2>
          <div className="landing-grid" role="list">
            {struggles.map((struggle) => (
              <article key={struggle.title} className="landing-card" role="listitem">
                <h3>{struggle.title}</h3>
                <p>{struggle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="how" aria-labelledby="how-heading">
        <div className="landing-container">
          <h2 id="how-heading" className="landing-section-title">
            How it works
          </h2>
          <div className="landing-feature">
            <div className="landing-panel" aria-label="Portfolio metrics mock">
              <div className="landing-kpi-grid">
                <div className="landing-kpi">
                  <span className="label">Portfolio CAGR</span>
                  <span className="value">18.4%</span>
                </div>
                <div className="landing-kpi">
                  <span className="label">Max Drawdown</span>
                  <span className="value">-9.7%</span>
                </div>
                <div className="landing-kpi">
                  <span className="label">Sharpe</span>
                  <span className="value">1.21</span>
                </div>
                <div className="landing-kpi">
                  <span className="label">Hit Rate</span>
                  <span className="value">54%</span>
                </div>
              </div>
              <div className="landing-chart-placeholder" role="img" aria-label="Portfolio equity curve placeholder">
                Portfolio Equity Curve Placeholder
              </div>
              <p className="landing-panel-copy">
                Upload results or connect data, select symbols and rules, then simulate portfolio-level performance with
                capital allocation and concurrency.
              </p>
            </div>

            <div className="landing-panel-column">
              <div className="landing-panel">
                <h3 className="landing-panel-title">Upload → Aggregate → Decide</h3>
                <ul className="landing-feature-list">
                  <li>Batch import TradingView CSVs with automated validation and tagging.</li>
                  <li>Aggregate trades respecting capital, concurrency and per-symbol slippage assumptions.</li>
                  <li>Visualise portfolio equity, drawdown, exposure heatmaps and trade distributions.</li>
                  <li>Compare strategies side-by-side to find the best combination for your goals.</li>
                </ul>
                <div className="landing-panel-cta">
                  <Link className="landing-btn" href="/backtests?demo=1">
                    Launch demo workspace
                  </Link>
                </div>
              </div>

              <div className="landing-panel">
                <ol className="landing-stepper">
                  {steps.map((step, index) => (
                    <li key={step.label} className="landing-step">
                      <span className="index" aria-hidden="true">
                        {index + 1}
                      </span>
                      <div>
                        <strong>{step.label}</strong>
                        <p>{step.copy}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <form id="signup" className="landing-inline-form" aria-label="Email capture">
                  <label className="sr-only" htmlFor="beta-email">
                    Email address
                  </label>
                  <input id="beta-email" type="email" placeholder="Enter your email to join the beta" required />
                  <button type="submit" className="landing-btn">
                    Get early access
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="outcomes-heading">
        <div className="landing-container">
          <h2 id="outcomes-heading" className="landing-section-title">
            Outcomes you can expect
          </h2>
          <div className="landing-grid" role="list">
            {outcomes.map((outcome) => (
              <article key={outcome.title} className="landing-benefit" role="listitem">
                <h4>{outcome.title}</h4>
                <p>{outcome.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-strip" aria-labelledby="cta-heading">
        <div className="landing-container">
          <div className="landing-cta-box">
            <div>
              <span className="landing-badge">Limited beta</span>
              <h3 id="cta-heading">Join the early access cohort</h3>
              <p>Spots this month are capped to ensure fast onboarding and support.</p>
            </div>
            <form className="landing-inline-form" aria-label="Reserve spot">
              <label className="sr-only" htmlFor="cta-email">
                Email address
              </label>
              <input id="cta-email" type="email" placeholder="Email address" required />
              <button type="submit" className="landing-btn">
                Reserve my spot
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="founder-heading">
        <div className="landing-container">
          <h2 id="founder-heading" className="landing-section-title">
            From the founder
          </h2>
          <div className="landing-founder-card">
            <div className="avatar" aria-hidden="true" />
            <div>
              <p>
                “After years of single-symbol testing and spreadsheet hacks, we built the tool we wished existed: fast,
                honest, portfolio-level backtesting that surfaces risk before capital is on the line.”
              </p>
              <p className="landing-founder-signoff">
                <strong>Your Name</strong> — Founder
              </p>
            </div>
          </div>
          <div className="landing-panel landing-testimonial-placeholder" aria-label="Testimonials placeholder">
            Testimonials coming soon. Add 2–3 concise quotes focused on time saved, clarity of risk, and confidence to
            deploy.
          </div>
        </div>
      </section>
    </main>
  );
}
