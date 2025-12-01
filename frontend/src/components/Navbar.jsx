import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-[9999] px-10 py-3 flex justify-between items-center">

      <Link to="/" className="text-2xl font-bold tracking-wide">📈 StockPro</Link>

      <div className="flex gap-6 text-lg">
        <Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/leaderboard" className="hover:text-yellow-400">Leaderboard</Link>
        <Link to="/analytics" className="hover:text-yellow-400">Analytics</Link>
        <Link to="/trade-history" className="hover:text-yellow-400">History</Link>

        {token ? (
          <button onClick={logout} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700">
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700">Login</button>
          </Link>
        )}
      </div>

    </div>
  );
}
