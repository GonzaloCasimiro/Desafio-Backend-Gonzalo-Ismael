const fs = require("fs");
//const { __dirname } = require("../utils.js");
const Product=require("../dao/models/productSchema.js")
const Cart=require("../dao/models/cartSchema.js")
const { Model, default: mongoose } = require("mongoose");
const {ObjectId}=require("mongoose")
class CartManager {
    constructor() {}
    async addProduct(cid, pid) {
        const productid=new mongoose.Types.ObjectId(pid)
        let cart=await Cart.findOneAndUpdate({_id:cid,'products._id':productid},
            {
                $inc: { 'products.$.quantity': 1 },                
            },{
                new:true,
            })
        if(!cart){
            cart=Cart.findOneAndUpdate({_id:cid},
                {$push:{products:{_id:productid,quantity:1}}},
                {new:true})
        }
        
        return cart
        /*
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
                const productData=await Product.findById(pid)
                if(product){
                    product.quantity++
                    
                    const data ={
                        message:`Producto agregado al cart,cantidad: ${product.quantity}`,
                        status:"true",
                        product:{
                            thumbnail:productData.thumbnail,
                            title:productData.title,
                            price:productData.price,
                            quantity:1,
                            id:product._id
                        }

                    }
                    await cart.save()
                    return data
                }else{
                    cart.products.push({_id:pid,quantity:1})
                    const data ={
                        message:"Producto agregado al cart",
                        status:"true",
                        product:{
                            thumbnail:productData.thumbnail,
                            title:productData.title,
                            price:productData.price,
                            id:pid
                        }
                    }
                    await cart.save()
                    return data
                }
            }
            
        } catch (error) {
            console.log(error)
            const data={
                status:"false",
                message:error.message,
                code:error.code
            }
            return data
        }*/
    }

    async removeProduct(cid, pid) {
        let cart=await Cart.findOneAndUpdate({_id:cid,'products._id':pid},
            {
                $inc:{'products.$.quantity':-1}
            },
            {
                new:true
            })
        
        cart=await Cart.findByIdAndUpdate(
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
    

    async getCart(cid) {
        try {    
            let cart=await Cart.findOne({_id:cid})
            return cart
            /*
            if(cart){
                
                for(let i=0;i<cart.products.length;i++){
                    const item=cart.products[i];
                    const productData=await Product.findById(item._id);
                    console.log(productData, i)
                    if(productData){
                        cart.products[i].product=productData
                    }
                }
                return cart.toJSON()
            }else{
                const data ={ 
                    message:"No existe cart con ese id",
                    status:"false"
                }
                return data
            } */
        } catch (error) {
            console.error("Error",error)
            throw error
        }
    }
    async update(cid, pid, quantity) {  
            const cart=await Cart.findOneAndUpdate(
                {_id:cid,'products._id':pid},
                {$inc:{'products.$.quantity':quantity}},
                {new:true,})
            
                return cart
        /*
        const cart=await Cart.findById(cid);
        const product=cart.products.find(product=>product._id.toString()===pid)
        product.quantity=product.quantity+quantity;
        console.log(product.quantity)
        if(product.quantity===0){
            cart.products.pull({_id:pid})
            const data={
                status:"succes",
                message:"se ha quitado el producto",
                pid:pid,
                quantity:product.quantity
            }
            cart.save()
            return data
        }else{
            const data={
                status:"succes",
                message:"se ha cambiado la cantidad del producto",
                pid:pid,
                quantity:product.quantity
            }
            cart.save()
            return data
        }*/
    }
    
    async createCart() {
            const result = await Cart.create({products:[]})
            return result
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
