import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import socket from "../socket/socket";

export default function MarketChart({ history }) {
  const chartRef = useRef(null);
  const chart = useRef(null);
  const lineSeries = useRef(null);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    chart.current = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "transparent" },
        textColor: "#00eaff",
      },
      grid: {
        vertLines: { color: "rgba(0,255,255,0.1)" },
        horzLines: { color: "rgba(0,255,255,0.1)" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      crosshair: {
        mode: 1,
        vertLine: { visible: true, color: "#00ffff30" },
        horzLine: { visible: true, color: "#00ffff30" },
      },
    });

    lineSeries.current = chart.current.addLineSeries({
      color: "#00eaff",
      lineWidth: 2,
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.current?.applyOptions({
        width: chartRef.current.clientWidth,
      });
      chart.current?.timeScale().fitContent();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.current?.remove();
    };
  }, []);

  // Set initial data (when history loaded)
  useEffect(() => {
    if (!lineSeries.current || !history?.length) return;

    lineSeries.current.setData(
      history.map((h) => ({
        time: Math.floor(h.time / 1000),
        value: h.price, //  FIXED 🔥
      }))
    );

    chart.current?.timeScale().fitContent();
  }, [history]);

  // Live update from socket
  useEffect(() => {
    const listener = (data) => {
      const latest = data?.marketHistory?.at(-1);
      if (!latest || !lineSeries.current) return;

      lineSeries.current.update({
        time: Math.floor(latest.time / 1000),
        value: latest.price, // FIXED 🔥
      });
    };

    socket.on("update-stocks", listener);
    return () => socket.off("update-stocks", listener);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 shadow-lg border border-cyan-600">
      <h2 className="text-lg font-semibold mb-3 text-cyan-300 flex items-center gap-2">
        📉 Live Market Chart
      </h2>
      <div ref={chartRef} className="w-full h-[300px]" />
    </div>
  );
}
