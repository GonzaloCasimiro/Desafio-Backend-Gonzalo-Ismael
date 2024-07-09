const { Router } = require('express');
const viewRouter = Router();
const { Product } = require('../../models/productSchema.js');
const { auth } = require('../../middlewares/auth.middleware.js');
const { passportCall } = require('../../middlewares/passportCall.middelware.js');
const { authorization } = require('../../middlewares/authorization.middleware.js');
const viewController = require('../../controllers/view.controller.js');
const { productService, cartService, userService } = require('../../service/service.js');
const MessagesDaoMongo = require('../../dao/MONGO/ChatDao.mongo.js');
const Message = require('../../models/messageSchema.js');
const { default: mongoose } = require('mongoose');
const messages=new MessagesDaoMongo(Message)
//viewRouter.use(productSocket())
const{viewProducts,postProduct,deleteProduct,updateProduct,getChats,postMessage,updateCart,admin,getProduct}=new viewController()
viewRouter.get('/products', passportCall('jwt'), viewProducts);

viewRouter.post('/products',postProduct );
viewRouter.get('/product/:pid',passportCall('jwt'),getProduct)


viewRouter.delete('/products/:pid', deleteProduct);
viewRouter.put('/products', updateProduct)
viewRouter.get("/chats", getChats)
viewRouter.post("/message", postMessage)
//cart
viewRouter.put('/:cid/product/:pid', updateCart);

viewRouter.get('/admin',passportCall('jwt'),authorization('admin') ,admin/*async(req,res)=>{
    try {
        const products=await nuevoProductManager.getProducts()
        console.log(products)
        res.render('adminMenu',{products:products.docs})
    } catch (error) {
        res.send(error)
    }
}*/)

viewRouter.get('/admin/products',authorization("admin"),async(req,res)=>{
    try {
        res.render('adminProducts',{})
    } catch (error) {
        res.send('error')
    }
})
viewRouter.get('/update/:pid',authorization("admin"),async(req,res)=>{
    try {
        const {pid}=req.params
        const product=await productService.getProduct(pid);
        res.render('updateProduct',{product:product})
    } catch (error) {
        res.send(error)
    }
})
viewRouter.get('/purchase',passportCall("jwt"),authorization("user"),async(req,res)=>{
    try {
        const {cid,email}=req.user
        let cart=await cartService.getCart(cid);
        let inStock=[]
        let outStock=[]
        let total=0
        for(let i=0;i<cart.products.length;i++){
            const item=cart.products[i];
            const quantity=cart.products[i].quantity
            const getStock=await productService.getStock(item._id,quantity)
            let productData=await productService.getProduct(item._id)
            if(getStock){
                inStock.push({quantity:quantity,product:productData.toJSON()})
                total=total+productData.price
            }else{
                outStock.push({quantity:quantity,product:productData.toJSON()})
            }
        } 
        console.log(inStock,"Stock")
        let user=await userService.getUser(email)
        user=user.toJSON()
        res.render("purchase",{inStock,outStock,user,total})
    } catch (error) {
        res.send(error)
    }
})
viewRouter.get('/purchase',passportCall("jwt",authorization("user"),async(req,res)=>{
    try {
        const {name,lastname,email,id,cid}=req.user
        
    } catch (error) {
        
    }
}))
module.exports = viewRouter;
