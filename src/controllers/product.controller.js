const ProductManager = require("./ProductsManager");
const nuevoProductManager = new ProductManager('productos.json');

class ProductController{
    constructor(){}
    getProducts=async (req, res) => {
        try {
            const { limits,pageNumber,sort,category,stock } = req.query;
            const data={}
            if(stock){data.stock=parseInt(stock)}
            if(sort && (sort===1 || sort===-1)){data.sort=parseInt(sort)}
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
    }
    getProduct=async (req, res) => {
        const {pid}=req.params
        try {
            const product = await nuevoProductManager.getProductsById(pid);
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
            const result=await nuevoProductManager.updateProduct(pid,key,value)
            if(!result){
                return res.send({status:"error",message:"no existe producto con ese id"})
            }else{
                return res.send({status:'succes',message:"producto actualizado",key,value,pid})
            }
        } catch (error) {
            res.send(error)
        }
    }
    addProduct=async (req, res) => {
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
    }
    deleteProduct=async (req, res) => {
        try {
            const { pid } = req.body
            const result = await nuevoProductManager.deleteProduct(pid);
            if(!result){
                return res.status(401).send({message:"id incorrecto",status:"error"})
            }else{
                return res.send({message:"producto eliminado",status:"succes",pid})
            }
        } catch (error) {
            res.send(error);
        }
    }
}
module.exports = ProductController