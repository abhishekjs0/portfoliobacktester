import Link from "next/link";

export default function MarketsPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Market data hub</span>
          <h1 className="marketing-hero__title">Stay on top of every market open</h1>
          <p className="marketing-hero__sub">
            Track global indices, crypto pairs and futures curves side by side. The
            workspace mirrors TradingView so you instantly feel at home.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/signup" className="button button--primary">
              Create free account
            </Link>
            <Link href="/backtests?demo=markets" className="button button--outline">
              Explore demo layout
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="market-coverage">
        <div className="landing-container">
          <h2 id="market-coverage" className="landing-section-title">
            Coverage designed for active desks
          </h2>
          <div className="landing-grid" role="list">
            {["Equities & ETFs", "Crypto & DeFi", "Derivatives", "Macro & Rates"].map(
              (segment) => (
                <article key={segment} className="landing-card" role="listitem">
                  <h3>{segment}</h3>
                  <p>
                    Stream consolidated candles, depth snapshots and sentiment so you
                    can react to setups without bouncing between tabs.
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="market-integrations">
        <div className="landing-container">
          <h2 id="market-integrations" className="landing-section-title">
            Your brokers and data feeds, unified
          </h2>
          <div className="flow-grid">
            {["Interactive Brokers", "Binance", "OANDA", "Polygon.io"].map((provider) => (
              <article key={provider} className="flow-card">
                <span className="tag">Integration</span>
                <p className="flow-card__description">
                  {provider} connections sync watchlists, backtest assets and live quotes
                  so your TradingView muscle memory translates instantly.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
