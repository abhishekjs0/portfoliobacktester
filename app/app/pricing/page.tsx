import Link from "next/link";
import { faqItems, pricingPlans } from "../../lib/marketing-content";

export default function PricingPage() {
  const supportFaq = faqItems.slice(3, 6);

  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Simple pricing</span>
          <h1 className="marketing-hero__title">Flexible plans for every stage of your trading journey</h1>
          <p className="marketing-hero__sub">
            Start free, upgrade when you need higher symbol limits, automation or advanced analytics. No contracts, cancel any
            time.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/signup" className="button button--primary">
              Start free
            </Link>
            <Link href="/features" className="button button--outline">
              Explore features
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="plans-heading">
        <div className="landing-container">
          <h2 id="plans-heading" className="landing-section-title">
            Choose a plan that scales with your research
          </h2>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className="plan-card">
                <div className="plan-card__badge">{plan.badge}</div>
                <h3>{plan.name}</h3>
                <p className="plan-card__price">
                  {plan.price}
                  <span>{plan.cadence}</span>
                </p>
                <p className="plan-card__description">{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link href="/signup" className="button button--primary plan-card__cta">
                  {plan.name === "Free" ? "Create free account" : `Upgrade to ${plan.name}`}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="billing-faq">
        <div className="landing-container">
          <h2 id="billing-faq" className="landing-section-title">
            Billing questions, answered
          </h2>
          <div className="faq-grid">
            {supportFaq.map((faq) => (
              <article key={faq.question} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section--cta" aria-labelledby="pricing-cta">
        <div className="landing-container">
          <div className="landing-cta-box">
            <div>
              <span className="landing-badge">Need a custom plan?</span>
              <h2 id="pricing-cta">Talk to us about enterprise or prop-firm deployments</h2>
              <p>White-label options, API quotas and dedicated support available for desks that need custom agreements.</p>
            </div>
            <Link href="mailto:hello@portfoliobacktester.com" className="button button--outline">
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
