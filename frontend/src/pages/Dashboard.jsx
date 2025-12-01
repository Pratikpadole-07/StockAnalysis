import React, { useEffect, useState } from "react";
import {
  getStocks,
  buyStock,
  sellStock,
  getPortfolioStats,
} from "../api/api";
import socket from "../socket/socket";
import BuyModal from "../components/BuyModal";
import SellModal from "../components/SellModal";
import Ticker from "../components/Ticker";
import { toast } from "react-toastify";
import PortfolioChart from "../components/PortfolioChart";
import MarketChart from "../components/MarketChart";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  const [showBuy, setShowBuy] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showSell, setShowSell] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);

  const [marketHistory, setMarketHistory] = useState([]);

  // load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        socket.emit("join", parsed.id);
      } else {
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("User parse failed", err);
      localStorage.removeItem("user");
    }
  }, []);

  // load stocks + live socket updates
  useEffect(() => {
    loadStocks();

    socket.on("update-stocks", (data) => {
      // data = { stocks, marketHistory } from backend
      const nextStocks = Array.isArray(data) ? data : data?.stocks;
      if (Array.isArray(nextStocks)) setStocks(nextStocks);

      if (Array.isArray(data?.marketHistory)) {
        setMarketHistory(data.marketHistory);
      }
    });

    return () => socket.off("update-stocks");
  }, []);

  const loadStocks = async () => {
    try {
      const res = await getStocks();
      setStocks(res.data);
    } catch (err) {
      console.error("Stock load failed", err);
    }
  };

  // portfolio stats
  useEffect(() => {
    if (user) loadPortfolioStats();
  }, [user]);

  const loadPortfolioStats = async () => {
    try {
      const res = await getPortfolioStats();
      console.log("Stats API:", res.data);
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats error", err);
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

const apiData = res.data.data || {};
const updatedUser = {
  ...(user || {}),
  balance: apiData.balance ?? user?.balance,
  holdings: apiData.holdings ?? user?.holdings,
};

localStorage.setItem("user", JSON.stringify(updatedUser));
setUser(updatedUser);
loadPortfolioStats();

    } catch (err) {
      console.error("Buy failed", err);
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

const apiData = res.data.data || {};
const updatedUser = {
  ...(user || {}),
  balance: apiData.balance ?? user?.balance,
  holdings: apiData.holdings ?? user?.holdings,
};

localStorage.setItem("user", JSON.stringify(updatedUser));
setUser(updatedUser);
loadPortfolioStats();

    } catch (err) {
      console.error("Sell failed", err);
      toast.error("Sell Failed");
    }
    setShowSell(false);
  };

  const getPriceColor = (s) => {
    if (!s.prevPrice) return "text-gray-300";
    return s.price > s.prevPrice ? "text-green-400" : "text-red-400";
  };

  return (
    <div
      className="min-h-screen pt-28 p-6 bg-gray-100 text-black
                 dark:bg-black dark:text-white"
    >
      {/* bottom ticker bar */}
      
      {/* Live Market Index Chart */}
      {marketHistory.length > 0 && (
        <div className="mt-10 mb-12">
          <MarketChart history={marketHistory} />
        </div>
      )}

      {/* Header */}
      <h1 className="text-4xl font-bold mb-6">📊 Dashboard</h1>

      {/* User Balance */}
      {user && (
        <p className="text-lg mb-8">
          Welcome,
          <span className="text-yellow-400 font-semibold">
            {" "}
            {user.name}
          </span>
          — Balance:
          <span className="text-green-400 font-semibold">
            {" "}
            ₹{user?.balance ? user.balance.toFixed(2) : "0.00"}

          </span>
        </p>
      )}

      {/* Portfolio Stats + Net Worth Chart */}
      {stats && (
        <>
          <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700 shadow-xl w-full md:w-1/2 mb-8">
            <h2 className="text-xl font-semibold mb-4">Portfolio Metrics</h2>

            <p>Invested: ₹{stats.investedValue.toFixed(2)}</p>
            <p>Current: ₹{stats.currentValue.toFixed(2)}</p>

            <p className="mt-2">
              P/L:{" "}
              <span
                className={
                  stats.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                }
              >
                ₹{stats?.profitLoss !== undefined ? stats.profitLoss.toFixed(2) : "0.00"}

              </span>
            </p>

            <p>
              P/L %:{" "}
              <span
                className={
                  stats.profitPercent >= 0 ? "text-green-400" : "text-red-400"
                }
              >
                {stats?.profitPercent !== undefined ? stats.profitPercent.toFixed(2) : "0.00"}%

              </span>
            </p>

            <hr className="my-3 border-gray-600" />
            <p>
              <b>Net Worth:</b> ₹{stats.netWorth.toFixed(2)}
            </p>
          </div>

          {stats?.netWorthHistory?.length > 0 && (
            <div className="mb-12">
              <PortfolioChart history={stats.netWorthHistory} />
            </div>
          )}
        </>
      )}

      {/* STOCK TABLE */}
      <h2 className="text-2xl font-semibold mb-4">Market Stocks</h2>

      <table className="w-full bg-gray-900/30 border border-gray-700 rounded-xl mb-12">
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
            <tr
              key={s._id}
              className="border-t border-gray-700 hover:bg-gray-800/60"
            >
              <td
                className="p-3 cursor-pointer text-blue-400 hover:underline"
                onClick={() => (window.location.href = `/stock/${s.symbol}`)}
              >
                {s.symbol}
              </td>
              <td className="p-3">{s.name}</td>
              <td className={`p-3 font-semibold ${getPriceColor(s)}`}>
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

      {/* HOLDINGS */}
      {user?.holdings?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Your Holdings</h2>

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
                <tr
                  key={h._id}
                  className="border-t border-gray-700 hover:bg-gray-800/60"
                >
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
          <Ticker />

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
