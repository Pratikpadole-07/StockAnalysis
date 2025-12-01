import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import io from "socket.io-client";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TradeHistory from "./pages/TradeHistory";
import Analytics from "./pages/Analytics";
import StockDetails from "./pages/StockDetails";

const socket = io("http://localhost:5000");

function App() {

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    } else {
      localStorage.removeItem("user");
    }
  } catch (err) {
    console.error("Invalid user JSON");
    localStorage.removeItem("user");
    user = null;
  }

  useEffect(() => {
    if (user?.id) {
      socket.emit("join", user.id);
      console.log("Socket joined:", user.id);
    }

    socket.on("notify", (msg) => toast.info(msg));
    return () => socket.off("notify");
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/trade-history" element={<ProtectedRoute><TradeHistory /></ProtectedRoute>} />
        <Route path="/stock/:symbol" element={<ProtectedRoute><StockDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
