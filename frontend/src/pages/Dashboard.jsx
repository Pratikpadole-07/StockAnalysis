import React, { useEffect, useState } from "react";
import { 
  getStocks, 
  buyStock, 
  sellStock, 
  getPortfolioStats 
} from "../api/api";
import socket from "../socket/socket";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  // Load User from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      socket.emit("join", parsed._id);
    }
  }, []);

  // Load Stocks + Socket live feed
  useEffect(() => {
    loadStocks();

    socket.on("update-stocks", (data) => {
      setStocks(data);
    });

    return () => socket.off("update-stocks");
  }, []);

  const loadStocks = async () => {
    const res = await getStocks();
    setStocks(res.data);
  };

  // load stats whenever user changes
  useEffect(() => {
    if (user) {
      loadPortfolioStats();
    }
  }, [user]);

  const loadPortfolioStats = async () => {
    try {
      const res = await getPortfolioStats();
      setStats(res.data);
    } catch (e) {
      console.log("Stats load failed");
    }
  };

  // BUY Handler
  const handleBuy = async (stock) => {
    const qtyStr = prompt(`Enter qty to BUY for ${stock.symbol}`);
    if (!qtyStr) return;

    const quantity = Number(qtyStr);
    if (quantity <= 0 || isNaN(quantity)) return alert("Invalid qty");

    try {
      const res = await buyStock({
        stockId: stock._id,
        quantity,
      });

      alert("Buy Successful");

      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      loadPortfolioStats();

    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  // SELL handler
  const handleSell = async (holding) => {
    const qtyStr = prompt(`Enter qty to SELL for ${holding.symbol}`);
    if (!qtyStr) return;

    const quantity = Number(qtyStr);
    if (quantity <= 0 || isNaN(quantity)) return alert("Invalid qty");

    try {
      const res = await sellStock({
        stockId: holding.stock,
        quantity
      });

      alert("Sell Successful");

      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      loadPortfolioStats();

    } catch (err) {
      alert(err.response.data.msg);
    }
  };


  return (
    <div style={{ padding: "20px" }}>

      <h1>Dashboard</h1>

      {user && (
        <h3>
          User: {user.name} &nbsp; | &nbsp; Balance: ₹{user.balance?.toFixed(2)}
        </h3>
      )}

      {/* PORTFOLIO SUMMARY */}
      {stats && (
        <div style={{ 
          padding: "10px", 
          border: "1px solid black",
          marginBottom: "20px",
          width: "350px"
        }}>
          <h3>Portfolio Summary</h3>

          <p><b>Invested:</b> ₹{stats.investedValue.toFixed(2)}</p>
          <p><b>Current Value:</b> ₹{stats.currentValue.toFixed(2)}</p>
          <p><b>Profit / Loss:</b> ₹{stats.profitLoss.toFixed(2)}</p>
          <p><b>P/L %:</b> {stats.profitPercent.toFixed(2)}%</p>

          <hr/>
          <p><b>Net Worth:</b> ₹{stats.netWorth.toFixed(2)}</p>
        </div>
      )}

      {/* STOCK TABLE */}
      <h2>Stocks</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr key={s._id}>
              <td>{s.symbol}</td>
              <td>{s.name}</td>
              <td>{s.price}</td>
              <td>
                <button onClick={() => handleBuy(s)}>BUY</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {user && user.holdings?.length > 0 && (
        <>
        <h2 style={{ marginTop:"40px" }}>Your Holdings</h2>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {user.holdings.map(h => (
              <tr key={h._id}>
                <td>{h.symbol}</td>
                <td>{h.quantity}</td>
                <td>{h.avgPrice.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleSell(h)}>SELL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}

    </div>
  );
}
