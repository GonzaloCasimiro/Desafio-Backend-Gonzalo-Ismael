const { Router } = require("express");
const CartManager = require("../controllers/CartsManager.js");

const cartRouter = Router();
const cartManager = new CartManager("carts.json");

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

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const results = await cartManager.removeProduct(cid, pid);
        console.log(results);
        res.send(results);
    } catch (error) {
        res.send(error);
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const results = await cartManager.getCart(cid);
        console.log(results);
        res.send(results);
    } catch (error) {
        res.send(error);
    }
});

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