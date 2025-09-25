import Link from "next/link";

const scriptHighlights = [
  {
    title: "Pine-compatible editor",
    description:
      "Auto-complete, linting and console output mirror TradingView so you can port scripts across with zero friction.",
  },
  {
    title: "Version control built in",
    description:
      "Branch, diff and revert script iterations. Every change is logged so your desk can audit execution logic.",
  },
  {
    title: "Direct portfolio wiring",
    description:
      "Push scripts straight into multi-symbol backtests, monitor performance and convert into live alerts when ready.",
  },
];

export default function ScriptsPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Strategy scripts</span>
          <h1 className="marketing-hero__title">Code, test and deploy without leaving the chart</h1>
          <p className="marketing-hero__sub">
            Bring your Pine or Python indicators into a TradingView-inspired IDE and
            ship them to live backtests in minutes.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/signup" className="button button--primary">
              Start coding
            </Link>
            <Link href="/backtests?demo=scripts" className="button button--outline">
              View sample script
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="scripts-highlights">
        <div className="landing-container">
          <h2 id="scripts-highlights" className="landing-section-title">
            Built for systematic teams
          </h2>
          <div className="landing-grid" role="list">
            {scriptHighlights.map((highlight) => (
              <article key={highlight.title} className="landing-card" role="listitem">
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="scripts-cta">
        <div className="landing-container">
          <div className="landing-cta-box">
            <div>
              <span className="landing-badge">Automate workflows</span>
              <h2 id="scripts-cta">Deploy alerts straight from backtests</h2>
              <p>
                Promote a successful script to live monitoring, route to Slack or
                broker APIs and keep a full audit trail.
              </p>
            </div>
            <div className="marketing-hero__cta">
              <Link href="/pricing" className="button button--primary">
                Unlock automation
              </Link>
              <Link href="/roadmap" className="button button--outline">
                View roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
