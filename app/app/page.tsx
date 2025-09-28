import type { ReactNode } from "react";
import Link from "next/link";

import { MarketingShell } from "@/components/marketing-shell";
import { HeroUploadForm } from "@/components/hero-upload-form";
import { keyBenefits } from "../lib/marketing-content";

const iconLibrary: Record<string, ReactNode> = {
  merge: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M6 7v10" />
      <path d="M6 12h8" />
    </svg>
  ),
  layout: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    </svg>
  ),
  loop: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 6h5a6 6 0 0 1 6 6" />
      <path d="m15 8 3-3 3 3" />
      <path d="M17 18h-5a6 6 0 0 1-6-6" />
      <path d="m9 16-3 3-3-3" />
    </svg>
  ),
  single: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3" width="7" height="18" rx="2" />
      <path d="M15 6h5" />
      <path d="M15 12h5" />
      <path d="M15 18h5" />
    </svg>
  ),
  spreadsheet: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 4v16" />
    </svg>
  ),
  slow: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8" />
      <path d="M8 20h8" />
      <path d="M8 4c0 3 4 5 4 8s-4 5-4 8" />
      <path d="M16 4c0 3-4 5-4 8s4 5 4 8" />
    </svg>
  ),
  blindspot: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2.5-4 6.5-7 10-7s7.5 3 10 7c-2.5 4-6.5 7-10 7S4.5 16 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M4 4l16 16" />
    </svg>
  ),
};

const painPoints = [
  {
    title: "TradingView is single-symbol",
    description:
      "Strategy Tester only handles one ticker at a time, leaving portfolio-level risk hidden until trades collide.",
    icon: "single",
    accent: "rose",
  },
  {
    title: "Spreadsheet gymnastics",
    description:
      "Exporting, merging, and charting results manually drains hours every week and invites avoidable errors.",
    icon: "spreadsheet",
    accent: "amber",
  },
  {
    title: "Slow iteration loops",
    description:
      "Parameter tweaks demand dozens of re-runs. Waiting on exports kills creative momentum when optimising.",
    icon: "slow",
    accent: "violet",
  },
  {
    title: "Confidence gap",
    description:
      "Without aggregated equity curves and risk insights, traders hesitate to scale position size or deploy capital.",
    icon: "blindspot",
    accent: "teal",
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
              <span className="hero__eyebrow">BacktestLab for TradingView</span>
              <h1 id="hero-heading">Test your TradingView strategy on multiple scripts</h1>
              <p>
                Stack up to 100 TradingView exports in one upload and instantly see the combined equity curve, KPIs, and trade
                log without building another spreadsheet.
              </p>
              <div className="hero__cta">
                <a className="button button--primary" href="#upload-panel">
                  Start analysing
                </a>
                <Link className="button button--ghost" href="/guide">
                  Read user guide
                </Link>
              </div>
              <article className="hero__broker-card" aria-label="Sample portfolio backtest">
                <header className="hero__broker-header">
                  <div>
                    <span className="hero__badge hero__badge--silver">Sample multi-symbol mix</span>
                    <span className="hero__broker-type">6 symbols · Daily timeframe</span>
                  </div>
                  <span className="hero__rating">
                    18.7%
                    <span aria-hidden="true">▲</span>
                  </span>
                </header>
                <div className="hero__broker-body">
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">12M CAGR</span>
                    <span className="hero__broker-value">+18.7%</span>
                  </div>
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">Max drawdown</span>
                    <span className="hero__broker-value">-7.9%</span>
                  </div>
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">Win rate</span>
                    <span className="hero__broker-value">58%</span>
                  </div>
                  <div className="hero__broker-metric">
                    <span className="hero__broker-label">Sharpe</span>
                    <span className="hero__broker-value">1.42</span>
                  </div>
                </div>
              </article>
            </div>
            <div className="hero__panel" id="upload-panel">
              <HeroUploadForm />
            </div>
          </div>
        </section>

        <section className="landing-section" id="pain" aria-labelledby="pain-heading">
          <div className="landing-container">
            <h2 id="pain-heading" className="landing-section-title">
              The current workaround is broken
            </h2>
            <div className="landing-grid feature-grid" role="list">
              {painPoints.map((pain) => (
                <article key={pain.title} className="feature-card" role="listitem" data-variant={pain.accent}>
                  <span className="feature-card__icon" aria-hidden="true">
                    {iconLibrary[pain.icon]}
                  </span>
                  <h3 className="feature-card__title">{pain.title}</h3>
                  <p className="feature-card__copy">{pain.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section" id="benefits" aria-labelledby="benefits-heading">
          <div className="landing-container">
            <h2 id="benefits-heading" className="landing-section-title">
              Why traders are switching
            </h2>
            <div className="landing-grid feature-grid" role="list">
              {keyBenefits.map((benefit) => (
                <article key={benefit.title} className="feature-card" role="listitem" data-variant={benefit.accent}>
                  <span className="feature-card__icon" aria-hidden="true">
                    {benefit.icon ? iconLibrary[benefit.icon] : iconLibrary.merge}
                  </span>
                  <h3 className="feature-card__title">{benefit.title}</h3>
                  <p className="feature-card__copy">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta-strip" aria-labelledby="cta-heading">
          <div className="landing-container">
            <div className="landing-cta-box">
              <div>
                <h3 id="cta-heading">Ready to test smarter portfolios?</h3>
                <p>Create your BacktestLab account and start analysing multi-symbol strategies in minutes.</p>
              </div>
              <div className="landing-inline-form" role="presentation">
                <Link className="landing-btn" href="/signup" data-analytics-event="cta_signup">
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
