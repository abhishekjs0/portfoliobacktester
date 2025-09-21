import "../styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import Providers from "../components/providers";
<<<<<<< HEAD
import { AnalyticsTracker } from "../components/analytics-tracker";
import { CookieConsentBanner } from "../components/cookie-consent";
=======
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
>>>>>>> origin/main

const fallbackUrl = "https://portfoliobacktester.example";
const resolvedBase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl);
  } catch {
    return new URL(fallbackUrl);
  }
})();

const title = "Portfolio Backtester – Multi-Symbol Backtesting";
const description =
  "Run backtests on trading strategies with our SaaS platform – compare performance, compute risk metrics, and share results.";

export const metadata: Metadata = {
  metadataBase: resolvedBase,
  title: {
    default: title,
    template: "%s | Portfolio Backtester",
  },
  description,
  openGraph: {
    title: "SaaS Backtester – TradingView-Compatible Backtests",
    description,
    url: resolvedBase.href,
    type: "website",
    images: [
      {
        url: `${resolvedBase.origin}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Screenshot of the Portfolio Backtester dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Backtester – Trading Strategy Analysis",
    description,
    images: [`${resolvedBase.origin}/og-image.png`],
  },
  alternates: {
    canonical: resolvedBase.href,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="prefetch" href="/dashboard" as="document" />
        <link rel="prefetch" href="/upload" as="document" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Providers>
<<<<<<< HEAD
          <AnalyticsTracker />
          <div className="app-shell">
            <header className="site-header" role="banner">
              <nav className="site-nav" aria-label="Main navigation">
                <Link className="site-logo" href="/" data-analytics-event="nav_home">
                  Portfolio Backtester
                </Link>
                <div className="site-nav-links">
                  <Link href="/#how" data-analytics-event="nav_how">
                    How it works
                  </Link>
                  <Link href="/upload" data-analytics-event="nav_upload">
                    Upload
                  </Link>
                  <Link href="/#pain" data-analytics-event="nav_pain">
                    Problems we solve
                  </Link>
                </div>
              </nav>
            </header>
            <main id="main-content" tabIndex={-1} role="main">
              {children}
            </main>
            <footer className="site-footer">
              <p>&copy; {new Date().getFullYear()} Portfolio Backtester. All rights reserved.</p>
            </footer>
            <div id="toast-announcer" role="status" aria-live="polite" aria-atomic="true" className="sr-only" />
          </div>
          <CookieConsentBanner />
=======
          <div className="app-shell">
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </div>
>>>>>>> origin/main
        </Providers>
      </body>
    </html>
  );
}
