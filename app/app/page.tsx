import Link from "next/link";
import { faqItems, flows, keyBenefits } from "../lib/marketing-content";

const painPoints = [
  {
    title: "TradingView is single-symbol",
    description:
      "Strategy Tester only handles one ticker at a time. Portfolio-level risk remains invisible until trades overlap in real accounts.",
  },
  {
    title: "Spreadsheet gymnastics",
    description:
      "Exporting, merging and charting results manually costs hours every week and introduces errors that skew conclusions.",
  },
  {
    title: "Slow iteration loops",
    description:
      "Parameter tweaks require dozens of re-runs. Waiting for exports kills creative momentum when optimising a strategy.",
  },
  {
    title: "Confidence gap",
    description:
      "Without aggregated equity curves and drawdown insight, traders hesitate to deploy capital or increase size.",
  },
];

const highlightStats = [
  { label: "Symbols per run", value: "50+" },
  { label: "Aggregations per minute", value: "120" },
  { label: "Avg time saved", value: "2h/day" },
  { label: "Active beta users", value: "75" },
];

export default function Home() {
  return (
    <main className="landing-root">
      <section className="landing-hero" aria-labelledby="hero-heading">
        <div className="landing-container landing-hero__layout">
          <div className="landing-hero__content">
            <span className="landing-badge">Built for TradingView power-users</span>
            <h1 id="hero-heading" className="landing-hero-title">
              Backtest entire portfolios in one click
            </h1>
            <p className="landing-hero-sub">
              Tired of running your strategy one symbol at a time? Upload TradingView CSVs and watch our cloud engine crunch 20+
              symbols in seconds. Discover true portfolio performance without code, spreadsheets or guesswork.
            </p>
            <div className="landing-hero-cta" role="group" aria-label="Primary call to action">
              <Link className="button button--primary" href="/backtests?demo=1">
                Try on demo data
              </Link>
              <Link className="button button--outline" href="/upload">
                Upload your first CSV
              </Link>
            </div>
            <p className="landing-hero-note">No credit card required • Works with any TradingView strategy export</p>
          </div>
          <div className="landing-hero__panel" aria-label="Portfolio summary mock">
            <div className="landing-kpi-grid">
              <div className="landing-kpi">
                <span className="label">Portfolio CAGR</span>
                <span className="value">18.4%</span>
              </div>
              <div className="landing-kpi">
                <span className="label">Sharpe</span>
                <span className="value">1.21</span>
              </div>
              <div className="landing-kpi">
                <span className="label">Max Drawdown</span>
                <span className="value">-9.7%</span>
              </div>
              <div className="landing-kpi">
                <span className="label">Win rate</span>
                <span className="value">54%</span>
              </div>
            </div>
            <div className="landing-chart-placeholder" role="img" aria-label="Portfolio equity curve placeholder">
              Portfolio Equity Curve Placeholder
            </div>
            <p className="landing-panel-copy">
              Combine trades across tickers, respect capital constraints and reveal the equity curve that matches how you really
              trade.
            </p>
          </div>
        </div>
        <div className="landing-highlight-grid" role="list">
          {highlightStats.map((stat) => (
            <div key={stat.label} className="landing-highlight" role="listitem">
              <span className="value">{stat.value}</span>
              <span className="label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" id="benefits" aria-labelledby="benefits-heading">
        <div className="landing-container">
<<<<<<< HEAD
          <span className="landing-badge">Portfolio Backtesting Workspace</span>
          <h1 id="hero-heading" className="landing-hero-title">
            Go from single-symbol guesses to true portfolio intelligence
          </h1>
          <p className="landing-hero-sub">
            Run multi-symbol simulations, see combined equity curves, and optimize allocations in minutes. No more
            tab-hopping or spreadsheet stitching.
          </p>
          <div className="landing-hero-cta" role="group" aria-label="Primary call to action">
            <Link className="landing-btn" href="/upload" data-analytics-event="hero_start_trial">
              Start free – 14 days
            </Link>
            <a className="landing-btn secondary" href="#how" data-analytics-event="hero_scroll_how">
              See how it works
            </a>
=======
          <h2 id="benefits-heading" className="landing-section-title">
            Why traders are switching
          </h2>
          <div className="landing-grid" role="list">
            {keyBenefits.map((benefit) => (
              <article key={benefit.title} className="landing-card" role="listitem">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
>>>>>>> origin/main
          </div>
        </div>
      </section>

      <section className="landing-section" id="pain" aria-labelledby="pain-heading">
        <div className="landing-container">
          <h2 id="pain-heading" className="landing-section-title">
            The current workaround is broken
          </h2>
          <div className="landing-grid" role="list">
            {painPoints.map((pain) => (
              <article key={pain.title} className="landing-benefit" role="listitem">
                <h4>{pain.title}</h4>
                <p>{pain.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="flows" aria-labelledby="flow-heading">
        <div className="landing-container">
          <h2 id="flow-heading" className="landing-section-title">
            Designed for seamless multi-symbol workflows
          </h2>
          <div className="flow-grid">
            {flows.map((flow) => (
              <article key={flow.id} className="flow-card">
                <span className="tag">{flow.title}</span>
                <p className="flow-card__description">{flow.description}</p>
                <ol className="flow-card__steps">
                  {flow.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="demo" aria-labelledby="demo-heading">
        <div className="landing-container">
          <h2 id="demo-heading" className="landing-section-title">
            See the full portfolio picture instantly
          </h2>
          <div className="landing-feature">
            <div className="landing-panel" aria-label="Portfolio metrics mock">
              <div className="landing-kpi-grid">
                <div className="landing-kpi">
                  <span className="label">Net Profit</span>
                  <span className="value">$34,250</span>
                </div>
                <div className="landing-kpi">
                  <span className="label">Exposure at risk</span>
                  <span className="value">32%</span>
                </div>
                <div className="landing-kpi">
                  <span className="label">Best symbol</span>
                  <span className="value">NVDA</span>
                </div>
                <div className="landing-kpi">
                  <span className="label">Losing cluster</span>
                  <span className="value">Apr ‘23</span>
                </div>
              </div>
              <div className="landing-chart-placeholder" role="img" aria-label="Comparison chart placeholder">
                Strategy Comparison Placeholder
              </div>
              <p className="landing-panel-copy">
                Contrast strategies, toggle symbols on/off and export summary packs ready for investors or prop firm reviews.
              </p>
            </div>

<<<<<<< HEAD
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
=======
            <div className="landing-panel">
<<<<<<< HEAD
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
<<<<<<< HEAD
                <input
                  id="beta-email"
                  type="email"
                  placeholder="Enter your email to join the beta"
                  required
                  aria-describedby="signup-helper"
                />
                <span id="signup-helper" className="sr-only">
                  We will email you onboarding materials and will not share your address.
                </span>
                <button type="submit" className="landing-btn" data-analytics-event="beta_request">
=======
                <input id="beta-email" type="email" placeholder="Enter your email to join the beta" required />
                <button type="button" className="landing-btn">
>>>>>>> origin/main
                  Get early access
                </button>
              </form>
=======
              <h3 className="landing-panel-title">Upload → Aggregate → Decide</h3>
              <ul className="landing-feature-list">
                <li>Batch import TradingView CSVs with automated validation and tagging.</li>
                <li>Aggregate trades respecting capital, concurrency and per-symbol slippage assumptions.</li>
                <li>Visualise portfolio equity, drawdown, exposure heatmaps and trade distributions.</li>
                <li>Compare strategies side-by-side to find the best combination for your goals.</li>
              </ul>
              <Link className="button button--primary" href="/backtests?demo=1">
                Launch demo workspace
              </Link>
>>>>>>> origin/main
>>>>>>> origin/main
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="faq-heading">
        <div className="landing-container">
          <h2 id="faq-heading" className="landing-section-title">
            Frequently asked questions
          </h2>
          <div className="faq-grid">
            {faqItems.map((faq) => (
              <article key={faq.question} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
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
<<<<<<< HEAD
            <form className="landing-inline-form" aria-label="Reserve spot">
=======
<<<<<<< HEAD
            <form className="landing-inline-form" aria-label="Reserve spot">
=======
            <div className="landing-inline-form" role="form" aria-label="Reserve spot">
>>>>>>> origin/main
>>>>>>> origin/main
              <label className="sr-only" htmlFor="cta-email">
                Email address
              </label>
<<<<<<< HEAD
              <input
                id="cta-email"
                type="email"
                placeholder="Email address"
                required
                aria-describedby="cta-helper"
              />
              <span id="cta-helper" className="sr-only">We send only onboarding details.</span>
              <button type="submit" className="landing-btn" data-analytics-event="cta_waitlist">
=======
              <input id="cta-email" type="email" placeholder="Email address" required />
              <button type="button" className="landing-btn">
>>>>>>> origin/main
                Reserve my spot
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
