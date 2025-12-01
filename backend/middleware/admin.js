const User = require("../models/User");

module.exports = async function (req, res, next) {
    try {
        const user = await User.findById(req.userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};
