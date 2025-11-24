const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
  symbol: String,
  type: { type: String, enum: ["buy", "sell"] },
  quantity: Number,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
