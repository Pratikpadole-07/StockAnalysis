const Stock = require("../models/Stock");

let ioInstance = null;

function startPriceEngine(io) {
    ioInstance = io;

    setInterval(async () => {

        const stocks = await Stock.find();

        for (let s of stocks) {

            let change = (Math.random() * s.volatility) - (s.volatility / 2);

            s.price = parseFloat((s.price + change).toFixed(2));

            await s.save();
        }

        ioInstance.emit("update-stocks", stocks);

    }, 1500);
}

module.exports = startPriceEngine;
