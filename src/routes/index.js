const {Router}= require('express');
const router=Router()
const productRouter = require("./api/productsRouter.js");
const cartRouter = require("./api/cartsRouter.js");
const viewRouter = require("./api/viewsRouter.js");
const userRouter = require("./api/userRouter.js");
const pruebasRouter = require("./api/pruebas.Router.js");
const sessionRouter = require("./api/sessionRouter.js");

router.use('/products', productRouter);
router.use('/api/carts', cartRouter);
router.use('/api/views', viewRouter);
router.use("/api/users",userRouter)
router.use("/pruebas",pruebasRouter)
router.use("/api/sessions",sessionRouter)

module.exports=router