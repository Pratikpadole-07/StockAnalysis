const router = require("express").Router();
const auth = require("../middleware/auth");
const { buyStock, sellStock, getHistory } = require("../controllers/tradeController");

// protected routes
router.post("/buy", auth, buyStock);
router.post("/sell", auth, sellStock);
router.get("/history", auth, getHistory);

module.exports = router;
