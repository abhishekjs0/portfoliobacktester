import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, SidebarNav } from "@backtester/ui";
import type { SidebarItem } from "@backtester/ui";
import { ThemeProvider } from "./ThemeProvider";
import { DarkModeToggle } from "./DarkModeToggle";

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/backtests", label: "Backtests", icon: "📈" },
  { href: "/feedback", label: "Feedback", icon: "💬" },
  { href: "/pricing", label: "Pricing", icon: "💳" },
];

const dashboardPrefixes = ["/dashboard", "/backtests", "/feedback"];

function Shell({ children }: PropsWithChildren) {
  const location = useLocation();
  const isDashboard = dashboardPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix),
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            BacktestLab
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex" aria-label="Main">
            <Link className="transition hover:text-white" to="/#features">
              Features
            </Link>
            <Link className="transition hover:text-white" to="/#backtests">
              Backtests
            </Link>
            <Link className="transition hover:text-white" to="/pricing">
              Pricing
            </Link>
            <Link className="transition hover:text-white" to="/login">
              Log In
            </Link>
            <Link className="transition hover:text-white" to="/signup">
              Sign Up
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:bg-fuchsia-400"
            >
              <Link to="/signup">Start Free Backtest</Link>
            </Button>
            <DarkModeToggle />
          </div>
        </div>
        <nav className="border-t border-slate-800 bg-slate-950/90 md:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <Link className="shrink-0 text-slate-300 transition hover:text-white" to="/#features">
              Features
            </Link>
            <Link className="shrink-0 text-slate-300 transition hover:text-white" to="/#backtests">
              Backtests
            </Link>
            <Link className="shrink-0 text-slate-300 transition hover:text-white" to="/pricing">
              Pricing
            </Link>
            <Link className="shrink-0 text-slate-300 transition hover:text-white" to="/login">
              Log In
            </Link>
            <Link className="shrink-0 text-slate-300 transition hover:text-white" to="/signup">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>
      <div className="flex flex-1">
        {isDashboard ? (
          <aside className="hidden w-64 shrink-0 lg:block">
            <SidebarNav
              items={sidebarItems}
              header="Workspace"
              footer={<Link to="/logout">Sign out</Link>}
            />
          </aside>
        ) : null}
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
        </main>
      </div>
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-sm text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">&copy; 2025 BacktestLab – Built by traders, for traders.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/#features" className="transition hover:text-white">
              Features
            </Link>
            <Link to="/pricing" className="transition hover:text-white">
              Pricing
            </Link>
            <Link to="/#roadmap" className="transition hover:text-white">
              Roadmap
            </Link>
            <Link to="/feedback" className="transition hover:text-white">
              Feedback
            </Link>
            <Link to="/guide" className="transition hover:text-white">
              User Guide
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
