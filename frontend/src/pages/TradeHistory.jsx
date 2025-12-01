import React, { useEffect, useState } from "react";
import { getTradeHistory } from "../api/api";

export default function TradeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getTradeHistory();
      setHistory(res.data.data || []); // 👈 FIXED
    } catch (err) {
      console.error("Failed to load trade history:", err);
      setHistory([]);
    }
    setLoading(false);
  };

  if (loading)
    return <p className="mt-10 text-center text-gray-400">Loading history...</p>;

  return (
    <div className="min-h-screen p-8 transition-colors duration-500
    bg-gray-100 text-black
    dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
    dark:text-white">

      <h2 className="text-3xl font-semibold mb-6">📜 Trade History</h2>

      {history.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No trades yet...</p>
      ) : (
        <table className="w-full border border-gray-700 bg-gray-800/50 rounded-xl overflow-hidden">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="p-3">Stock</th>
              <th className="p-3">Type</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h) => (
              <tr
                key={h._id}
                className="border-t border-gray-700 hover:bg-gray-700/30 transition"
              >
                <td className="p-3">{h.symbol}</td>

                <td className={`p-3 font-semibold ${
                  h.type === "BUY" ? "text-green-400" : "text-red-400"
                }`}>
                  {h.type}
                </td>

                <td className="p-3">{h.quantity}</td>

                <td className="p-3">₹{Number(h.price).toFixed(2)}</td>

                <td className="p-3">
                  {new Date(h.date).toLocaleString("en-IN", {
                    hour12: false,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
