const ProductManager = require("../controllers/ProductsManager.js");
const { Router } = require('express');
const productRouter = Router();
const nuevoProductManager = new ProductManager('productos.json');
const { Product } = require("../dao/models/productSchema.js");

productRouter.get('/', async (req, res) => {
    try {
        const { limits,pageNumber,sort,category,stock } = req.query;
        const data={}
        if(stock){data.stock=parseInt(stock)}
        if(sort && (sort>0 || sort<0)){data.sort=parseInt(sort)}
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
