const { Router } = require('express');
const productRouter = Router();
const ProductController = require("../../controllers/product.controller.js");
const {getProducts,getProduct,updateProduct,addProduct,deleteProduct}=new ProductController()
productRouter.get('/',getProducts );

productRouter.get('/:pid',getProduct );

productRouter.put('/',updateProduct );

productRouter.post('/',addProduct );

productRouter.delete('/',deleteProduct );

module.exports = productRouter;
