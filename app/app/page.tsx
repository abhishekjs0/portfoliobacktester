import { MarketingShell } from "@/components/marketing-shell";
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


export default function Home() {
  return (
    <MarketingShell>
      <main className="landing-root">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__copy">
              <span className="hero__eyebrow">TradingView-grade interface</span>
              <h1 id="hero-heading">Made to trade smarter</h1>
              <p>
                Get a professional-grade workspace modelled after TradingView. Upload your Strategy Tester
                CSV, blend multiple symbols, and surface clean portfolio analytics without leaving the browser.
              </p>
              <div className="hero__cta">
                <a className="button button--primary" href="#upload-panel">
                  Start analysing
                </a>
                <a className="button button--ghost" href="#benefits">
                  Explore platform
                </a>
              </div>
              <dl className="hero__stats" aria-label="Platform highlights">
                <div className="hero__stat">
                  <dt>Upload latency</dt>
                  <dd>&lt; 3s for 50k rows</dd>
                </div>
                <div className="hero__stat">
                  <dt>Equity overlays</dt>
                  <dd>Unlimited symbols</dd>
                </div>
                <div className="hero__stat">
                  <dt>Risk snapshots</dt>
                  <dd>Live VaR &amp; drawdown</dd>
                </div>
              </dl>
            </div>
            <div className="hero__panel" id="upload-panel">
              <div className="hero__toolbar" role="group" aria-label="Broker filters">
                <button type="button" className="hero__toolbar-chip hero__toolbar-chip--active">
                  Best rated
                </button>
                <button type="button" className="hero__toolbar-chip">
                  All brokers
                </button>
                <button type="button" className="hero__toolbar-chip">
                  Futures
                </button>
                <button type="button" className="hero__toolbar-chip">
                  Options
                </button>
              </div>
              <article className="hero__broker-card" aria-label="Broker promotion preview">
                <header className="hero__broker-header">
                  <div>
                    <span className="hero__badge hero__badge--silver">Dhan</span>
                    <span className="hero__broker-type">Stocks · Futures · Options</span>
                  </div>
                  <span className="hero__rating">
                    4.6
                    <span aria-hidden="true">★</span>
                  </span>
                </header>
                <div className="hero__broker-body">
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">Equity curve</span>
                    <span className="hero__broker-value">+18.2%</span>
                  </div>
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">Win rate</span>
                    <span className="hero__broker-value">61%</span>
                  </div>
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">Drawdown</span>
                    <span className="hero__broker-value">-6.4%</span>
                  </div>
                  <div className="hero__broker-pill">Free demat · ₹0 AMC</div>
                </div>
                <div className="hero__broker-actions">
                  <button type="button" className="button button--primary">
                    Open account
                  </button>
                  <button type="button" className="button button--ghost">
                    Compare
                  </button>
                </div>
              </article>
              <form className="hero__upload" aria-label="Upload TradingView CSV">
                <div className="hero__upload-box">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    className="hero__upload-icon"
                  >
                    <path
                      d="M24 12v18m0-18-6 6m6-6 6 6M16 30h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="5"
                      y="5"
                      width="38"
                      height="38"
                      rx="11"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity="0.25"
                    />
                  </svg>
                  <p className="hero__upload-title">Drop your TradingView CSV</p>
                  <p className="hero__upload-subtitle">
                    Drag &amp; drop your Strategy Tester export or browse to import manually.
                  </p>
                  <label htmlFor="hero-upload" className="button button--outline hero__upload-button">
                    Choose file
                  </label>
                  <input id="hero-upload" type="file" accept=".csv" className="hero__file-input" />
                  <p className="hero__upload-hint">CSV exports only · Max 20MB</p>
                </div>
                <p className="hero__disclaimer">
                  Processing happens locally in your browser session. No trading data is persisted.
                </p>
              </form>
            </div>
          </div>
        </section>
        <section className="landing-section" id="benefits" aria-labelledby="benefits-heading">
          <div className="landing-container">
            <h2 id="benefits-heading" className="landing-section-title">Why traders are switching</h2>
            <div className="landing-grid" role="list">
              {keyBenefits.map((benefit) => (
                <article key={benefit.title} className="landing-card" role="listitem">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

      <section className="landing-section" id="pain" aria-labelledby="pain-heading">
        <div className="landing-container">
          <h2 id="pain-heading" className="landing-section-title">The current workaround is broken</h2>
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
          <h2 id="flow-heading" className="landing-section-title">Designed for seamless multi-symbol workflows</h2>
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

      <section className="landing-section" aria-labelledby="faq-heading">
        <div className="landing-container">
          <h2 id="faq-heading" className="landing-section-title">Frequently asked questions</h2>
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
            <form className="landing-inline-form" aria-label="Reserve spot">
              <label className="sr-only" htmlFor="cta-email">Email address</label>
              <input id="cta-email" type="email" placeholder="Email address" required />
              <button type="submit" className="landing-btn" data-analytics-event="cta_waitlist">Reserve my spot</button>
            </form>
          </div>
        </div>
      </section>
      </main>
    </MarketingShell>
  );
}
