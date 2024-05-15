const fs = require("fs");
//const { __dirname } = require("../utils.js");
const Product=require("../dao/models/productSchema.js")
const Cart=require("../dao/models/cartSchema.js")
const { Model, default: mongoose } = require("mongoose");
const {ObjectId}=require("mongoose")
class CartManager {
    constructor(path) {
        this.path = path;
    }
    async addProduct(cid, pid) {
        try {

            const cart=await Cart.findOne({_id:cid})
            console.log(cart)
            if(!cart){
                const data={
                    message:"No existe Cart con ese ID",
                    status:"false"
                }
                return data
            }else{
                const product=cart.products.find(product=>product._id.toString()===pid)
                console.log(product)
                if(product){
                    product.quantity++
                    const data ={
                        message:`Producto agregado al cart,cantidad: ${product.quantity}`,
                        status:"true"
                    }
                    await cart.save()
                    return data
                }else{
                    cart.products.push({_id:pid,quantity:1})
                    const data ={
                        message:"Producto agregado al cart",
                        status:"true"
                    }
                    await cart.save()
                    return data
                }
            }
            
        } catch (error) {
            console.log(error)
            const data={
                message:error.message,
                code:error.code
            }
            return data
        }
    }

    async removeProduct(cid, pid) {
        try {

            const cart=await Cart.findOne({_id:cid})
            if(!cart){
                const data={
                    message:"No existe Cart con ese ID",
                    status:"false"
                }
                return data
            }else{
                const product=cart.products.find(product=>product._id.toString()===pid)
                console.log(product)
                if(product){
                    product.quantity--
                    if(product.quantity>0){
                        const data ={
                        message:`Se ha quitado un producto,quedan ${product.quantity} `,
                        status:"succes"
                    }
                    await cart.save()
                    return data
                    }else{
                        cart.products.pull({_id:pid})
                        await cart.save()
                        const data={
                            message:"Producto Eliminado con Exito",
                            status:"succes"
                        }
                        return data
                    }
                    
                    
                }else{
                    const data ={
                        message:"No existe producto con ese id",
                        status:"false"
                    }
                    return data
                }
            }
            
        } catch (error) {
            console.log(error)
            const data={
                message:error.message,
                code:error.code
            }
            return data
        }
    }
    

    async getCart(cid) {
        try {    
            let cart=await Cart.findOne({_id:cid})
            if(cart){
                
                for(let i=0;i<cart.products.length;i++){
                    const item=cart.products[i];
                    const productData=await Product.findById(item._id);
                    if(productData){
                        cart.products[i].product=productData
                    }
                }
                return cart.toJSON()
            }else{
                const data={
                    message:"No existe cart con ese id",
                    status:false
                }
            } 
        } catch (error) {
            console.error("Error",error)
            throw error
        }
    }
    async update(cid,pid){
        const result=await Cart.findOneAndUpdate(
            {_id:cid ,"products:product":pid},
            {$inc: {"products.$.quantity":1}},
            {new:true}
        )
        if(result) return result
        const newProduct=await Cart.findByIdAndUpdate(
            {_id:cid},
            {$push:{products:{product:pid,quantity:1}}},
            {new:true}
        )
    }
    async createCart() {
        try {
            const result = await Cart.create({products:[]})
            console.log(result)
            return result
        } catch (error) {
            return error;
        }
    }
    async clear(cid){
        const result=await Cart.findByIdAndUpdate(
            {_id:cid},
            {$set: {products:[]}},
            {new:true}
        )
        return result
    }
}

module.exports = CartManager;
