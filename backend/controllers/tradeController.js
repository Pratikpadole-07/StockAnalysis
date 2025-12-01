const User = require("../models/User");
const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const Activity = require("../models/Activity");
const calcStats = require("../services/portfolioService");
const response = require("../utils/response");

// WebSocket IO
let io;
exports.setIO = (socketIO) => {
  io = socketIO;
};

function calcNewAvgPrice(oldQty, oldAvg, buyQty, buyPrice) {
  const totalCost = oldQty * oldAvg + buyQty * buyPrice;
  const newQty = oldQty + buyQty;
  return { qty: newQty, avg: totalCost / newQty };
}

async function updateNetWorthHistory(user) {
  const stocks = await Stock.find();
  const stockMap = {};
  stocks.forEach((s) => (stockMap[s._id] = s));

  const stats = calcStats(user, stockMap);

  user.netWorthHistory.push({
    time: Date.now(),
    value: stats.netWorth,
  });

  await user.save();
  return stats;
}

/************** BUY STOCK **************/
exports.buyStock = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIXED
    const { stockId, quantity } = req.body;
    const qty = Number(quantity);

    if (!stockId || qty <= 0)
      return response.error(res, "Invalid data", 400);

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    if (!user || !stock)
      return response.error(res, "User or Stock not found", 404);

    const cost = stock.price * qty;
    if (user.balance < cost)
      return response.error(res, "Insufficient balance", 400);

    user.balance -= cost;

    const idx = user.holdings.findIndex(
      (h) => h.stock.toString() === stockId
    );

    if (idx === -1) {
      user.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        quantity: qty,
        avgPrice: stock.price,
      });
    } else {
      const h = user.holdings[idx];
      const updated = calcNewAvgPrice(
        h.quantity,
        h.avgPrice,
        qty,
        stock.price
      );
      h.quantity = updated.qty;
      h.avgPrice = updated.avg;
    }

    await user.save();
    const stats = await updateNetWorthHistory(user);

    await Transaction.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      type: "buy",
      quantity: qty,
      price: stock.price,
    });

    await Activity.create({
      user: userId,
      message: `Bought ${qty} ${stock.symbol} @ ₹${stock.price}`,
    });

    if (io) io.to(userId.toString()).emit("notify", `Trade Executed: ${stock.symbol}`);

    return response.success(res, "Buy successful", {
      balance: user.balance,
      holdings: user.holdings,
      stats,
    });
  } catch (err) {
    console.error(err);
    return response.error(res, "Server error", 500);
  }
};

/************** SELL STOCK **************/
exports.sellStock = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIXED
    const { stockId, quantity } = req.body;
    const qty = Number(quantity);

    if (!stockId || qty <= 0)
      return response.error(res, "Invalid data", 400);

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    if (!user || !stock)
      return response.error(res, "User or Stock not found", 404);

    const idx = user.holdings.findIndex(
      (h) => h.stock.toString() === stockId
    );
    if (idx === -1) return response.error(res, "No holdings found", 400);

    const h = user.holdings[idx];
    if (h.quantity < qty)
      return response.error(res, "Not enough shares", 400);

    h.quantity -= qty;
    user.balance += stock.price * qty;
    if (h.quantity === 0) user.holdings.splice(idx, 1);

    await user.save();
    const stats = await updateNetWorthHistory(user);

    await Transaction.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      type: "sell",
      quantity: qty,
      price: stock.price,
    });

    await Activity.create({
      user: userId,
      message: `Sold ${qty} ${stock.symbol} @ ₹${stock.price}`,
    });

    if (io) io.to(userId.toString()).emit("notify", `Trade Executed: ${stock.symbol}`);

    return response.success(res, "Sell successful", {
      balance: user.balance,
      holdings: user.holdings,
      stats,
    });
  } catch (err) {
    console.error(err);
    return response.error(res, "Server error", 500);
  }
};

/************** TRADE HISTORY **************/
exports.getHistory = async (req, res) => {
  try {
    const trades = await Transaction.find({ user: req.userId }) // ✅ FIXED
      .sort({ date: -1 });

    return response.success(res, "History fetched", trades);
  } catch (err) {
    console.error(err);
    return response.error(res, "Server error", 500);
  }
};
