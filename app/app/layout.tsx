import "../styles/globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Providers from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portfolio Backtester",
  description: "Equal-weight TradingView portfolio analytics",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-950 text-white">
        <Providers>
          <div className="min-h-screen bg-slate-900 text-slate-100">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
