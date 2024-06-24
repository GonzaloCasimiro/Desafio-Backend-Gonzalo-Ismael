
const { passportCall } = require('../middlewares/passportCall.middelware.js');
const { authorization } = require('../middlewares/authorization.middleware.js');
const CartManager = require('./CartsManager.js');
const ProductManager = require('./ProductsManager.js');
const MessagesManager = require('./ChatManager.js');
const nuevoChatManger=new MessagesManager();
const nuevoProductManager = new ProductManager();
const cartManager = new CartManager();
class viewController{
    constructor(){};
    viewProducts= async (req, res) => {
        try {
            if(req.session.user)req.user=req.session.user
            const { limits,pageNumber,sort,category,stock } = req.query;
            const data={}
            if(stock){data.stock=parseInt(stock)}
            if(sort && (sort===1 || sort===-1)){data.sort=parseInt(sort)}
            if(limits){data.limits=parseInt(limits)}
            if(pageNumber){data.page=parseInt(pageNumber)}
            if(req.user){
                const user=req.user
                const cart=await cartManager.getCart(user.cid);
                const cartProducts=cart.products
                if(category){
                    const products=await nuevoProductManager.getProductsByCategory(data.limits,data.page,data.sort,category,data.stock)
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
                    res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page,user:user,cartProducts });
                }else{
                    const products=await nuevoProductManager.getProducts(data.limits,data.page,data.sort,stock);
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products           
                    res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page,user:user,cartProducts });  
                }
            }else{
                if(category){
                    const products=await nuevoProductManager.getProductsByCategory(data.limits,data.page,data.sort,category,data.stock)
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
                    res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page });
                }else{
                    const products=await nuevoProductManager.getProducts(data.limits,data.page,data.sort,stock);
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products           
                    res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page });  
                }
            }
        }catch (error) {
            res.send(error);
        }
    }
    postProduct=async (req,res) => {
        try {
    
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            if(!title||!description||!price||!code||!stock||!category){
                return res.status(403).send({message:"Debes llenar todos los campos",status:"error"})
            }
            else{
                const producto={
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    category
                }
                const result=await nuevoProductManager.addProduct(producto)
                if(result.status){
                    if(result.staus===400){
                        return res.status(400).send({status:"error",message:result.message})
                    }else {
                        return  res.status(409).send({ status: "error", message:result.message})
                    }
                }else{
                    res.status(200).send({ status: "success", payload: result });
                }
            }
        } catch (error) {
            res.status(501).send({status:'error',message:error.message});
        }
    }
    deleteProduct=async (req, res) => {
        try {
            const { pid } = req.params;
            const result = await nuevoProductManager.deleteProduct(pid);
            if(result===null){
                return res.status(401).send({message:"NO EXISTE PRODUCTO CON ESE ID",status:"error"})
            }else{
                return res.send({message:"PRODUCTO ELIMINADO CON EXITO",status:"succes",pid:pid})
            }
        } catch (error) {
            res.status(501).send({message:error.message,status:"error"});
        }
    }
    updateProduct=async(req,res)=>{
        try {
            const {pid,key,value}=req.body
    
            const product=await nuevoProductManager.getProductsById(pid);
            if(!product){
                return res.status(401).send({status:"error",message:"No existe producto con ese id"})
            }else{
                const result= await nuevoProductManager.updateProduct(pid,key,value)
                return res.send({status:'succes',message:"Producto actualizado con exito",pid,key,value})
            } 
        } catch (error) {
            res.send(error)
        }
    }
    getChats=async(req,res)=>{
        try {
            const messages=await nuevoChatManger.getAllMessages()
            console.log(messages)
            res.render("chat",{messages:messages})
        } catch (error) {
            res.send(error)
        }
    }
    postMessage=async(req,res)=>{
        try {
            const {user,message}=req.body
            const result=await nuevoChatManger.newMessage(message,user)
            console.log(result)
            res.send(result)
        } catch (error) {
            res.send(error)
        }
    }
    updateCart=async (req, res) => {
        try {
            const { cid, pid } = req.params;
            console.log(cid,pid)
            const results = await cartManager.removeProduct(cid,pid);
            console.log(results);
            res.send(results);
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }
    admin=async(req,res)=>{
        try {
            const products=await nuevoProductManager.getProducts()
            console.log(products)
            res.render('adminMenu',{products:products.docs})
        } catch (error) {
            res.send(error)
        }
    }
}
module.exports=viewController