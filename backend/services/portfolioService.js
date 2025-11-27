const User = require("../models/User");
const Stock = require("../models/Stock");

function calcStats(user, stocksMap) {

    if (!user) {
    return {
      investedValue: 0,
      currentValue: 0,
      profitLoss: 0,
      profitPercent: 0,
      netWorth: 0
   };
}
    let investedValue = 0;
    let currentValue = 0;

    for (let h of (user.holdings || [])) {

        const stock = stocksMap[h.stock.toString()];
        if(!stock) continue;

        const livePrice = stock.price;

        investedValue += h.avgPrice * h.quantity;
        currentValue += livePrice * h.quantity;
    }

    const profitLoss = currentValue - investedValue;
    const profitPercent = investedValue > 0 
        ? (profitLoss / investedValue) * 100 
        : 0;

    const netWorth = user.balance + currentValue;

    return {
        investedValue,
        currentValue,
        profitLoss,
        profitPercent,
        netWorth,
        netWorthHistory: user.netWorthHistory || [] 
    };
}

module.exports = calcStats;
