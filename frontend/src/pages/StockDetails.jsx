import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getStocks, buyStock } from "../api/api";
import socket from "../socket/socket";
import { createChart } from "lightweight-charts";
import BuyModal from "../components/BuyModal";
import { toast } from "react-toastify";

export default function StockDetails() {
  const { symbol } = useParams();

  const chartRef = useRef(null);
  const chart = useRef(null);
  const candleSeries = useRef(null);

  const [stock, setStock] = useState(null);
  const [showBuy, setShowBuy] = useState(false);

  // Fake historical data
  const getDummy = (currentPrice) => {
    const arr = [];
    let p = currentPrice;
    for (let i = 30; i > 0; i--) {
      const open = p;
      const close = open + (Math.random() - 0.5) * 4;
      const high = Math.max(open, close) + 2;
      const low = Math.min(open, close) - 2;
      p = close;
      arr.push({
        time: Date.now() / 1000 - i * 60,
        open,
        high,
        low,
        close
      });
    }
    return arr;
  };

  useEffect(() => {
    loadStock();

    socket.on("update-stocks", (data) => {
      const updated = data.find(s => s.symbol === symbol);
      if (updated) {
        setStock(updated);
        updateLiveCandle(updated.price);
      }
    });

    return () => socket.off("update-stocks");
  }, []);

  const loadStock = async () => {
    const res = await getStocks();
    const s = res.data.find(x => x.symbol === symbol);
    setStock(s);
    if (s) initChart(s.price);
  };

  const initChart = (price) => {
    chart.current = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "transparent" }, textColor: "#fff" },
      grid: { vertLines: { color: "#444" }, horzLines: { color: "#444" } }
    });

    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: "#0f0",
      downColor: "#f00",
      borderDownColor: "#f00",
      borderUpColor: "#0f0",
      wickDownColor: "#f00",
      wickUpColor: "#0f0"
    });

    candleSeries.current.setData(getDummy(price));
  };

  const updateLiveCandle = (newPrice) => {
    const last = candleSeries.current._series._data._items.at(-1);
    candleSeries.current.update({
      ...last,
      close: newPrice,
      high: Math.max(last.high, newPrice),
      low: Math.min(last.low, newPrice),
    });
  };

  // Buy Confirm function
  const confirmBuy = async (qty) => {
    if (!qty || qty <= 0) return toast.error("Invalid quantity");

    const res = await buyStock({
      stockId: stock._id,
      quantity: qty,
    });

    toast.success("Bought Successfully!");
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setShowBuy(false);
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-500
+   bg-gray-100 text-black
+   dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
+   dark:text-white">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{symbol} / INR</h1>
          {stock && (
            <p className="text-xl font-semibold text-green-400">
              ₹{stock.price.toFixed(2)}
            </p>
          )}
        </div>

        <button
          onClick={() => setShowBuy(true)}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          BUY
        </button>
      </div>

      {/* Chart */}
      <div
        ref={chartRef}
        className="rounded-xl border border-gray-700 bg-gray-900/60 p-2 shadow-xl mt-6"
      />

      {/* Back */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
      >
        ← Back
      </button>

      {/* BUY Modal */}
      {showBuy && (
        <BuyModal
          stock={stock}
          onClose={() => setShowBuy(false)}
          onConfirm={confirmBuy}
        />
      )}
    </div>
  );
}
