
import { ReactNode } from "react";
import Providers from "@/components/providers";
import "@/styles/globals.css";

export const metadata = {
  title: "Portfolio Backtester",
  description: "Test and analyze trading strategies across multiple symbols.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
