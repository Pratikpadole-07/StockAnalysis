import React, { useState } from "react";

export default function SellModal({ holding, onClose, onConfirm }) {

  const [qty, setQty] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      
      <div className="bg-gray-800/60 border border-gray-700 shadow-xl p-6 rounded-xl w-96">

        <h2 className="text-2xl font-bold mb-4 text-red-400">
          Sell {holding.symbol}
        </h2>

        <p className="text-gray-300 mb-6">
          You own: <b>{holding.quantity}</b> shares
        </p>

        <input
          className="w-full bg-gray-900/60 border border-gray-600 text-white rounded-lg p-3 mb-5 focus:outline-none focus:border-red-400"
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
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-black font-semibold rounded-lg"
          >
            Confirm Sell
          </button>

        </div>

      </div>

    </div>
  );
}
