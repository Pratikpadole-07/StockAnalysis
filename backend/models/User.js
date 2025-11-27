const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
  symbol: String,
  quantity: { type: Number, default: 0 },
  avgPrice: { type: Number, default: 0 }
});

const tradeSchema = new mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
  symbol: String,
  quantity: Number,
  price: Number,
  type: { type: String, enum: ["BUY", "SELL"] },
  date: { type: Date, default: Date.now }
});
const netHistorySchema = new mongoose.Schema({
  time: Number,
  value: Number
});
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 100000 }, // starting virtual cash
  holdings: [holdingSchema],
  isAdmin: { type: Boolean, default: false }

  
});


module.exports = mongoose.model("User", userSchema);
