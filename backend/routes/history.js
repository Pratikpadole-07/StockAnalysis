const router = require("express").Router();
const axios = require("axios");

router.get("/:symbol/:range", async (req, res) => {
  try {
    const { symbol, range } = req.params;

    let interval = "1d";
    let dataRange = "1mo";

    if (range === "1D") {
      interval = "5m";
      dataRange = "1d";
    } else if (range === "1W") {
      interval = "1h";
      dataRange = "5d";
    } else if (range === "1M") {
      interval = "1h";
      dataRange = "1mo";
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${dataRange}`;
    const r = await axios.get(url);
    const result = r.data.chart.result?.[0];

    if (!result) return res.json({ success: true, data: [] });

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    const data = timestamps.map((t, i) => ({
  time: t * 1000,
  price: closes[i] ?? null,
}));


    return res.json({ success: true, data });
  } catch (e) {
    console.error("Yahoo History Error:", e.message);
    return res.status(500).json({ success: false, data: [] });
  }
});

module.exports = router;
