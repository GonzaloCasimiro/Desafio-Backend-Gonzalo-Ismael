const ProductManager = require("../controllers/ProductsManager.js");
const { Router } = require('express');
const productRouter = Router();
const nuevoProductManager = new ProductManager('productos.json');
const { Product } = require("../dao/models/productSchema.js");

productRouter.get('/', async (req, res) => {
    try {
        const { limits } = req.query;
        if (!limits) {
            const products = await nuevoProductManager.getProducts();
            res.render('index', { products: products });
        } else {
            const products=await nuevoProductManager.getlimitsProducts(parseInt(limits))
            console.log(products)
            res.render('index', { products: products });
        }
    } catch (error) {
        res.send(error);
    }
});

productRouter.get('/:pid', async (req, res) => {
    const {pid}=req.params
    console.log(pid)
    try {
        const product = await nuevoProductManager.getProductsById(pid);
        console.log(product)
        res.send(product);
    } catch (error) {
        res.send(error);
    }
});

productRouter.put('/:pid', async (req, res) => {
    try {
        const data=req.body
        const {pid}=req.params
        console.log(pid)
        const result=await nuevoProductManager.updateProduct(pid,data)
        console.log(result)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
});

productRouter.post('/', async (req, res) => {
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

productRouter.delete('/:pid', async (req, res) => {
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

module.exports = productRouter;
