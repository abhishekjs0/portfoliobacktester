import Link from "next/link";
import { flows, keyBenefits } from "../../lib/marketing-content";

export default function FeaturesPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Product tour</span>
          <h1 className="marketing-hero__title">From CSV upload to portfolio clarity in minutes</h1>
          <p className="marketing-hero__sub">
            Explore the building blocks that power the multi-symbol backtesting workflow—designed around the exact jobs traders
            told us they needed to finish.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/backtests?demo=1" className="button button--primary">
              Launch demo workspace
            </Link>
            <Link href="/signup" className="button button--outline">
              Create free account
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="feature-benefits">
        <div className="landing-container">
          <h2 id="feature-benefits" className="landing-section-title">
            Built around the jobs you hire us for
          </h2>
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

      <section className="marketing-section" aria-labelledby="flow-library">
        <div className="landing-container">
          <h2 id="flow-library" className="landing-section-title">
            Three core flows cover the entire lifecycle
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

      <section className="marketing-section" aria-labelledby="design-system">
        <div className="landing-container">
          <h2 id="design-system" className="landing-section-title">
            A design system for clarity and speed
          </h2>
          <div className="design-grid">
            <article className="card">
              <div className="card__header">Accessible tokens</div>
              <div className="card__body">
                Color, spacing and typography tokens mirror the design spec so every component—buttons, alerts, tags—stays
                consistent across marketing pages and in-app dashboards.
              </div>
            </article>
            <article className="card">
              <div className="card__header">Reusable components</div>
              <div className="card__body">
                Landing hero, KPI grids, flow cards and CTA banners are implemented as composable sections. Reuse them to extend
                future pages without duplicating code.
              </div>
            </article>
            <article className="card">
              <div className="card__header">Responsive layouts</div>
              <div className="card__body">
                Grid utilities adapt from mobile to widescreen, ensuring traders can review results on desktops, tablets or phones
                during market hours.
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section--cta" aria-labelledby="feature-cta">
        <div className="landing-container">
          <div className="landing-cta-box">
            <div>
              <span className="landing-badge">Ready when you are</span>
              <h2 id="feature-cta">Put the workflow to work on your data</h2>
              <p>
                Bring your TradingView exports, run portfolio simulations instantly and compare strategies without leaving the
                browser.
              </p>
            </div>
            <div className="marketing-hero__cta">
              <Link href="/upload" className="button button--primary">
                Upload CSVs
              </Link>
              <Link href="/pricing" className="button button--outline">
                Review pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
