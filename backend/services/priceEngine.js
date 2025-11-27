const Stock = require("../models/Stock");

let ioInstance = null;

function startPriceEngine(io) {
    ioInstance = io;

    setInterval(async () => {
        const stocks = await Stock.find();

        for (let s of stocks) {
            // Temporary variable - do NOT save in DB
            s.prevPrice = s.price;

            // Random price movement based on volatility
            const change = (Math.random() * s.volatility) - (s.volatility / 2);

            s.price = parseFloat((s.price + change).toFixed(2));

            await s.save();
        }

        // Send both price + previous price to frontend
        ioInstance.emit("update-stocks", stocks.map(s => ({
            _id: s._id,
            symbol: s.symbol,
            name: s.name,
            price: s.price,
            prevPrice: s.prevPrice,  // included in live data
        })));

    }, 1500);
}

module.exports = startPriceEngine;
