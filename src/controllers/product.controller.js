const { default: mongoose } = require("mongoose");
const ProductDaoMongo = require("../dao/MONGO/ProductDao.mongo");
const { productService } = require("../service/service");
const CustomError = require("../utils/errors/CustomError");
const EError = require("../utils/errors/enum");
class ProductController{
    constructor(){}
    getByCode=async(req,res)=>{
        try {
            const {code}=req.params
            const result=await productService.getProductByCode(code)
           if(result) return res.status(200).send({status:"success",message:"Producto encontrado",pid:result._id})
            res.status(401).send({status:"error",message:`${code}, no es valido`})
        } catch (error) {
            res.status(500).send({status:"error",message:error})
        }
    }
    getProducts=async (req, res) => {
        try {
            const { limits,pageNumber,sort,category,stock } = req.query;
            const data={}
            if(stock){data.stock=parseInt(stock)}
            if(sort && (sort===1 || sort===-1)){data.sort=parseInt(sort)}
            if(limits){data.limits=parseInt(limits)}
            if(pageNumber){data.page=parseInt(pageNumber)}
            if(category){
                const products=await productService.getProductsByCategory(data.limits,data.page,data.sort,category,data.stock)
                const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
                res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page });
            }else{
                const products=await productService.getProducts(data.limits,data.page,data.sort,stock);
                const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
                
                res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page });  
            }
        }catch (error) {
            res.send(error);
        }
    }
    getAllProducts=async(req,res)=>{
        try {
            const products=await productService.getProducts();
            res.send({status:"success",products})
        } catch (error) {
            res.send(error);
        }
    }
    getProduct=async (req, res) => {
        const {pid}=req.params
        try {
            const product = await productService.getProduct(pid);
            if(product===null){
                return res.status(401).send({status:"error",message:"No existe producto con ese pid"})
            }else{
                return res.send({status:"succes",product})
            }
        } catch (error) {
            res.status(501).send({status:"error",message:error.message});
        }
    }
    updateProduct=async (req, res,next) => {
        try {
            const {pid,key,value,owner}=req.body
            const product=await productService.getProduct(pid);     
            if(owner){
                if(owner!==product.owner){
                    req.logger.info('No es propietario del producto que intenta actualizar')
                    CustomError.createError({
                        name:"Error al actualizar producto",
                        cause:"No puedes actualizar un producto que no ha sido creado por ti.",
                        message:'Error al actualizar producto',
                        code:EError.NOT_ALLOWED_ERROR,
                    })
                }else{
                    const result=await productService.updateProduct(pid,key,value)
                if(!result){
                    return res.send({status:"error",message:"no existe producto con ese id"})
                }else{
                    req.logger.info('Producto actualizado',result)
                    return res.send({status:'succes',message:"producto actualizado",updateData:{key,value}})
                }
                }
            }
            if(product.owner!=="admin"){
                req.logger.info('Producto de un usuario premium,un admin no puede actualizarlo')
                CustomError.createError({
                    name:"Error al actualizar producto",
                    cause:"Este producto pertenece a un usuario premium, no puedes actualizarlo.",
                    message:'Error al actualizar producto',
                    code:EError.NOT_ALLOWED_ERROR,
                })
            }else{
                const result=await productService.updateProduct(pid,key,value)
                if(!result){
                    return res.send({status:"error",message:"no existe producto con ese id"})
                }else{
                    req.logger.info('Producto actualizado',result)
                    return res.send({status:'succes',message:"producto actualizado",updateData:{key,value}})
                }
            }
            
        } catch (error) {
            req.logger.info(error)
            next(error)
        }
    }
    addProduct=async (req, res) => {
        try {
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            console.log(req.body)
            const result = await productService.createProduct({title,description,price,thumbnail,code,stock,category});
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
            console.error(error)
            res.send(`${error}`);
        }
    }
    deleteProduct=async (req, res,next) => {
        try {
            const { pid,email } = req.body

            if(!mongoose.Types.ObjectId.isValid(pid)){
                req.logger.info('No ha ingresado un id valido')
                CustomError.createError({
                    name:"Error al eliminar producto",
                    cause:"Id incorrecto",
                    message:"error al eliminar producto",
                    code:EError.INVALID_TYPES
                })
            }
            let product=await productService.getProduct(pid)       
            if(email){
                if(email!==product.owner){
                    req.logger.info('No es propietario del producto que intenta eliminar')
                    CustomError.createError({
                        name:"Error al eliminar producto",
                        cause:"No puedes eliminar un producto que no ha sido creado por ti.",
                        message:'Error al eliminar producto',
                        code:EError.NOT_ALLOWED_ERROR,
                    })
                }else{
                    const result=await productService.deleteProduct(pid)
                    if(!result){
                        return res.send({status:"error",message:"no existe producto con ese id"})
                    }else{
                        req.logger.info('Producto eliminado',result)
                        return res.send({status:'succes',message:"producto eliminado",pid})
                    }
                }
            }/*
            if(product.owner!=="admin"){
                req.logger.info('Producto de un usuario premium, un admin no puede eliminarlo')
                CustomError.createError({
                    name:"Error al eliminar producto",
                    cause:"Este producto pertenece a un usuario premium, no puedes eliminarlo.",
                    message:'Error al eliminar producto',
                    code:EError.NOT_ALLOWED_ERROR,
                })
            }*/
            const result = await productService.deleteProduct(pid);           
            return res.send({message:"producto eliminado",status:"succes",pid})
            
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
}
module.exports = ProductController