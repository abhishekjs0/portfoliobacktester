import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
  footer?: ReactNode;
  as?: "div" | "article";
}

export function Card({ heading, footer, children, className, as: Component = "div", ...props }: CardProps) {
  return (
    <Component
      className={clsx(
        "card bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm",
        "card",
        className
      )}
      {...props}
    >
      {heading ? <header className="card__header px-6 pt-6 text-lg font-semibold">{heading}</header> : null}
      <div className={clsx("card__body px-6", heading ? "pt-4" : "pt-6", footer ? "pb-4" : "pb-6")}>{children}</div>
      {footer ? <footer className="card__footer px-6 pb-6 text-sm text-slate-500 dark:text-slate-400">{footer}</footer> : null}
    </Component>
  );
}
