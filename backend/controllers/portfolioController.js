const User = require("../models/User");
const Stock = require("../models/Stock");
const calcStats = require("../services/portfolioService");
const response = require("../utils/response");

/********************** GET PORTFOLIO STATS **********************/
exports.getPortfolioStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return response.error(res, "User not found", 404);

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
        const liveValue = stock.price * h.quantity;

        investedValue += cost;
        currentValue += liveValue;

        return {
          stockId: h.stock,
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          currentPrice: stock.price,
          liveValue
        };
      })
      .filter(Boolean);

    const profitLoss = currentValue - investedValue;
    const profitPercent =
      investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    const netWorth = user.balance + currentValue;

    return response.success(res, "Portfolio stats fetched", {
      investedValue,
      currentValue,
      profitLoss,
      profitPercent,
      netWorth,
      holdings
    });

  } catch (err) {
    console.error("Portfolio Stats Error 💥", err);
    return response.error(res, "Server error", 500);
  }
};

/********************** GET LEADERBOARD **********************/
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find();
    const stocks = await Stock.find();

    const stockMap = {};
    stocks.forEach(s => stockMap[s._id.toString()] = s);

    const leaderboard = users.map(user => {
      const stats = calcStats(user, stockMap);
      return {
        name: user.name,
        // email removed for security, but can enable if needed
        netWorth: stats.netWorth,
        investedValue: stats.investedValue,
        currentValue: stats.currentValue,
        profitPercent: stats.profitPercent.toFixed(2)
      };
    });

    leaderboard.sort((a, b) => b.netWorth - a.netWorth);

    return response.success(res, "Leaderboard fetched", leaderboard);

  } catch (err) {
    console.error(err);
    return response.error(res, "Server error", 500);
  }
};
