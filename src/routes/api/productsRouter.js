const { Router } = require('express');
const productRouter = Router();
const ProductController = require("../../controllers/product.controller.js");
const editProductMid = require('../../middlewares/editProductMidleware.js');
const { authorization } = require('../../middlewares/authorization.middleware.js');
const {getProducts,getProduct,updateProduct,addProduct,deleteProduct,getByCode,getAllProducts}=new ProductController()
productRouter.get('/getAll', getAllProducts)
productRouter.get('/',getProducts );
productRouter.get('/code/:code',getByCode);
productRouter.post('/createProduct', addProduct);

productRouter.get('/:pid',getProduct );

productRouter.put('/' ,editProductMid, updateProduct );

productRouter.post('/',authorization('admin'),addProduct );

productRouter.delete('/',deleteProduct );

module.exports = productRouter;
