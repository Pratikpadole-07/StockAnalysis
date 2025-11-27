import React, { useEffect, useState } from "react";
import { 
  getStocks, 
  adminAddStock, 
  adminUpdateVolatility 
} from "../api/api";



export default function AdminDashboard() {

  const [stocks, setStocks] = useState([]);
  const [name,setName] = useState("");
  const [symbol,setSymbol] = useState("");
  const [volatility,setVolatility] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getStocks();
    setStocks(res.data);
  };

  const addStock = async ()=>{
  if(!name || !symbol || !volatility) return alert("Fill all fields");
    
  await adminAddStock({name, symbol, volatility});
  alert("Stock Added!");

  setName("");
  setSymbol("");
  setVolatility("");

  load();
}

const changeVolatility = async (stock)=>{
  const v = prompt(`Set new volatility for ${stock.symbol}`);  
  if(!v) return;

  await adminUpdateVolatility({ stockId: stock._id, volatility: v });
  alert("Updated");
  load();
}


  return (
    <div className="min-h-screen p-8 transition-colors duration-500
+   bg-gray-100 text-black
+   dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
+   dark:text-white">

      <h1 className="text-4xl font-bold tracking-wide mb-8">Admin Panel</h1>

      {/* CARD SECTION */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-800/40 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
          <h3 className="text-lg opacity-70 mb-2">Total Stocks</h3>
          <p className="text-4xl font-bold text-yellow-400">{stocks.length}</p>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
          <h3 className="text-lg opacity-70 mb-2">Price Engine</h3>
          <p className="text-2xl text-green-400 font-semibold">Running 🔥</p>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
          <h3 className="text-lg opacity-70 mb-2">New Stocks (Today)</h3>
          <p className="text-4xl font-bold text-blue-400">
            {Math.floor(stocks.length / 4)}
          </p>
        </div>

      </div>


      {/* ADD STOCK */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 w-full max-w-xl mb-10">

        <h2 className="text-xl font-bold mb-4">Add New Stock</h2>

        <input 
          className="w-full bg-gray-900/60 border border-gray-700 p-3 rounded-lg mb-3"
          placeholder="Stock Name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <input 
          className="w-full bg-gray-900/60 border border-gray-700 p-3 rounded-lg mb-3"
          placeholder="Symbol"
          value={symbol}
          onChange={e=>setSymbol(e.target.value)}
        />

        <input 
          className="w-full bg-gray-900/60 border border-gray-700 p-3 rounded-lg mb-5"
          placeholder="Volatility"
          value={volatility}
          onChange={e=>setVolatility(e.target.value)}
        />

        <button 
          onClick={addStock}
          className="bg-yellow-500 hover:bg-yellow-600 w-full py-3 rounded-lg text-black font-semibold transition"
        >
          Add Stock
        </button>

      </div>


      {/* TABLE */}
      <h2 className="text-2xl font-semibold mb-3">Manage Stocks</h2>

      <table className="w-full bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-gray-700 text-left">
          <tr>
            <th className="p-3">Symbol</th>
            <th className="p-3">Name</th>
            <th className="p-3">Volatility</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {stocks.map(s => (
            <tr
              key={s._id}
              className="hover:bg-gray-700/50 transition-all"
            >
              <td className="p-3">{s.symbol}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.volatility}</td>
              <td className="p-3">
                <button
                  onClick={()=>changeVolatility(s)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                >
                  Edit Volatility
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
