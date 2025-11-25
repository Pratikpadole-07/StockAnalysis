import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function Ticker() {

  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    socket.on("update-stocks", (data) => {
      setStocks(data);
    });

    return () => socket.off("update-stocks");
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/60 text-white border-t border-gray-700 backdrop-blur-xl py-2 overflow-hidden z-50">

      <div className="animate-marquee whitespace-nowrap">

        {stocks.map(s => (
          <span key={s._id} className="mx-6 font-semibold">

            {s.symbol}:
            <span className={s.price > s.prevPrice ? "text-green-400" : "text-red-400"}>
              ₹{s.price}
            </span>

          </span>
        ))}

      </div>

    </div>
  );
}
