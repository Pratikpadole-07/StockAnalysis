const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stock = require("../models/Stock");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Seeding stocks...");

    await Stock.deleteMany({});

    await Stock.insertMany([
        { symbol: "AAPL", name: "Apple", price: 150, volatility: 2 },
        { symbol: "TSLA", name: "Tesla", price: 240, volatility: 4 },
        { symbol: "META", name: "Meta", price: 190, volatility: 3 },
        { symbol: "BTC", name: "Bitcoin", price: 38000, volatility: 10 },
        { symbol: "ETH", name: "Ethereum", price: 2100, volatility: 8 },
    ]);

    console.log("Stocks seeded!");
    process.exit();
});
