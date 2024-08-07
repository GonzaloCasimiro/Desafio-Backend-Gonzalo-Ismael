const {Router}= require('express');
const router=Router()
const productRouter = require("./api/productsRouter.js");
const cartRouter = require("./api/cartsRouter.js");
const viewRouter = require("./api/viewsRouter.js");
const userRouter = require("./api/userRouter.js");
const pruebasRouter = require("./api/pruebas.Router.js");
const sessionRouter = require("./api/sessionRouter.js");
const commentRouter = require('./api/commentRouter.js');
const mockingRouter = require('./api/mockingRouter.js');


router.use('/products', productRouter);
router.use('/api/carts', cartRouter);
router.use('/api/views', viewRouter);
router.use("/api/users",userRouter)
router.use("/pruebas",pruebasRouter)
router.use("/api/sessions",sessionRouter)
router.use('/api/comments',commentRouter)
router.use('/api/mockingproducts',mockingRouter)
router.use('/loggerTest',async(req,res)=>{
    req.logger.info("info desde el /logerTest")
    req.logger.http('hhtpp desde el /logerTest')
    req.logger.warning('warninrg desde el /logerTest')
    req.logger.error('error desde el /logerTest')
    req.logger.fatal('fatal , desde el /logertest')
    res.send('logertest')
})

module.exports=router