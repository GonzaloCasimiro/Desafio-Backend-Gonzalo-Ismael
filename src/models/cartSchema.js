const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    products:{
        type:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            quantity:Number
        }]
    }
})
cartSchema.pre("findOne",function(){
    this.populate("products.product")
})
   
const Cart=mongoose.model("carts",cartSchema)
module.exports=Cart

/*
products:{
    type:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,ref:"products"
            }
        }
    ]
}

 products: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true }
    }]
});
*/