"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const rp = (n) => `Rp ${n.toLocaleString("id-ID")}`;

export default function BalanceProjectionChart({ history, projection }) {
  const allLabels = [...history.map((h) => h.month), ...projection.map((p) => p.month)];
  const historyData = [...history.map((h) => h.balance), ...new Array(projection.length).fill(null)];
  const lastHistoryVal = history[history.length - 1].balance;
  const projectionData = [...new Array(history.length - 1).fill(null), lastHistoryVal, ...projection.map((p) => p.balance)];

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: "Historis",
        data: historyData,
        borderColor: "#1F5932",
        backgroundColor: "rgba(31,89,50,0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: "Proyeksi AI",
        data: projectionData,
        borderColor: "#E8743B",
        backgroundColor: "rgba(232,116,59,0.08)",
        borderDash: [4, 4],
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#1E2D24",
        padding: 10,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => ` Saldo: ${rp(ctx.parsed.y)}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: { callback: (v) => `Rp ${v / 1000000}jt`, font: { size: 10 } },
        grid: { color: "#F0F4F1" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  return (
    <div className="h-48 relative">
      <Line data={data} options={options} />
    </div>
  );
}