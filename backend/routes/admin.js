const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { addStock, updateVolatility } = require("../controllers/adminController");

router.post("/add-stock", auth, admin, addStock);
router.post("/update-volatility", auth, admin, updateVolatility);

module.exports = router;
