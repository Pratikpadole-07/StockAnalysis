const User = require("../models/User");
const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");


function calcNewAvgPrice(oldQty, oldAvg, buyQty, buyPrice) {
  const totalCost = oldQty * oldAvg + buyQty * buyPrice;
  const newQty = oldQty + buyQty;
  return {
    qty: newQty,
    avg: totalCost / newQty
  };
}

exports.buyStock = async (req, res) => {
  try {
    const userId = req.userId;
    const { stockId, quantity } = req.body;

    const qty = Number(quantity);
    if (!stockId || !qty || qty <= 0) {
      return res.status(400).json({ msg: "Invalid stockId or quantity" });
    }

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    if (!user || !stock) {
      return res.status(404).json({ msg: "User or Stock not found" });
    }

    const price = stock.price;
    const cost = price * qty;

    if (user.balance < cost) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // deduct balance
    user.balance = user.balance - cost;

    // update holdings
    const holdingIndex = user.holdings.findIndex(
      (h) => h.stock.toString() === stock._id.toString()
    );

    if (holdingIndex === -1) {
      // new holding
      user.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        quantity: qty,
        avgPrice: price
      });
    } else {
      // update existing holding avg price
      const old = user.holdings[holdingIndex];
      const { qty: newQty, avg: newAvg } = calcNewAvgPrice(
        old.quantity,
        old.avgPrice,
        qty,
        price
      );
      user.holdings[holdingIndex].quantity = newQty;
      user.holdings[holdingIndex].avgPrice = newAvg;
    }

    await user.save();

    // log transaction
    await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: "buy",
      quantity: qty,
      price
    });

    // emit to this user only
    const io = req.app.get("io");
    if (io) {
      io.to(userId.toString()).emit("portfolio-updated", user);
    }

    res.json({ msg: "Buy successful", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.sellStock = async (req, res) => {
  try {
    const userId = req.userId;
    const { stockId, quantity } = req.body;

    const qty = Number(quantity);
    if (!stockId || !qty || qty <= 0) {
      return res.status(400).json({ msg: "Invalid stockId or quantity" });
    }

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    if (!user || !stock) {
      return res.status(404).json({ msg: "User or Stock not found" });
    }

    const holdingIndex = user.holdings.findIndex(
      (h) => h.stock.toString() === stock._id.toString()
    );

    if (holdingIndex === -1) {
      return res.status(400).json({ msg: "You do not own this stock" });
    }

    const holding = user.holdings[holdingIndex];

    if (holding.quantity < qty) {
      return res.status(400).json({ msg: "Not enough quantity to sell" });
    }

    const price = stock.price;
    const credit = price * qty;

    // add balance
    user.balance = user.balance + credit;

    // reduce holding qty
    holding.quantity = holding.quantity - qty;
    if (holding.quantity === 0) {
      // remove holding if zero
      user.holdings.splice(holdingIndex, 1);
    }

    await user.save();

    // log transaction
    await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: "sell",
      quantity: qty,
      price
    });

    // emit to this user only
    const io = req.app.get("io");
    if (io) {
      io.to(userId.toString()).emit("portfolio-updated", user);
    }

    res.json({ msg: "Sell successful", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
