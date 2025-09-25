import Link from "next/link";

const ideaPillars = [
  {
    title: "Strategy playbooks",
    description:
      "Curated screeners and pine snippets help you go from inspiration to executable setups without leaving the workspace.",
  },
  {
    title: "Community sentiment",
    description:
      "Surface trending tickers, analyst writeups and macro narratives so you know what the street is watching today.",
  },
  {
    title: "Backtest ready",
    description:
      "Send any idea directly into a portfolio simulation, compare edge across timeframes and publish your results to the desk.",
  },
];

export default function IdeasPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Trading ideas</span>
          <h1 className="marketing-hero__title">Discover, iterate and share alpha</h1>
          <p className="marketing-hero__sub">
            Get a TradingView-style stream of trade theses, analyst notes and chart
            breakdowns you can plug into your portfolio tests in seconds.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/signup" className="button button--primary">
              Join the community
            </Link>
            <Link href="/backtests?demo=ideas" className="button button--outline">
              Run a sample idea
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="ideas-pillars">
        <div className="landing-container">
          <h2 id="ideas-pillars" className="landing-section-title">
            Built for collaborative research
          </h2>
          <div className="landing-grid" role="list">
            {ideaPillars.map((pillar) => (
              <article key={pillar.title} className="landing-card" role="listitem">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section--cta" aria-labelledby="ideas-cta">
        <div className="landing-container">
          <div className="landing-cta-box">
            <div>
              <span className="landing-badge">Share your edge</span>
              <h2 id="ideas-cta">Publish insights with one click</h2>
              <p>
                Send annotated charts and CSV outputs to teammates, embed them into
                decks or make them public to build your TradingView following.
              </p>
            </div>
            <div className="marketing-hero__cta">
              <Link href="/signup" className="button button--primary">
                Start posting
              </Link>
              <Link href="/pricing" className="button button--outline">
                Compare plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
