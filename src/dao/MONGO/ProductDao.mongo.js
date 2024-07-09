const fs = require("fs");
//const { __dirname } = require("../utils.js");
const  Product  = require("../../models/productSchema.js");
const { Model, default: mongoose } = require("mongoose");

class ProductDaoMongo {
    constructor(model) {
        this.model=model
    }
    async getStock(pid,quantity){
        const result=await this.model.exists({_id:pid,stock:{$gte:quantity}}) //devuelve el producto si cumple con los requisitos (pid  y mayor a 0)
        return !!result    // !! convierte en booleano true o false
    }
    async updateStock(pid,quantity){
        return await this.model.findOneAndUpdate({_id:pid},{$inc:{stock:quantity}},{new:true})
    }
    async create(data) {
        const result = await this.model.create(data);
        return result.toObject()
        
        
    }

    async getProducts({limits=5,numberPage=1,sort=-1,stock=0}={}) {

            if(stock===1){
                const products=await this.model.paginate({stock:{$gt : 0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }else{
                const products = await this.model.paginate({},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }    
    }
    async getProductsByCategory({limits=5,numberPage=1,sort=-1,category,stock=0}={}) {
            if(stock>0){
                const products = await this.model.paginate({category:category,stock:{$gt:0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }
            else{
                const products = await this.model.paginate({category:category},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }
    }
    async getLimitsProducts(limit){
            const products=await this.model.find().limit(limit)
            const productsB=products.map(product=>product.toObject())
            return productsB;
    }
    async set(id,mid){
       const  product= await this.model.findById(id)
       product.mid=mid
       product.save()
       return product.toObject()
    }
    async getByCode(code){
        return await this.model.findOne({code:code})
    }
    async get(id) {     
            return await this.model.findOne({_id:id});       
     

    }

    async update(id,key,value) {
        const update=await this.model.findByIdAndUpdate({_id:id},{[key]:value},{new:true})
        return update    
    }

    async delete(id) {
            //const result=await Product.findByIdAndDelete(ObjectId(id))
            const result =await  this.model.findByIdAndDelete(id)        
                return result
    }
}

module.exports = ProductDaoMongo;
