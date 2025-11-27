const User = require("../models/User");
const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const calcStats = require("../services/portfolioService");

function calcNewAvgPrice(oldQty, oldAvg, buyQty, buyPrice) {
  const totalCost = oldQty * oldAvg + buyQty * buyPrice;
  const newQty = oldQty + buyQty;
  return {
    qty: newQty,
    avg: totalCost / newQty
  };
}

// 📌 Save latest net worth point to DB (for chart)
async function updateNetWorthHistory(user) {
  const stocks = await Stock.find();
  const stockMap = {};
  stocks.forEach(s => stockMap[s._id] = s);

  const stats = calcStats(user, stockMap);

  user.netWorthHistory.push({
    time: Date.now(),
    value: stats.netWorth
  });

  await user.save();
  return stats;
}

/********************** BUY STOCK **********************/
exports.buyStock = async (req, res) => {
  try {
    const userId = req.userId;
    const { stockId, quantity } = req.body;

    const qty = Number(quantity);
    if (!stockId || qty <= 0) {
      return res.status(400).json({ msg: "Invalid stock or quantity" });
    }

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);
    if (!user || !stock) return res.status(404).json({ msg: "Not found" });

    const cost = stock.price * qty;
    if (user.balance < cost)
      return res.status(400).json({ msg: "Insufficient balance" });

    user.balance -= cost;

    const idx = user.holdings.findIndex(h => h.stock.toString() === stock._id.toString());
    if (idx === -1) {
      user.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        quantity: qty,
        avgPrice: stock.price
      });
    } else {
      const curr = user.holdings[idx];
      const { qty: newQty, avg: newAvg } =
        calcNewAvgPrice(curr.quantity, curr.avgPrice, qty, stock.price);

      curr.quantity = newQty;
      curr.avgPrice = newAvg;
    }

    // save holding & update history stats
    await user.save();
    const stats = await updateNetWorthHistory(user);

    await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: "buy",
      quantity: qty,
      price: stock.price,
      date: new Date()
    });

    res.json({ msg: "Buy successful", user, stats });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/********************** SELL STOCK **********************/
exports.sellStock = async (req, res) => {
  try {
    const userId = req.userId;
    const { stockId, quantity } = req.body;

    const qty = Number(quantity);
    if (!stockId || qty <= 0)
      return res.status(400).json({ msg: "Invalid request" });

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    const idx = user.holdings.findIndex(h => h.stock.toString() === stockId);
    if (idx === -1) return res.status(400).json({ msg: "No holdings" });

    const holding = user.holdings[idx];
    if (holding.quantity < qty)
      return res.status(400).json({ msg: "Not enough shares" });

    user.balance += stock.price * qty;
    holding.quantity -= qty;
    if (holding.quantity === 0) user.holdings.splice(idx, 1);

    await user.save();
    const stats = await updateNetWorthHistory(user);

    await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: "sell",
      quantity: qty,
      price: stock.price,
      date: new Date()
    });

    res.json({ msg: "Sell successful", user, stats });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/********************** TRADE HISTORY **********************/
exports.getHistory = async (req, res) => {
  try {
    const trades = await Transaction.find({ user: req.userId })
      .sort({ date: -1 });

    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
