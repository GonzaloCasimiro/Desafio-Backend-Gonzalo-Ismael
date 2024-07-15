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
    updateProduct=async (req, res) => {
        try {
            const {pid,key,value}=req.body
            const result=await productService.updateProduct(pid,key,value)
            if(!result){
                return res.send({status:"error",message:"no existe producto con ese id"})
            }else{
                return res.send({status:'succes',message:"producto actualizado",updateData:{key,value}})
            }
        } catch (error) {
            console.error(error)
        }
    }
    addProduct=async (req, res) => {
        try {
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            const result = await productService.createProduct(title, description, price, code, stock, category, thumbnail);
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
    }
    deleteProduct=async (req, res,next) => {
        try {
            const { pid } = req.body
            const result = await productService.deleteProduct(pid);
            if(!result){
                CustomError.createError({
                    name:"Error al eliminar producto",
                    cause:"Id incorrecto",
                    message:"error al eliminar producto",
                    code:EError.INVALID_TYPES
                })
            }else{
                return res.send({message:"producto eliminado",status:"succes",pid})
            }
        } catch (error) {
            next(error)
        }
    }
}
module.exports = ProductController