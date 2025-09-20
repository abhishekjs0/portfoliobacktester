import "../styles/globals.css";
import { ReactNode } from "react";
import Providers from "../components/providers";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const metadata = {
  title: "Portfolio Backtester",
  description: "Equal-weight TradingView portfolio analytics",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
