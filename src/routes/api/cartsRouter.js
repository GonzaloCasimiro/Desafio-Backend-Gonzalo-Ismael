const { Router } = require("express");
const CartController = require("../../controllers/cart.controllers.js");
const { passportCall } = require("../../middlewares/passportCall.middelware.js");

const cartRouter = Router();

const {createCart,updateCart,cleanCart,getCart,removeProduct,addProduct,deleteCart,createTicket}=new CartController()
//AGREGAR PRODUCTO AL CART
cartRouter.post("/:cid/product/:pid",passportCall("jwt"),addProduct);
//REMOVER PRODUCTO DEL CART
cartRouter.delete('/:cid/product/:pid',removeProduct );
//TRAER CART CON SUS PRODUCTOS
cartRouter.get('/:cid',getCart );
//CAMBIAR CANTIDAD DE UN PRODUCTO EN EL CART
cartRouter.put('/:cid/product/:pid', updateCart)
//VACIAR CARRITO
cartRouter.delete('/:cid',cleanCart)
//CREAR CART
cartRouter.post('/', createCart);
cartRouter.delete('/borrar/:cid',deleteCart)
cartRouter.post('/purchase',passportCall("jwt"),createTicket)
module.exports = cartRouter;
