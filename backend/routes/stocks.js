const router = require("express").Router();
const Stock = require("../models/Stock");

router.get("/", async (req, res) => {
    const stocks = await Stock.find();
    res.json(stocks);
});

module.exports = router;
