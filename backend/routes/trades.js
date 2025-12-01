const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { buyStock, sellStock, getHistory } = require("../controllers/tradeController");

router.post(
  "/buy",
  auth,
  [
    check("stockId").notEmpty().withMessage("Stock ID is required"),
    check("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());
    buyStock(req, res);
  }
);

router.post(
  "/sell",
  auth,
  [
    check("stockId").notEmpty().withMessage("Stock ID is required"),
    check("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());
    sellStock(req, res);
  }
);

// history route (no need for body validation)
router.get("/history", auth, getHistory);

module.exports = router;
