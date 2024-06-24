const { Router } = require("express");
const CartManager = require("../../controllers/CartsManager.js");
const Cart = require("../../dao/models/cartSchema.js");
const Product = require("../../dao/models/productSchema.js");
const { default: mongoose } = require("mongoose");
const ProductManager = require("../../controllers/ProductsManager.js");
const CartController = require("../../controllers/cart.controllers.js");

const cartRouter = Router();
const cartManager = new CartManager("carts.json");
const nuevoProductManager=new ProductManager();
const {createCart,updateCart,cleanCart,getCart,removeProduct,addProduct}=new CartController()
//AGREGAR PRODUCTO AL CART
cartRouter.post("/:cid/product/:pid", addProduct/*async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const stock=await nuevoProductManager.getStock(pid);
        if(!stock){
            return res.status(404).send({status:'error',message:"Lo siento,no hay stock disponible en este producto"})
        }else{
            const result=await cartManager.addProduct(cid,pid);
            if(!result){
                return res.status(401).send({status:'error',message:'error al agregar producto al carrito'})           
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
                return res.send({status:"succes",message:"producto agregado al cart",producto})
            }
            }
    } catch (error) {
        res.status(500).send({status:'error',message:error.message});
    }
}*/);
//REMOVER PRODUCTO DEL CART
cartRouter.delete('/:cid/product/:pid',removeProduct /*async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartManager.removeProduct(cid,pid);
        res.send({status:'succes',message:"Producto eliminado con exito",pid});
    } catch (error) {
        res.send(error);
    }
}*/);
//TRAER CART CON SUS PRODUCTOS
cartRouter.get('/:cid',getCart /*async (req, res) => {
    try {
        const { cid } = req.params;
        let cart = await cartManager.getCart(cid);
        if(cart){
                
            for(let i=0;i<cart.products.length;i++){
                const item=cart.products[i];
                const productData=await Product.findById(item._id);
                console.log(productData, i)
                if(productData){
                    cart.products[i].product=productData
                }
            }
            cart= cart.toJSON()
            return res.send(cart)
        }else{
            return res.status(401).send({status:"error",message:"no exist cart con ese id"})
        } 
        //res.send(results)
        //res.render("cart",{products:results.products,cartId:results._id});
    } catch (error) {
        res.send(error);
    }
}*/);
//CAMBIAR CANTIDAD DE UN PRODUCTO EN EL CART
cartRouter.put('/:cid/product/:pid', updateCart/*async(req,res)=>{
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
)
//VACIAR CARRITO
cartRouter.delete('/:cid',cleanCart /*async(req,res)=>{
    try {
        const {cid}=req.params;
        const result=await cartManager.clear(cid)
        if(!result){
            return res.status(401).send({status:"error",message:"Error al vaciar el carrito"})
        }else{
            return res.send({status:"succes",message:"Se ha vaciado el carrito",result})
        }
    } catch (error) {
        res.status(501).send({status:"error",message:error.message})
    }
}*/)
//CREAR CART
cartRouter.post('/', createCart/*async (req, res) => {
    try {
        const results = await cartManager.createCart();
        res.send(results);
    } catch (error) {
        res.send(error);
    }
}*/);

module.exports = cartRouter;
