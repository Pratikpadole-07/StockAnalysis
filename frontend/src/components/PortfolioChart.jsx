import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function PortfolioChart({ history }) {
  if (!history || history.length === 0) return null;

  const chartData = {
    labels: history.map(h => new Date(h.time).toLocaleTimeString()),
    datasets: [
      {
        label: "Net Worth",
        data: history.map(h => h.value),
        borderColor: "#00ff90",
        borderWidth: 2,
        fill: true,
        backgroundColor: "rgba(0,255,144,0.15)",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 shadow-xl my-8">
      <h2 className="text-xl font-semibold mb-3 text-green-300">
        📈 Net Worth Over Time
      </h2>
      <Line data={chartData} height={100} />
    </div>
  );
}
