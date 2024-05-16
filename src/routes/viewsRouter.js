const { Router } = require('express');
const viewRouter = Router();
const ProductManager = require('../controllers/ProductsManager.js');
const ChatManger=require("../controllers/ChatManager.js")
const { Product } = require('../dao/models/productSchema.js');
const productSocket = require('../controllers/utils/productsSocket.js');
const express=require('express')
const nuevoChatManger=new ChatManger();
const nuevoProductManager = new ProductManager('productos.json');
const CartManager = require("../controllers/CartsManager.js");
const cartManager = new CartManager("carts.json");
//viewRouter.use(productSocket())
viewRouter.get('/products', async (req, res) => {
    try {
        const { limits,pageNumber,sort,category,stock } = req.query;
        const data={}
        if(stock){data.stock=parseInt(stock)}
        if(sort && (sort===1 || sort===-1)){data.sort=parseInt(sort)}
        if(limits){data.limits=parseInt(limits)}
        if(pageNumber){data.page=parseInt(pageNumber)}
        if(category){
            const products=await nuevoProductManager.getProductsByCategory(data.limits,data.page,data.sort,category,data.stock)
            const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
            res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page });
        }else{
            const products=await nuevoProductManager.getProducts(data.limits,data.page,data.sort,stock);
            console.log(products)
            const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
            
            res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page });  
        }
    }catch (error) {
        res.send(error);
    }
});

viewRouter.post('/products', async (req,res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const result = await nuevoProductManager.addProduct(title, description, price, code, stock, category, thumbnail);
        if(result.status){
            if(result.staus===400){
                return res.status(400).send({status:"error",message:result.message})
            }else {
                return  res.status(409).send({ status: "error", message:result.message})
            }
        }else{
            //req.socketServer.emit("nuevoProducto",result)
            res.status(200).send({ status: "success", payload: result });
        }  
    } catch (error) {
        res.send(`${error}`);
    }
});


viewRouter.delete('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        console.log(pid)
        const result = await nuevoProductManager.deleteProduct(pid);
        console.log(result)
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});
viewRouter.put('/products',async(req,res)=>{
    try {
        const data=req.body
        const id=data.pid
        const result=await nuevoProductManager.updateProduct(id,data)
        console.log(result)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})
viewRouter.get("/chats",async(req,res)=>{
    try {
        const messages=await nuevoChatManger.getAllMessages()
        console.log(messages)
        res.render("chat",{messages:messages})
    } catch (error) {
        res.send(error)
    }
})
viewRouter.post("/message",async(req,res)=>{
    try {
        const {user,message}=req.body
        const result=await nuevoChatManger.newMessage(message,user)
        console.log(result)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})
//cart
viewRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        console.log(cid,pid)
        const results = await cartManager.removeProduct(cid,pid);
        console.log(results);
        res.send(results);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
});

module.exports = viewRouter;
