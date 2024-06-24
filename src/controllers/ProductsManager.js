const fs = require("fs");
//const { __dirname } = require("../utils.js");
const  Product  = require("../dao/models/productSchema.js");
const { Model, default: mongoose } = require("mongoose");

class ProductManager {
    constructor() {
    }
    async getStock(pid){
        const result=await Product.exists({_id:pid,stock:{$gt:0}}) //devuelve el producto si cumple con los requisitos (pid  y mayor a 0)
        return !!result    // !! convierte en booleano true o false
    }
    async addProduct(data) {
        const result = await Product.create(data);
        return result.toObject()
    }

    async getProducts(limits=5,numberPage=1,sort=-1,stock=0) {

            if(stock===1){
                const products=await Product.paginate({stock:{$gt : 0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }else{
                const products = await Product.paginate({},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }    
    }
    async getProductsByCategory(limits=5,numberPage=1,sort=-1,category,stock=0) {
            if(stock>0){
                const products = await Product.paginate({category:category,stock:{$gt:0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }
            else{
                const products = await Product.paginate({category:category},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }
    }
    async getlimitsProducts(limit){
            const products=await Product.find().limit(limit)
            const productsB=products.map(product=>product.toObject())
            return productsB;
    }
    async getProductsById(id) { 
            const product=await Product.findById(id);       
               const productB=product.toObject();
                return productB

    }

    async updateProduct(id,key,value) {
        const update=await Product.findByIdAndUpdate({id:id},{[key]:value})
        return update    
    }

    async deleteProduct(id) {
            //const result=await Product.findByIdAndDelete(ObjectId(id))
            const result =await  Product.findByIdAndDelete(id)        
                return result
    }
}

module.exports = ProductManager;
