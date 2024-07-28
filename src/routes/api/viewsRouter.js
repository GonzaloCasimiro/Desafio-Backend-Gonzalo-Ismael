const { Router } = require('express');
const viewRouter = Router();
const { passportCall } = require('../../middlewares/passportCall.middelware.js');
const { authorization, productAuth, purchaseAuth } = require('../../middlewares/authorization.middleware.js');
const viewController = require('../../controllers/view.controller.js');
const { productService, cartService, userService,ticketService} = require('../../service/service.js');
const MessagesDaoMongo = require('../../dao/MONGO/ChatDao.mongo.js');
const Message = require('../../models/messageSchema.js');
const {mapProductsDto,setProductsInCart, stock} = require('../../dtos/cartsDto.js');
const { verifyPasswordToken } = require('../../utils/jsonwebtoken.js');
const Product = require('../../models/productSchema.js');
//viewRouter.use(productSocket())
const{viewProducts,postProduct,deleteProduct,updateProduct,getChats,postMessage,updateCart,admin,getProduct,editPerfil,resetPassword}=new viewController()
viewRouter.get('/products', passportCall('jwt'), viewProducts);

viewRouter.post('/products',postProduct );
viewRouter.get('/product/:pid',passportCall('jwt'),getProduct)


viewRouter.delete('/products/:pid',authorization('admin'), deleteProduct);
viewRouter.put('/products', authorization('admin'),updateProduct)
viewRouter.get("/chats", getChats)
viewRouter.post("/message", postMessage)
//cart
viewRouter.put('/:cid/product/:pid', updateCart);

viewRouter.get('/admin',passportCall('jwt'),authorization("admin") ,admin/*async(req,res)=>{
    try {
        const products=await nuevoProductManager.getProducts()
        console.log(products)
        res.render('adminMenu',{products:products.docs})
    } catch (error) {
        res.send(error)
    }
}*/)

viewRouter.get('/admin/products',passportCall('jwt'),productAuth(),async(req,res)=>{
    try {
        let premium=false
        let createdProducts=false
        if(req.user.role==="premium"){
            premium =req.user.email
            createdProducts=await Product.find({owner:premium}).lean()

        }
        console.log(createdProducts)
        res.render('adminProducts',{premium,products:createdProducts})
    } catch (error) {
        console.log(error)
        res.send('error')
    }
})
viewRouter.get('/update/:pid',passportCall("jwt"),productAuth(),async(req,res)=>{
    try {
        const {pid}=req.params
        let premium=false
        if(req.user.role==="premium"){
            premium=req.user.email
        }

        let product=await productService.getProduct(pid);
        product=product.toJSON();
        req.logger.info(product)
        res.render('updateProduct',{product:product,premium})
    } catch (error) {
        res.send(error)
    }
})
viewRouter.get('/purchase',passportCall("jwt"),purchaseAuth(),async(req,res)=>{
    try {
        if(req.session)req.session.user=req.user
        const {cid,email}=req.user
        let cart=await cartService.getCart(cid);
        const onProcessTicket=await ticketService.getTickets(email,"on process")
        if(onProcessTicket){
            let products=mapProductsDto(cart.products,onProcessTicket.products)//array con productos del anterior ticket que NO estan en el cart
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
viewRouter.get('/editPerfil',passportCall('jwt'),editPerfil)
viewRouter.get('/resetPassword/:token',verifyPasswordToken,resetPassword)

module.exports = viewRouter;
