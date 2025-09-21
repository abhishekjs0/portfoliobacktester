import Link from "next/link";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/backtests", label: "Backtests" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/feedback", label: "Feedback" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          className="site-header__logo"
          aria-label="Portfolio backtester home"
        >
          <span className="site-header__mark" aria-hidden="true" />
          <span className="site-header__title">Portfolio Backtester</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="site-nav">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-nav__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <Link href="/login" className="button button--outline">
            Log in
          </Link>
          <Link href="/signup" className="button button--primary">
            Join beta
          </Link>
        </div>
      </div>
    </header>
  );
}
