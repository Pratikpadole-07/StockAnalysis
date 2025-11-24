const User = require("../models/User");
const Stock = require("../models/Stock");
const calcStats = require("../services/portfolioService");

exports.getPortfolioStats = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const stocks = await Stock.find();
        const stockMap = {};

        for (let s of stocks) {
            stockMap[s._id.toString()] = s;
        }

        const stats = calcStats(user, stockMap);

        res.json(stats);

    } catch(err){
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find();

        const stocks = await Stock.find();
        const stockMap = {};
        for (let s of stocks) {
            stockMap[s._id.toString()] = s;
        }

        const leaderboard = users.map(u => {
            const stats = calcStats(u, stockMap);
            return {
                user: u.name,
                email: u.email,
                netWorth: stats.netWorth,
                investedValue: stats.investedValue,
                currentValue: stats.currentValue,
                profitPercent: stats.profitPercent,
            };
        });

        leaderboard.sort((a,b)=> b.netWorth - a.netWorth);

        res.json(leaderboard);

    } catch(err){
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
