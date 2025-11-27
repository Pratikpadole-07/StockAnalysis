import React, { useEffect, useState } from "react";
import {
  getStocks,
  buyStock,
  sellStock,
  getPortfolioStats
} from "../api/api";
import socket from "../socket/socket";
import BuyModal from "../components/BuyModal";
import SellModal from "../components/SellModal";
import Ticker from "../components/Ticker";
import { toast } from "react-toastify";
import PortfolioChart from "../components/PortfolioChart";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  const [showBuy, setShowBuy] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showSell, setShowSell] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        socket.emit("join", parsed._id);
      } else {
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("User parse failed");
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    loadStocks();
    socket.on("update-stocks", (data) => setStocks(data));
    return () => socket.off("update-stocks");
  }, []);

  const loadStocks = async () => {
    try {
      const res = await getStocks();
      setStocks(res.data);
    } catch (err) {
      console.error("Stock load failed");
    }
  };

  useEffect(() => {
    if (user) loadPortfolioStats();
  }, [user]);

  const loadPortfolioStats = async () => {
    try {
      const res = await getPortfolioStats();
      setStats(res.data);
    } catch {
      console.log("Stats error");
    }
  };

  const openBuyModal = (stock) => {
    setSelectedStock(stock);
    setShowBuy(true);
  };

  const confirmBuy = async (qty) => {
    if (!qty || qty <= 0) return toast.error("Invalid qty");

    try {
      const res = await buyStock({
        stockId: selectedStock._id,
        quantity: qty,
      });

      toast.success("Buy Successful 🚀");
      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      loadPortfolioStats();
    } catch {
      toast.error("Buy Failed");
    }
    setShowBuy(false);
  };

  const handleSell = (holding) => {
    setSelectedHolding(holding);
    setShowSell(true);
  };

  const confirmSell = async (qty) => {
    if (!qty || qty <= 0) return toast.error("Invalid qty");
    try {
      const res = await sellStock({
        stockId: selectedHolding.stock,
        quantity: qty,
      });

      toast.success("Sell Successful 💰");
      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      loadPortfolioStats();
    } catch {
      toast.error("Sell Failed");
    }
    setShowSell(false);
  };

  const getPriceColor = (s) => {
    if (!s.prevPrice) return "text-gray-300";
    return s.price > s.prevPrice
      ? "text-green-400 flash-green"
      : s.price < s.prevPrice
        ? "text-red-400 flash-red"
        : "text-gray-300";
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-500
  bg-gray-100 text-black
   dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
  dark:text-white">
      <Ticker />

      <h1 className="text-4xl p-8 mt-15 font-bold mb-6 tracking-wide">📊 Dashboard</h1>

      {user && (
        <p className="text-lg mb-8">
          Welcome,
          <span className="text-yellow-400 font-semibold"> {user.name}</span>
          — Balance:
          <span className="text-green-400 font-semibold">
            {" "}₹{user.balance.toFixed(2)}
          </span>
        </p>
      )}

      {stats && (
  <>
    <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700 shadow-xl w-96 mb-10">
      <h2 className="text-xl font-semibold mb-4">Portfolio Metrics</h2>

      <p>Invested: ₹{stats.investedValue.toFixed(2)}</p>
      <p>Current: ₹{stats.currentValue.toFixed(2)}</p>

      <p className="mt-2">
        P/L:{" "}
        <span className={stats.profitLoss >= 0 ? "text-green-400" : "text-red-400"}>
          ₹{stats.profitLoss.toFixed(2)}
        </span>
      </p>

      <p>
        P/L %:{" "}
        <span className={stats.profitPercent >= 0 ? "text-green-400" : "text-red-400"}>
          {stats.profitPercent.toFixed(2)}%
        </span>
      </p>

      <hr className="my-3 border-gray-600" />
      <p><b>Net Worth:</b> ₹{stats.netWorth.toFixed(2)}</p>
    </div>

    {/* 📈 Net Worth Live Line Chart */}
    {stats.netWorthHistory?.length > 0 && (
      <div className="mb-10">
        <PortfolioChart history={stats.netWorthHistory} />
      </div>
    )}
  </>
)}

      
      {/* Gainers / Losers */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-500">
          <h3 className="text-green-300 font-bold mb-2">Top Gainers</h3>
          {stocks
            .filter(s => s.prevPrice)
            .sort((a,b)=> (b.price - b.prevPrice) - (a.price - a.prevPrice))
            .slice(0,3)
            .map(s => (
              <p key={s._id}>{s.symbol} — ₹{s.price}</p>
            ))}
        </div>

        <div className="bg-red-900/30 p-4 rounded-lg border border-red-500">
          <h3 className="text-red-300 font-bold mb-2">Top Losers</h3>
          {stocks
            .filter(s => s.prevPrice)
            .sort((a,b)=> (a.price - a.prevPrice) - (b.price - b.prevPrice))
            .slice(0,3)
            .map(s => (
              <p key={s._id}>{s.symbol} — ₹{s.price}</p>
            ))}
        </div>
      </div>

      {/* Stocks Table */}
      <table className="w-full bg-gray-900/30 border border-gray-700 rounded-xl">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-3">Symbol</th>
            <th className="p-3">Name</th>
            <th className="p-3">Live Price</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s._id} className="border-t border-gray-700 hover:bg-gray-800/60">
              <td
                className="p-3 cursor-pointer text-blue-400 hover:underline"
                onClick={() => window.location.href = `/stock/${s.symbol}`}
              >
                {s.symbol}
              </td>
              <td className="p-3">{s.name}</td>
              <td className={`p-3 font-semibold transition-all duration-500 ${getPriceColor(s)}`}>
                ₹{s.price}
              </td>
              <td className="p-3">
                <button
                  onClick={() => openBuyModal(s)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
                >
                  BUY
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {user?.holdings?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-12 mb-3">Your Holdings</h2>

          <table className="w-full bg-gray-900/30 border border-gray-700 rounded-xl">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Avg Price</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {user.holdings.map((h) => (
                <tr key={h._id} className="border-t border-gray-700 hover:bg-gray-800/60">
                  <td className="p-3">{h.symbol}</td>
                  <td className="p-3">{h.quantity}</td>
                  <td className="p-3">₹{h.avgPrice.toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleSell(h)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                    >
                      SELL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* MODALS */}
      {showBuy && (
        <BuyModal
          stock={selectedStock}
          onClose={() => setShowBuy(false)}
          onConfirm={confirmBuy}
        />
      )}

      {showSell && (
        <SellModal
          holding={selectedHolding}
          onClose={() => setShowSell(false)}
          onConfirm={confirmSell}
        />
      )}

    </div>
  );
}
