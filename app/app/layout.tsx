import "../styles/globals.css";
import { ReactNode } from "react";
import Providers from "../components/providers";

export const metadata = {
  title: "Portfolio Backtester",
  description: "Equal-weight TradingView portfolio analytics",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
