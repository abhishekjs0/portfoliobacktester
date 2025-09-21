import { Card, Button } from "@backtester/ui";

const runs = [
  {
    id: "bt-001",
    name: "Momentum Basket",
    createdAt: "2024-05-21 09:15",
    status: "Completed",
  },
  {
    id: "bt-002",
    name: "Mean Reversion",
    createdAt: "2024-05-21 08:41",
    status: "Queued",
  },
];

export default function BacktestsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Backtests</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Track every portfolio simulation and drill into combined performance.
          </p>
        </div>
        <Button>New backtest</Button>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  Created
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {runs.map((run) => (
                <tr key={run.id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{run.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{run.createdAt}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{run.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
