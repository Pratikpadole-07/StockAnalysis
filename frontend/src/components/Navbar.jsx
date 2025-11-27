import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const goHome = () => {
    if (token) window.location.href = "/dashboard";
    else window.location.href = "/login";
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/analytics", label: "Analytics" },
    { path: "/history", label: "History" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700 text-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h2
          onClick={goHome}
          className="text-2xl font-bold text-yellow-400 cursor-pointer hover:scale-110 transition-all"
        >
          StockSim
        </h2>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {token &&
            navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition ${
                  isActive(item.path)
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

          {/* FIX: Removed button wrapper */}
          <ThemeToggle />

          {token ? (
            <button
              onClick={logout}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-lg bg-yellow-500 font-medium hover:bg-yellow-600 text-black text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-gray-900/95 px-6 pb-4 flex flex-col gap-3 border-t border-gray-700">
          {token &&
            navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`text-sm py-2 transition ${
                  isActive(item.path)
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

          <ThemeToggle />

          {token ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-lg bg-yellow-500 font-medium hover:bg-yellow-600 text-black text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
