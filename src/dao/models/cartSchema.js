const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    products: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true }
    }]
});
  
const Cart=mongoose.model("carts",cartSchema)
module.exports=Cart