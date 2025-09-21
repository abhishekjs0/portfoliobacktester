import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface SidebarNavProps {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
}

export function SidebarNav({ items, header, footer }: SidebarNavProps) {
  return (
    <nav className="sidebar-nav flex h-full flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" aria-label="Sidebar">
      {header ? <div className="px-6 py-4 text-base font-semibold text-slate-900 dark:text-white">{header}</div> : null}
      <ul className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900"
                )
              }
            >
              {item.icon ? <span aria-hidden="true" className="text-lg">{item.icon}</span> : null}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {footer ? <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-3 text-sm text-slate-500 dark:text-slate-400">{footer}</div> : null}
    </nav>
  );
}
