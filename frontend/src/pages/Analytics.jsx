import React, { useEffect, useState } from "react";
import { getPortfolioStats } from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  const format = (num) =>
    typeof num === "number" && !isNaN(num) ? num.toFixed(2) : "0.00";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getPortfolioStats();
      setStats(res.data.data || {});
    } catch (err) {
      console.log("Failed to fetch stats", err);
    }
  };

  if (!stats)
    return <p className="text-center text-white p-6">Loading analytics...</p>;

  const COLORS = ["#FF9800", "#4CAF50", "#2196F3", "#E91E63", "#9C27B0"];

  const pieData = (stats.holdings || []).map((h) => ({
    name: h.symbol,
    value: (h.quantity || 0) * (h.currentPrice || 0),
  }));

  const lineData = [
    { time: "Start", value: stats.investedValue || 0 },
    { time: "Now", value: stats.currentValue || 0 },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-black dark:bg-black dark:text-white">
      <h1 className="text-4xl font-bold mb-8">📊 Portfolio Analytics</h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="opacity-80">Invested Value</h3>
          <p className="text-xl font-bold text-yellow-300">
            ₹{format(stats.investedValue)}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="opacity-80">Current Value</h3>
          <p className="text-xl font-bold text-green-400">
            ₹{format(stats.currentValue)}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="opacity-80">Net Profit/Loss</h3>
          <p className={`text-xl font-bold ${stats.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
            ₹{format(stats.profitLoss)}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="font-semibold mb-4">Holdings Allocation</h3>

          {pieData.length === 0 ? (
            <p className="text-center text-gray-400 mt-4">No investments yet. Buy some stocks! 📈</p>
          ) : (
            <PieChart width={400} height={350}>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120}>
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>

        {/* Line Chart */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="font-semibold mb-4">Net Worth Growth</h3>
          <LineChart width={400} height={350} data={lineData}>
            <CartesianGrid stroke="#555" strokeDasharray="4 4" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00eaff" strokeWidth={3} />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
