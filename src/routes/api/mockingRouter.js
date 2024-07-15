const { Router } = require("express");
const mockingRouter = Router();

const compression = require('compression');
const { productService } = require("../../service/service");
const generateProducts = require("../../utils/mockGenerate");

// Usa el middleware de compresión
mockingRouter.use(compression());

mockingRouter.get('/', async (req, res) => {
  try {
    let products=[]
    for(let i=0;i<100;i++){
      products.push(generateProducts())
    }
    res.send(products);
  } catch (error) {
    res.send(error);
  }
});

module.exports = mockingRouter;
