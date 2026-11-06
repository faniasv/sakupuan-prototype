"use client";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const rp = (n) => `Rp ${Math.abs(n).toLocaleString("id-ID")}`;
const pctLabel = (n) => n.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function InsightChart({ breakdown, flowLabel, flowTotal }) {
  const chartData = {
    labels: breakdown.map((b) => b.label),
    datasets: [
      {
        data: breakdown.map((b) => b.amount),
        backgroundColor: breakdown.map((b) => b.color),
        borderColor: "#FFFFFF",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    cutout: "56%",
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        backgroundColor: "#1E2D24",
        padding: 10,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => ` ${rp(ctx.parsed)} (${pctLabel(breakdown[ctx.dataIndex].pct)}%)`,
        },
      },
    },
  };

  return (
    <div className="relative w-56 h-56 mx-auto my-6">
      <Doughnut data={chartData} options={chartOptions} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-semibold text-sakuText-light">Total {flowLabel}</span>
        <span className="text-[15px] font-extrabold text-sakuText tabular-nums">{rp(flowTotal)}</span>
      </div>
    </div>
  );
}