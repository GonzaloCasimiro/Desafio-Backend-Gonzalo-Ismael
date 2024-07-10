const { Router } = require('express');
const viewRouter = Router();
const { Product } = require('../../models/productSchema.js');
const { auth } = require('../../middlewares/auth.middleware.js');
const { passportCall } = require('../../middlewares/passportCall.middelware.js');
const { authorization } = require('../../middlewares/authorization.middleware.js');
const viewController = require('../../controllers/view.controller.js');
const { productService, cartService, userService,ticketService} = require('../../service/service.js');
const MessagesDaoMongo = require('../../dao/MONGO/ChatDao.mongo.js');
const Message = require('../../models/messageSchema.js');
const { default: mongoose } = require('mongoose');
const {mapProductsDto,setProductsInCart, stock} = require('../../dtos/cartsDto.js');
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
        const onProcessTicket=await ticketService.getTickets(email,"on process")
        if(onProcessTicket){
            let products=mapProductsDto(cart.products,onProcessTicket.products)//array con productos del anterior ticket que NO estan en el cart
           console.log(products,"productos que en teoria no esta,...")
            cart=await cartService.addProducts(cid,products) //pushea cada objeto de products al cart
           await ticketService.deleteTicket(onProcessTicket._id)//eliminar ticket
        
        }
        const cartStock=await stock(cart)
        cart=await setProductsInCart(cart)// uso este dto porque no me anda el populate del cart 
        let user=await userService.getUser(email)
        user=user.toJSON()
        res.render("purchase",{inStock:cartStock.inStock,outStock:cartStock.outStock,user,total:cartStock.total,cartProducts:cart.products})
    } catch (error) {
        console.log(error)
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
