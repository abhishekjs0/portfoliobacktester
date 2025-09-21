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
  );
}
