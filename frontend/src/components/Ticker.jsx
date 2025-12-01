import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function Ticker() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const handleUpdate = (data) => {
      const nextStocks = Array.isArray(data) ? data : data?.stocks;
      setStocks(Array.isArray(nextStocks) ? nextStocks : []);
    };

    socket.on("update-stocks", handleUpdate);
    return () => socket.off("update-stocks", handleUpdate);
  }, []);

  return (
    <div className="w-full bg-black/70 backdrop-blur-md text-white border-y border-gray-700 py-2 overflow-hidden fixed bottom-0 left-0 z-[999]">
      <div className="animate-marquee whitespace-nowrap flex gap-10 px-6">
        {stocks.map((s) => {
          const color = !s.prevPrice
            ? "text-gray-400"
            : s.price > s.prevPrice
            ? "text-green-400"
            : "text-red-400";

          return (
            <span key={s._id} className="flex-column items-center space-x-2 font-semibold">
              <span className="text-cyan-300">{s.symbol}</span>
              <span className={color}>₹{s.price}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
