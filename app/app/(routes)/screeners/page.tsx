import Link from "next/link";

const screenerBlocks = [
  {
    title: "Multi-asset filters",
    description:
      "Screen equities, futures and crypto on the same canvas with TradingView-style filter chips and instant previews.",
  },
  {
    title: "Saved layouts",
    description:
      "Pin your favorite column groups, conditional color rules and sort states. Everything syncs across devices.",
  },
  {
    title: "Seamless exports",
    description:
      "Send screener results straight to CSV or into a backtest scenario without juggling downloads and uploads.",
  },
];

export default function ScreenersPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Screeners</span>
          <h1 className="marketing-hero__title">Find setups with TradingView precision</h1>
          <p className="marketing-hero__sub">
            Scan the market using familiar filters, heatmaps and performance metrics.
            When you spot the signal, test it immediately.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/signup" className="button button--primary">
              Try the screener
            </Link>
            <Link href="/backtests?demo=screeners" className="button button--outline">
              Launch sample screen
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="screener-blocks">
        <div className="landing-container">
          <h2 id="screener-blocks" className="landing-section-title">
            Optimized for daily workflows
          </h2>
          <div className="landing-grid" role="list">
            {screenerBlocks.map((block) => (
              <article key={block.title} className="landing-card" role="listitem">
                <h3>{block.title}</h3>
                <p>{block.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section--cta" aria-labelledby="screener-cta">
        <div className="landing-container">
          <div className="landing-cta-box">
            <div>
              <span className="landing-badge">Accelerate analysis</span>
              <h2 id="screener-cta">Promote the best lists to backtests</h2>
              <p>
                Convert a saved screen into a multi-symbol backtest with predefined
                risk rules, then iterate using the same workspace.
              </p>
            </div>
            <div className="marketing-hero__cta">
              <Link href="/pricing" className="button button--primary">
                Choose a plan
              </Link>
              <Link href="/features" className="button button--outline">
                View platform tour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
