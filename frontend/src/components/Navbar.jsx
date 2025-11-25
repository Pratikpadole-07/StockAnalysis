import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-black/30 backdrop-blur-xl border-b border-gray-700 p-4 flex justify-between items-center mb-6 sticky top-0 z-50">

      {/* LEFT SECTION */}
      <div className="text-2xl font-bold text-yellow-400 tracking-wider">
        STOCKSIM
      </div>

      {/* CENTER LINKS */}
      <div className="flex space-x-6">

        <Link className="hover:text-yellow-400 transition" to="/dashboard">
          Dashboard
        </Link>

        <Link className="hover:text-yellow-400 transition" to="/leaderboard">
          Leaderboard
        </Link>

        {user && user.role === "admin" && (
          <Link className="hover:text-yellow-400 transition" to="/admin">
            Admin
          </Link>
        )}

      </div>


      {/* RIGHT (AUTH SECTION) */}

      {!user ? (
        <div className="flex space-x-4">
          <Link className="hover:text-green-400 transition" to="/login">
            Login
          </Link>

          <Link className="hover:text-blue-400 transition" to="/register">
            Register
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-4">

          <span className="text-yellow-300">
            Hi {user.name}
          </span>

          <button 
            onClick={logout}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition text-sm"
          >
            Logout
          </button>
        </div>
      )}

    </nav>
  );
}
