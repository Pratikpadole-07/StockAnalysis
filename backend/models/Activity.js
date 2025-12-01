const mongoose = require("mongoose");


module.exports = mongoose.model("Activity", new mongoose.Schema({
  user: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  message: String,
  date: { type: Date, default: Date.now }
}));
