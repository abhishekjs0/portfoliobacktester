"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import { formatDate } from "../lib/format";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type EquityChartProps = {
  equityCurve: Array<{ timestamp: string; value: number }>;
  drawdown: Array<{ timestamp: string; value: number }>;
};

export function EquityChart({ equityCurve, drawdown }: EquityChartProps) {
  const data = useMemo(() => {
    const labels = equityCurve.map((point) => formatDate(point.timestamp));
    return {
      labels,
      datasets: [
        {
          label: "Equity",
          data: equityCurve.map((point) => point.value),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Drawdown",
          data: drawdown.map((point) => point.value * 100),
          yAxisID: "drawdown",
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderDash: [6, 4],
          fill: false,
        },
      ],
    };
  }, [equityCurve, drawdown]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            color: "#cbd5f5",
          },
          grid: {
            color: "rgba(148, 163, 184, 0.1)",
          },
        },
        drawdown: {
          position: "right" as const,
          ticks: {
            color: "#f87171",
            callback: (value: number | string) => `${value}%`,
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          ticks: {
            color: "#94a3b8",
          },
          grid: {
            color: "rgba(148, 163, 184, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#e2e8f0",
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="tv-card h-96 p-4">
      <Line data={data} options={options} />
    </div>
  );
}
