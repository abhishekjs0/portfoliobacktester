import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
  srLabel?: string;
}

const trendColors: Record<Exclude<MetricCardProps["trend"], undefined>, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
  flat: "text-slate-500 dark:text-slate-400",
};

export function MetricCard({ label, value, trend = "flat", srLabel, className, ...props }: MetricCardProps) {
  return (
    <div
      className={clsx(
        "metric-card rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6",
        "shadow-sm",
        className
      )}
      {...props}
    >
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white" aria-label={srLabel}>
        {value}
      </p>
      <p className={clsx("mt-1 text-sm font-medium", trendColors[trend])}>
        {trend === "up" && "▲"}
        {trend === "down" && "▼"}
        {trend === "flat" && "―"} {trend === "flat" ? "No change" : trend === "up" ? "Improving" : "Declining"}
      </p>
    </div>
  );
}
