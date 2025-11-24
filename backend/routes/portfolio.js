const express = require("express");
const router = express.Router();
const { getPortfolioStats, getLeaderboard } = require("../controllers/portfolioController");

router.get("/stats", getPortfolioStats);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
