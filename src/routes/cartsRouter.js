const { Router } = require("express");
const CartManager = require("../controllers/CartsManager.js");

const cartRouter = Router();
const cartManager = new CartManager("carts.json");
//AGREGAR PRODUCTO AL CART
cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const results = await cartManager.addProduct(cid, pid);
        console.log(results);
        res.send(results);
    } catch (error) {
        res.send(error);
    }
});
//REMOVER PRODUCTO DEL CART
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const results = await cartManager.removeProduct(cid,pid);
        res.send(results);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
});
//TRAER CART CON SUS PRODUCTOS
cartRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const results = await cartManager.getCart(cid);
        console.log(results)
        //res.send(results)
        res.render("cart",{products:results.products,cartId:results._id});
    } catch (error) {
        res.send(error);
    }
});
//CAMBIAR CANTIDAD DE UN PRODUCTO EN EL CART
cartRouter.put('/:cid/product/:pid',async(req,res)=>{
    try {
        const {quantity}=req.body
        const{cid,pid}=req.params;
        //console.log(quantity,cid,pid)
        const result=await cartManager.update(cid,pid,parseInt(quantity))
        console.log(result,"A")
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})
//VACIAR CARRITO
cartRouter.delete('/:cid',async(req,res)=>{
    try {
        const {cid}=req.params;
        const results=await cartManager.clear(cid)
        res.send(results)
    } catch (error) {
        res.send(error)
    }
})
//CREAR CART
cartRouter.post('/', async (req, res) => {
    try {
        const results = await cartManager.createCart();
        console.log(results)
        res.send(results);
    } catch (error) {
        res.send(error);
    }
});

module.exports = cartRouter;
