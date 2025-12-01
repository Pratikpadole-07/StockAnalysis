const Stock = require("../models/Stock");
const response = require("../utils/response");

/********************** ADD STOCK **********************/
exports.addStock = async (req, res) => {
  try {
    const { name, symbol, price, volatility } = req.body;

    if (!name || !symbol || price == null) {
      return response.error(res, "Name, Symbol & Price are required", 400);
    }

    // Prevent duplicate stock creation
    const exists = await Stock.findOne({ symbol });
    if (exists) {
      return response.error(res, "Stock with this symbol already exists", 409);
    }

    const stock = await Stock.create({
      name,
      symbol,
      price,
      volatility: volatility || 1 // default if not provided
    });

    return response.success(res, "Stock added successfully", stock);
    
  } catch (err) {
    console.error(err);
    return response.error(res, "Server error", 500);
  }
};

/********************** UPDATE VOLATILITY **********************/
exports.updateVolatility = async (req, res) => {
  try {
    const { stockId, volatility } = req.body;

    if (!stockId || volatility == null) {
      return response.error(res, "Stock ID and volatility required");
    }

    const stock = await Stock.findByIdAndUpdate(
      stockId,
      { volatility },
      { new: true }
    );

    if (!stock) {
      return response.error(res, "Stock not found", 404);
    }

    return response.success(res, "Volatility updated", stock);

  } catch (err) {
    console.error(err);
    return response.error(res, "Server error", 500);
  }
};
