const fs = require("fs");
//const { __dirname } = require("../utils.js");
const Product=require("../../models/productSchema.js")
const Cart=require("../../models/cartSchema.js")
const { Model, default: mongoose } = require("mongoose");
const {ObjectId}=require("mongoose")
class CartDaoMongo {
    constructor(model) {
        this.model=model
    }
    async addProducts(cid,products){
        return this.model.findOneAndUpdate({_id:cid},
            {
                $push:{products:{$each:products}}
            },
            {new:true}
        ).lean()
    }
    async add(cid, pid) {
        const productid=new mongoose.Types.ObjectId(pid)
        let cart=await this.model.findOneAndUpdate({_id:cid,'products._id':productid},
            {
                $inc: { 'products.$.quantity': 1 },                
            },{
                new:true,
            })
        if(!cart){
            cart=this.model.findOneAndUpdate({_id:cid},
                {$push:{products:{_id:productid,quantity:1}}},
                {new:true})
        }
        
        return cart
    }

    async remove(cid, pid) {
        let cart=await this.model.findOneAndUpdate({_id:cid,'products._id':pid},
            {
                $inc:{'products.$.quantity':-1}
            },
            {
                new:true
            })
        
        cart=await this.model.findByIdAndUpdate(
            {_id:cid,'products._id':pid},
            {$pull:{
                products:{
                    _id:pid,
                    quantity:{$lte:0}
                }
            }},
            {
                new:true,
            }
        )
        return cart
    }
    

    async get(cid) {
            let cart=await this.model.findOne({_id:cid})
            return cart
    }
    async update(cid, pid, quantity) {  
            const cart=await this.model.findOneAndUpdate(
                {_id:cid,'products._id':pid},
                {$inc:{'products.$.quantity':quantity}},
                {new:true,})
            cart.products=cart.products.filter(product=>product.quantity!==0)
            await cart.save()    
            return cart
        
    }
    
    async create() {
            const result = await this.model.create({products:[]})
            return result
    }
    async clear(cid){
        const result=await this.model.findByIdAndUpdate(
            {_id:cid},
            {$set: {products:[]}},
            {new:true}
        )
        return result
    }
    async delete(filter){
        const result=await this.model.findOneAndDelete(filter)
    }
    
}

module.exports = CartDaoMongo;
