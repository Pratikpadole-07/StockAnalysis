import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../api/api";

export default function Leaderboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getLeaderboard();
    setUsers(res.data);
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-500
+   bg-gray-100 text-black
+   dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
+   dark:text-white">

      <h1 className="text-4xl font-bold mb-8 tracking-wide p-8 mt-15">Leaderboard</h1>

      <table className="w-full bg-gray-800/40 shadow-2xl border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-xl">

        <thead className="bg-gray-700 text-left">
          <tr>
            <th className="p-3">Rank</th>
            <th className="p-3">Name</th>
            <th className="p-3">Net Worth</th>
            <th className="p-3">P/L %</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {users.map((u, idx) => (
            <tr
              key={u._id}
              className="hover:bg-gray-700/50 transition-all"
            >
              <td className="p-3 font-bold text-yellow-300">#{idx + 1}</td>
              <td className="p-3">{u.name}</td>
              <td className="p-3 text-blue-400">₹{u.netWorth.toFixed(2)}</td>

              <td
                className={
                  "p-3 font-semibold " +
                  (u.profitPercent >= 0 ? "text-green-400" : "text-red-400")
                }
              >
                {u.profitPercent.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No users yet.</p>
      )}
    </div>
  );
}
