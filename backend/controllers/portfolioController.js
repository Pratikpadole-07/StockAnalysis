const User = require("../models/User");
const Stock = require("../models/Stock");
const calcStats = require("../services/portfolioService");

exports.getPortfolioStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const stocks = await Stock.find();
    const stockMap = {};
    stocks.forEach(s => stockMap[s._id] = s);

    let investedValue = 0;
    let currentValue = 0;

    const holdings = user.holdings
      .map(h => {
        const stock = stockMap[h.stock];
        if (!stock) return null;

        const cost = h.avgPrice * h.quantity;
        const live = stock.price * h.quantity;

        investedValue += cost;
        currentValue += live;

        return {
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          currentPrice: stock.price,
          liveValue: live,
          stockId: h.stock
        };
      })
      .filter(Boolean);

    const profitLoss = currentValue - investedValue;
    const profitPercent =
      investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    const netWorth = user.balance + currentValue;

    return res.json({
      investedValue,
      currentValue,
      profitLoss,
      profitPercent,
      netWorth,
      holdings
    });

  } catch (err) {
    console.error("Portfolio Stats Error 💥", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find();

        const stocks = await Stock.find();
        const stockMap = {};
        for (let s of stocks) {
            stockMap[s._id.toString()] = s;
        }

        const leaderboard = users.map(u => {
            const stats = calcStats(u, stockMap);
            return {
                name: u.name,
                email: u.email,
                netWorth: stats.netWorth,
                investedValue: stats.investedValue,
                currentValue: stats.currentValue,
                profitPercent: stats.profitPercent,
};

        });

        leaderboard.sort((a,b)=> b.netWorth - a.netWorth);

        res.json(leaderboard);

    } catch(err){
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
