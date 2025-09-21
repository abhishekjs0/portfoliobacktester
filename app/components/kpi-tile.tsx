import { formatCurrency, formatPercent } from "../lib/format";

type KPIProps = {
  label: string;
  value: number;
  format?: "currency" | "percent" | "raw";
  currency?: string;
};

export function KPITile({
  label,
  value,
  format = "raw",
  currency = "USD",
}: KPIProps) {
  const formatted =
    format === "currency"
      ? formatCurrency(value, currency)
      : format === "percent"
        ? formatPercent(value)
        : value.toLocaleString();
  return (
    <div className="tv-card p-4">
      <p className="tv-subtle">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{formatted}</p>
    </div>
  );
}
