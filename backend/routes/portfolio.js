const router = require("express").Router();
const auth = require("../middleware/auth");
const { getPortfolioStats, getLeaderboard } = require("../controllers/portfolioController");

// Secure Routes
router.get("/stats", auth, getPortfolioStats);
router.get("/leaderboard", auth, getLeaderboard);

module.exports = router;
