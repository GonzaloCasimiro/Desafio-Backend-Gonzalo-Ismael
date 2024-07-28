
const { passportCall } = require('../middlewares/passportCall.middelware.js');
const { authorization } = require('../middlewares/authorization.middleware.js');
const Message = require('../models/messageSchema.js');
const MessagesDaoMongo = require('../dao/MONGO/ChatDao.mongo.js');
const messages=new MessagesDaoMongo(Message)
const { cartService, productService } = require('../service/service.js');
const { productError } = require('../utils/errors/info.js');
const { createError } = require('../utils/errors/CustomError.js');
const CustomError = require('../utils/errors/CustomError.js');
const EError = require('../utils/errors/enum.js');
const Product = require('../models/productSchema.js');
const { decodePasswordToken } = require('../utils/jsonwebtoken.js');

const nuevoChatManger=new MessagesDaoMongo();
class viewController{
    constructor(){};
    getProduct=async(req,res)=>{
        try {
            const {pid}=req.params;
            let product=await productService.getProduct(pid);
            product=product.toJSON()
            let image="https://via.placeholder.com/400x300?text=Imagen+2";
            if(!product.mid){
                const message=await messages.create()
                product=await productService.setProduct(pid,message._id)
            }
            let mid=product.mid
            let boxMessages=await messages.get(mid)
            boxMessages=boxMessages.messages
            if(req.session.user)req.user=req.session.user
            if(req.user){
                let cart=await cartService.getCart(req.user.cid)
                if(cart){
                        
                    for(let i=0;i<cart.products.length;i++){
                        const item=cart.products[i];
                        const productData=await productService.getProduct(item._id)
                        //const productData=await Product.findById(item._id);
                        if(productData){
                            cart.products[i].product=productData
                        }
                    }
                    cart= cart.toJSON()
                }
                const cartProducts=cart.products
                    if(req.user.role && req.user.role==="admin")return res.render('product',{product:product,admin:req.user,cid:req.user.cid,pid:req.user.id,cartProducts,image,messages:boxMessages.toObject(),mid:mid,username:`${req.user.name} ${req.user.lastname}`})
                    if(req.user.role && req.user.role==="user")return res.render('product',{product:product,user:req.user,cid:req.user.cid,uid:req.user.id,pid:pid,cartProducts,image,messages:boxMessages.toObject(),mid:mid,username:`${req.user.name} ${req.user.lastname}`})
                    if(req.user.role && req.user.role==="premium")return res.render('product',{product:product,user:req.user,cid:req.user.cid,uid:req.user.id,pid:pid,cartProducts,image,messages:boxMessages.toObject(),mid:mid,username:`${req.user.name} ${req.user.lastname}`})   
            }
            if(boxMessages.length===0)boxMessages=[{user:"Vacio",message:"Se el primero en comentar"}]
            res.render('product',{product:product,image,messages:boxMessages})
            
        } catch (error) {
            console.error(error)
            res.status(500).send({status:"error",message:error.message})
        }
    }
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
                let cart=await cartService.getCart(user.cid);
                let premium=false;
                if(user.role==="premium") premium=true;
            if(cart){
                    
                for(let i=0;i<cart.products.length;i++){
                    const item=cart.products[i];
                    const productData=await productService.getProduct(item._id)
                    //const productData=await Product.findById(item._id);
                    if(productData){
                        cart.products[i].product=productData
                    }
                }
                cart= cart.toJSON()
            }
                const cartProducts=cart.products
                const {id}=req.user
                if(category){
                    
                    const products=await productService.getProductsByCategory(data.limits,data.page,data.sort,category,data.stock)
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
                    res.render('index', { uid:id,products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page,user:user,cartProducts,premium });
                }else{
                    const products=await productService.getProducts(data.limits,data.page,data.sort,stock);
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products           
                    res.render('index', {uid:id, products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page,user:user,cartProducts,premium });  
                }
            }else{
                if(category){
                    const products=await productService.getProductsByCategory(data.limits,data.page,data.sort,category,data.stock)
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products
                    res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page,premium });
                }else{
                    const products=await productService.getProducts(data.limits,data.page,data.sort,stock);
                    const{docs,hasPrevPage,hasNextPage,prevPage,nextPage,page}=products           
                    res.render('index', { products:docs,hasPrevPage,hasNextPage,prevPage,nextPage,page ,premium});  
                }
            }
        }catch (error) {
            console.log(error)
            res.send(error);
        }
    }
    postProduct=async (req,res,next) => {
        try {
            let { title, description, price, thumbnail, code, stock, category,brand,owner } = req.body;
            console.log(owner)
            if(!title||!description||!price||!code||!stock||!category){
                CustomError.createError({
                    name:"Error al registrar producto",
                    cause:productError({title,description,price,code,stock,category}),
                    message:"Error al registrar producto",
                    code:EError.INVALID_TYPES
                    
                })
            }
            const categorias =  await Product.schema.path('category').enumValues;
            if(!categorias.includes(category)){
                CustomError.createError({
                    name:"Error al registrar producto",
                    cause:`${category}, no es valido en nuestra lista de categorias`,
                    message:"error al registrar producto",
                    code:EError.INVALID_TYPES
                })
            }
            else{
                const producto={
                    title,
                    description,
                    price:parseInt(price),
                    thumbnail,
                    code,
                    stock:parseInt(stock),
                    category,
                    brand,
                    owner
                }
                const result=await productService.createProduct(producto)
                if(result.status){
                        return  res.status(409).send({ status: "error", message:result.message})
                }else{
                    res.status(200).send({ status: "success", payload: result,message:`Producto creado, id : ${result._id}` });
                }
            }
        } catch (error) {
            return next(error)
        }
    }
    deleteProduct=async (req, res) => {
        try {
            const { pid } = req.params;
            console.log(req.params)
            const result = await productService.deleteProduct(pid);
            if(!result){
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
    
            const product=await productService.getProduct(pid);
            if(!product){
                return res.status(401).send({status:"error",message:"No existe producto con ese id"})
            }else{
                const result= await productService.updateProduct(pid,key,value)
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
            const result=await nuevoChatManger.message(message,user)
            console.log(result)
            res.send(result)
        } catch (error) {
            res.send(error)
        }
    }
    updateCart=async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const results = await cartService.removeProduct(cid,pid);
            res.send(results);
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }
    admin=async(req,res)=>{
        try {
            const products=await productService.getProducts()
            res.render('adminMenu',{products:products.docs})
        } catch (error) {
            res.send(error)
        }
    }
    editPerfil=async(req,res)=>{
        try{
            const user=req.user
            res.render('editPerfil',{user:user})
        }catch (error) {
            res.send(error)
        }
    }
    resetPassword=async(req,res)=>{
        try{
            const {token}=req.params
            const email=decodePasswordToken(token);
            res.render('resetPassword',{email})
        }catch (error) {
            res.send(error)
        }
    }
}
module.exports=viewController