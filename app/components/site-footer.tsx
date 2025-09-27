import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <h2 className="site-footer__title">BacktestLab</h2>
          <p className="site-footer__copy">
            The missing multi-symbol backtesting layer for TradingView
            power-users. Upload CSVs, aggregate instantly and act with
            confidence.
          </p>
        </div>
        <div className="site-footer__links">
          <div>
            <h3>Product</h3>
            <ul>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/backtests">Backtests</Link>
              </li>
              <li>
                <Link href="/guide">User guide</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li>
                <Link href="/feedback">Feedback</Link>
              </li>
              <li>
                <Link href="/signup">Create account</Link>
              </li>
              <li>
                <Link href="/login">Log in</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="site-footer__meta">
        <p>
          © {new Date().getFullYear()} BacktestLab. All rights
          reserved.
        </p>
        <div className="site-footer__meta-links">
          <Link href="#">Terms</Link>
          <Link href="#">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
