import { useState } from "react";
import { Button, Card, CSVUpload, MetricCard, Modal } from "@backtester/ui";

export default function DashboardHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      <section className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Total return" value="42.8%" trend="up" srLabel="Total return forty two point eight percent" />
        <MetricCard label="Max drawdown" value="-12.1%" trend="down" srLabel="Maximum drawdown negative twelve point one percent" />
        <MetricCard label="Sharpe ratio" value="1.18" trend="up" srLabel="Sharpe ratio one point one eight" />
        <MetricCard label="Win rate" value="56%" trend="up" srLabel="Win rate fifty six percent" />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card heading="Upload backtests" footer={<Button onClick={() => setIsModalOpen(true)}>Upload CSVs</Button>}>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Combine multiple TradingView exports into a single portfolio run. Drag in your CSVs to start analysis instantly.
          </p>
          {selectedFile ? (
            <p className="mt-4 text-sm text-emerald-600">Last uploaded: {selectedFile}</p>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No files uploaded yet.</p>
          )}
        </Card>
        <Card heading="Latest activity">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
            <li>Momentum Basket – queued 2 minutes ago</li>
            <li>Mean Reversion Portfolio – completed 1 hour ago</li>
            <li>Feedback sent to team – yesterday</li>
          </ul>
        </Card>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload CSV files">
        <CSVUpload
          onFileSelect={(file) => {
            setSelectedFile(file.name);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
