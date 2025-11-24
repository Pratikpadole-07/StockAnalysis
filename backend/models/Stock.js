const mongoose=require('mongoose')

const stockSchema=new mongoose.Schema({
    symbol:{
        type:String,
        unique:true
    },
    name: String,
    price: Number,
    volatility: Number,
    adminOverride: {
        active: { type: Boolean, default: false },
        amount: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }
    }
})
module.exports = mongoose.model("Stock", stockSchema);