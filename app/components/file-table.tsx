import { formatCurrency, formatDate } from "../lib/format";

interface FileTableProps {
  trades: Array<Record<string, unknown>>;
}

export function FileTable({ trades }: FileTableProps) {
  if (!trades.length) {
    return (
      <div className="tv-card p-6 text-sm text-slate-400">
        No trades in range.
      </div>
    );
  }

  const headers = Object.keys(trades[0] ?? {});

  return (
    <div className="tv-card overflow-auto">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-white/5">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-2 text-left font-semibold uppercase tracking-wide text-xs text-slate-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {trades.map((trade, index) => (
            <tr key={index} className="hover:bg-white/5">
              {headers.map((header) => {
                const value = trade[header];
                if (typeof value === "number") {
                  if (
                    header.toLowerCase().includes("p&l") ||
                    header.toLowerCase().includes("price")
                  ) {
                    return (
                      <td
                        key={header}
                        className="px-4 py-2 text-right font-mono"
                      >
                        {formatCurrency(value)}
                      </td>
                    );
                  }
                  if (
                    header.toLowerCase().includes("run") ||
                    header.toLowerCase().includes("drawdown")
                  ) {
                    return (
                      <td
                        key={header}
                        className="px-4 py-2 text-right font-mono"
                      >
                        {formatCurrency(value)}
                      </td>
                    );
                  }
                  return (
                    <td key={header} className="px-4 py-2 text-right font-mono">
                      {value.toFixed(2)}
                    </td>
                  );
                }
                if (typeof value === "string" && value.includes("T")) {
                  return (
                    <td
                      key={header}
                      className="px-4 py-2 whitespace-nowrap text-slate-200"
                    >
                      {formatDate(value)}
                    </td>
                  );
                }
                return (
                  <td key={header} className="px-4 py-2 text-slate-200">
                    {String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
