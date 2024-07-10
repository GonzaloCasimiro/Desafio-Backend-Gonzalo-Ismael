const { default: mongoose } = require("mongoose");
class CartRepository{
    constructor(dao){
        this.dao=dao
    }
    createCart=async () => await this.dao.create()
    async deleteCart(cid) {
        return await this.dao.delete({_id:cid });
    }
    addProducts=async(cid,products)=> this.dao.addProducts(cid,products)
    update=async (filter)=> await this.dao.update(filter);
    getCart=async uid => await this.dao.get(uid)
    removeProduct=async (cid,pid)=> await this.dao.remove(cid,pid)
    addProduct=async (cid,pid)=> await this.dao.add(cid,pid)
    clearCart=async cid => await this.dao.clear(cid)
    updateCart=async  (cid,pid,quantity)=> await this.dao.update(cid,pid,quantity)
    /*async removeProduct(cid, pid) {
        let cart=await this.model.findOneAndUpdate({_id:cid,'products._id':pid},
            {
                $inc:{'products.$.quantity':-1}
            },
            {
                new:true
            })
        
        cart=this.model.findByIdAndUpdate(
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
    }*/
    /*async addProduct(cid, pid) {
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
    }*/
   /*
    async clear(cid){
        const result=await this.model.findByIdAndUpdate(
            {_id:cid},
            {$set: {products:[]}},
            {new:true}
        )
        return result
    }*/
   /*
    updateCart=async(req,res)=>{
        try {
            const {quantity}=req.body
            const{cid,pid}=req.params;
            //console.log(quantity,cid,pid)
            const result=await cartManager.update(cid,pid,parseInt(quantity))
            if(!result){
                return res.status(401).send({message:"error al actualizar el carrito",status:"error"})
            }else{
                let productID=new mongoose.Types.ObjectId(pid);
                    let product=result.products.find(product=>product._id.equals(productID));
                    let quantity=product.quantity;
                    let productData=await nuevoProductManager.getProductsById(pid);
                    let producto={
                        quantity,
                        thumbnail:productData.thumbnail,
                        title:productData.title,
                        price:productData.price,
                        id:pid
                    }
                return res.send({status:"succes",message:"Se ha cambiado la cantidad del producto",pid:pid,quantity:producto.quantity})
            }
        } catch (error) {
            res.send(error)
        }
    }*/
}
module.exports=CartRepository