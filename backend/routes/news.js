const router = require("express").Router();
const axios = require("axios");

router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}`;
    const r = await axios.get(url);

    const news = (r.data.news || []).map(n => ({
      title: n.title,
      summary: n.summary,
      url: n.link,
    }));

    res.json({ success: true, data: news });
  } catch (e) {
    console.error("Yahoo News Error:", e.message);
    res.status(500).json({ success: false, data: [] });
  }
});

module.exports = router;
