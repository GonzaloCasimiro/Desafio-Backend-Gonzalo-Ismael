const fs = require("fs");
//const { __dirname } = require("../utils.js");
const Cart=require("../dao/models/cartSchema.js")
const { Model, default: mongoose } = require("mongoose");
class CartManager {
    constructor(path) {
        this.path = path;
    }

    async readFile() {
        try {
            const cars = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(cars);
        } catch (error) {
            if (error.code === "ENOENT") {
                return [];
            } else {
                console.log(error);
            }
        }
    }

    async getNextId() {
        let cars = await this.readFile();
        if (cars === "ENOENT" || cars.length === 0) {
            return 1;
        } else {
            return cars[cars.length - 1].id + 1;
        }
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
                        message:"Producto agregado al cart,2",
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
            const cart=await Cart.findById(cid);
            if(cart){
                return cart.products
            }else{
                const data={
                    message:"No existe cart con ese id",
                    status:false
                }
            }
        } catch (error) {
            return error;
        }
    }

    async createCart() {
        try {
            const result = await Cart.create(undefined)
            console.log(result)
            return result
        } catch (error) {
            return error;
        }
    }
}

module.exports = CartManager;
