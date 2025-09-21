import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarNav } from "@backtester/ui";
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            BacktestPro
          </Link>
          <nav className="flex items-center gap-4" aria-label="Main">
            <Link
              className="text-sm font-medium hover:text-indigo-600"
              to="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:text-indigo-600"
              to="/signup"
            >
              Sign up
            </Link>
            <Link
              className="text-sm font-medium hover:text-indigo-600"
              to="/login"
            >
              Log in
            </Link>
            <DarkModeToggle />
          </nav>
        </div>
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
      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} BacktestPro Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-indigo-600">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600">
              Terms
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
