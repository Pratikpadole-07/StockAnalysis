import React, { useState } from "react";

export default function BuyModal({ stock, onClose, onConfirm }) {

  const [qty, setQty] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      
      <div className="bg-gray-800/60 border border-gray-700 shadow-xl p-6 rounded-xl w-96">

        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Buy {stock.symbol}
        </h2>

        <p className="text-gray-300 mb-6">
          Current Price: ₹{stock.price}
        </p>

        <input
          className="w-full bg-gray-900/60 border border-gray-600 text-white rounded-lg p-3 mb-5 focus:outline-none focus:border-yellow-400"
          placeholder="Quantity"
          value={qty}
          onChange={(e)=>setQty(e.target.value)}
        />

        <div className="flex justify-between mt-3">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={()=>onConfirm(Number(qty))}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg"
          >
            Confirm Buy
          </button>

        </div>

      </div>

    </div>
  );
}
