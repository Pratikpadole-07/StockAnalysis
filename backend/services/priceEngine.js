const axios = require("axios");
const Stock = require("../models/Stock");

let ioInstance = null;
let marketHistory = [];
const HISTORY_LIMIT = 50;
const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

async function fetchLivePrice(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const res = await axios.get(url);

    if (res.data && res.data["Global Quote"]) {
      const price = parseFloat(res.data["Global Quote"]["05. price"]);
      return isNaN(price) ? null : price;
    }

    return null;
  } catch (err) {
    console.log("API CALL ERROR →", err.message);
    return null;
  }
}

function startPriceEngine(io) {
  ioInstance = io;

  setInterval(async () => {
    const stocks = await Stock.find();

    for (let s of stocks) {
      s.prevPrice = s.price;

      const livePrice = await fetchLivePrice(s.symbol);

      if (livePrice && livePrice > 0) {
        s.price = parseFloat(livePrice.toFixed(2));
      } else {
        const change = (Math.random() * s.volatility) - (s.volatility / 2);
        s.price = parseFloat((s.price + change).toFixed(2));
      }

      await s.save();
    }

    const avg = stocks.reduce((sum, s) => sum + s.price, 0) / stocks.length;
    marketHistory.push({ time: Date.now(), price: parseFloat(avg.toFixed(2)) });

    if (marketHistory.length > HISTORY_LIMIT) marketHistory.shift();

    ioInstance.emit("update-stocks", {
      stocks,
      marketHistory,
    });
  }, 1000); // Alpha Vantage limit = 5 calls/min
}

module.exports = startPriceEngine;
