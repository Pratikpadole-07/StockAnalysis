const Stock = require("../models/Stock");

exports.addStock = async (req,res)=>{

    const { name, symbol, price, volatility } = req.body;

    const stock = await Stock.create({
        name,
        symbol,
        price,
        volatility
    });

    res.json({ msg:"Stock added", stock });
};


exports.updateVolatility = async (req,res)=>{

    const { stockId, volatility } = req.body;

    const stock = await Stock.findByIdAndUpdate(
        stockId,
        { volatility },
        { new:true }
    );

    res.json({ msg:"Volatility updated", stock });
};
