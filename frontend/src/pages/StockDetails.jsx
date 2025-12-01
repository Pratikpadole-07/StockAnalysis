import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getStocks,
  getHistoricalCandles,
  getStockNews,
  buyStock,
  sellStock,
} from "../api/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import BuyModal from "../components/BuyModal";
import SellModal from "../components/SellModal";
import { toast } from "react-toastify";

export default function StockDetails() {
  const { symbol } = useParams();

  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [news, setNews] = useState([]);
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [range, setRange] = useState("1M"); // ⭐ Final single range state

  // Get logged-in user safely
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined") {
      user = JSON.parse(raw);
    } else {
      localStorage.removeItem("user");
    }
  } catch {
    user = null;
  }

  //
  // 🔥 Load Stock Data + History + News on range change
  //
  useEffect(() => {
    async function load() {
      try {
        // Stock info
        const all = await getStocks();
        const found = all.data.find((s) => s.symbol === symbol);
        setStock(found);

        // Historical chart data
        const histRes = await getHistoricalCandles(symbol, range);
        const histData = histRes.data?.data || [];

        const formatted = histData
          .filter((c) => c.price)
          .map((c) => ({
            time: new Date(c.time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            price: Number(c.price.toFixed(2)),
          }));

        setHistory(formatted);

        // News section
        const newsRes = await getStockNews(symbol);
        setNews(newsRes.data?.data || []);
      } catch (err) {
        console.error("Load error:", err);
        toast.error("Failed to load stock info.");
      }
    }

    load();
  }, [symbol, range]); // ⭐ Add range

  if (!stock)
    return (
      <div className="text-center p-6">Loading {symbol} details...</div>
    );

  const priceChange = stock.price - (stock.prevPrice || stock.price);
  const priceColor = priceChange >= 0 ? "text-green-400" : "text-red-400";

  //
  // BUY / SELL
  //
  const confirmBuy = async (qty) => {
    try {
      const res = await buyStock({ stockId: stock._id, quantity: qty });

      const apiData = res.data.data || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(user || {}),
          balance: apiData.balance ?? user?.balance,
          holdings: apiData.holdings ?? user?.holdings,
        })
      );

      toast.success("Buy Successful 🚀");
    } catch {
      toast.error("Buy Failed ❌");
    }
    setShowBuy(false);
  };

  const confirmSell = async (qty) => {
    try {
      const res = await sellStock({ stockId: stock._id, quantity: qty });

      const apiData = res.data.data || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(user || {}),
          balance: apiData.balance ?? user?.balance,
          holdings: apiData.holdings ?? user?.holdings,
        })
      );

      toast.success("Sell Successful 💰");
    } catch {
      toast.error("Sell Failed ❌");
    }
    setShowSell(false);
  };

  return (
    <div className="min-h-screen p-10 mt-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4 flex justify-between items-center">
        {stock.name} ({symbol})
        <span className={`text-3xl font-bold ${priceColor}`}>
          ₹{stock.price.toFixed(2)}
        </span>
      </h1>

      <p className="text-gray-400 mb-6">
        Volatility: <b>{stock.volatility}</b> | Previous Price: ₹
        {stock.prevPrice?.toFixed(2)}
      </p>

      {/* ⭐ Range Selector */}
      <div className="flex gap-3 mb-4">
        {["1D", "1W", "1M"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1 rounded-lg font-semibold ${
              range === r ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-gray-900 rounded-xl border border-gray-600 p-6 mb-10">
        {history.length === 0 ? (
          <p className="text-center text-gray-400">
            Fetching market data ⏳ Try another range
          </p>
        ) : (
          <LineChart width={900} height={400} data={history}>
            <CartesianGrid stroke="#555" strokeDasharray="4 4" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke={priceChange >= 0 ? "lightgreen" : "#ff4d4d"}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mb-10 flex gap-4">
        <button onClick={() => setShowBuy(true)} className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">
          BUY
        </button>
        <button onClick={() => setShowSell(true)} className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700">
          SELL
        </button>
      </div>

      {/* NEWS */}
      <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
      <div className="space-y-4">
        {news.length === 0 && <p>No News Found 📰</p>}
        {news.map((n, i) => (
          <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-800 rounded hover:bg-gray-700">
            <p className="font-bold">{n.title}</p>
            <p className="text-gray-400 text-sm">{n.summary || n.description}</p>
          </a>
        ))}
      </div>

      {/* MODALS */}
      {showBuy && (
        <BuyModal stock={stock} onClose={() => setShowBuy(false)} onConfirm={confirmBuy} />
      )}
      {showSell && (
        <SellModal
          holding={{ stock: stock._id, symbol: stock.symbol }}
          onClose={() => setShowSell(false)}
          onConfirm={confirmSell}
        />
      )}
    </div>
  );
}
