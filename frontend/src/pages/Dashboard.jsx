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

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  const [showBuy, setShowBuy] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showSell, setShowSell] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      socket.emit("join", parsed._id);
    }
  }, []);

  useEffect(() => {
    loadStocks();
    socket.on("update-stocks", (data) => setStocks(data));
    return () => socket.off("update-stocks");
  }, []);

  const loadStocks = async () => {
    const res = await getStocks();
    setStocks(res.data);
  };

  useEffect(() => {
    if (user) loadPortfolioStats();
  }, [user]);

  const loadPortfolioStats = async () => {
    const res = await getPortfolioStats();
    setStats(res.data);
  };

  const openBuyModal = (stock) => {
    setSelectedStock(stock);
    setShowBuy(true);
  };

  const confirmBuy = async (qty) => {
    if (!qty || qty <= 0) return alert("Invalid qty");

    const res = await buyStock({
      stockId: selectedStock._id,
      quantity: qty,
    });

    alert("Purchase successful");

    const updated = res.data.user;
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));

    loadPortfolioStats();

    setShowBuy(false);
  };

  const handleSell = (holding) => {
  setSelectedHolding(holding);
  setShowSell(true);
};
const confirmSell = async (qty) => {

  if (!qty || qty <= 0) return alert("Invalid qty");

  const res = await sellStock({
    stockId: selectedHolding.stock,
    quantity: qty,
  });

  alert("Sell successful");

  const updated = res.data.user;
  setUser(updated);
  localStorage.setItem("user", JSON.stringify(updated));

  loadPortfolioStats();

  setShowSell(false);
};


  return (
    <div className="p-8 bg-gradient-to-br from-black via-gray-900 to-gray-800 min-h-screen text-white">

      <h1 className="text-4xl font-bold mb-6 tracking-wide">📈 Live Market Dashboard</h1>

      {user && (
        <div className="text-lg mb-8 opacity-90">
          Welcome back,
          <span className="text-yellow-400 font-semibold"> {user.name}</span>
          — Balance:
          <span className="text-green-400 font-semibold">
            &nbsp;₹{user.balance.toFixed(2)}
          </span>
        </div>
      )}

      {stats && (
        <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700 backdrop-blur-xl shadow-xl w-96 mb-10">
          <h2 className="text-xl font-semibold mb-4">Portfolio Metrics</h2>

          <p className="mb-1">Invested: ₹{stats.investedValue.toFixed(2)}</p>
          <p className="mb-1">Current: ₹{stats.currentValue.toFixed(2)}</p>

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
      )}

      {/* STOCK TABLE */}
      <h2 className="text-2xl mb-3 font-semibold">Market Stocks</h2>

      <table className="w-full bg-gray-900/40 border border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-gray-700/40">
          <tr>
            <th className="p-3">Symbol</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr key={s._id} className="border-t border-gray-800 hover:bg-gray-800/60 transition">
              <td className="p-3">{s.symbol}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">₹{s.price}</td>
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

      {/* HOLDINGS */}
      {user?.holdings?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-12 mb-3">Holdings</h2>

          <table className="w-full bg-gray-900/40 border border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-700/40">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Avg Price</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {user.holdings.map((h) => (
                <tr key={h._id} className="border-t border-gray-800 hover:bg-gray-800/60 transition">
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
  <Ticker />

    </div>
  );
}
