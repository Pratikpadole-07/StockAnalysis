const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const history = await Transaction.find({ user: req.userId }).sort({ date: -1 });
  res.json(history);
});

module.exports = router;
