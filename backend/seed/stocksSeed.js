const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stock = require("../models/Stock");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Updating stock symbols...");

  await Stock.deleteMany({});

  await Stock.insertMany([
    { symbol: "RELIANCE.NS", name: "Reliance Industries", price: 2200, volatility: 2 },
    { symbol: "TCS.NS", name: "Tata Consultancy Services", price: 3500, volatility: 4 },
    { symbol: "INFY.NS", name: "Infosys Ltd", price: 1500, volatility: 3 },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: 1600, volatility: 2 },
    { symbol: "TATAMOTORS.NS", name: "Tata Motors", price: 450, volatility: 5 }
  ]);

  console.log("Symbols updated ✔");
  process.exit();
});
