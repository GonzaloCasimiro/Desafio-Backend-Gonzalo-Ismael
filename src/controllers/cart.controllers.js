
const {default:mongoose}=require('mongoose');
const { cartService, productService, ticketService } = require("../service/service.js");

class CartController{
    constructor(){}
    addProduct=async (req, res) => {
        try {
            if(req.session)req.user=req.session.user
            if(req.user.role==="admin")return res.status(403).send({status:"error",message:"Un administrador no puede cargar productos"})
            const { cid, pid } = req.params;
            //const stock=await productService.getStock(pid);
            
                const result=await cartService.addProduct(cid,pid);
                if(!result){
                    return res.status(401).send({status:'error',message:'error al agregar producto al carrito'})           
                }else{
                    let productID=new mongoose.Types.ObjectId(pid);
                    console.log(productID)
                    let product=result.products.find(product=>product._id.equals(productID));
                    let quantity=product.quantity;
                    let productData=await productService.getProduct(pid);
                    let producto={
                        quantity,
                        thumbnail:productData.thumbnail,
                        title:productData.title,
                        price:productData.price,
                        id:pid
                    }
                    console.log(producto)
                    return res.send({status:"succes",message:"producto agregado al cart",producto})
                }
        } catch (error) {
            res.status(500).send({status:'error',message:error.message});
        }
    }
    removeProduct=async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const result = await cartService.removeProduct(cid,pid);
            res.send({status:'succes',message:"Producto eliminado con exito",pid});
        } catch (error) {
            res.send(error);
        }
    }
    getCart= async (req, res) => {
        try {
            const { cid } = req.params;
            const filter={_id:cid}
            //let cart = await cartManager.getCart(cid);
            let cart=await cartService.getCart(filter)
            if(cart){
                    
                for(let i=0;i<cart.products.length;i++){
                    const item=cart.products[i];
                    const productData=await productService.getProduct(item._id)
                    //const productData=await Product.findById(item._id);
                    console.log(productData, i)
                    if(productData){
                        cart.products[i].product=productData
                    }
                }
                cart= cart.toJSON()
                return res.send(cart)
            }else{
                return res.status(401).send({status:"error",message:"no exist cart con ese id"})
            } 
            //res.send(results)
            //res.render("cart",{products:results.products,cartId:results._id});
        } catch (error) {
            res.send(error);
        }
    }
    updateCart=async(req,res)=>{
        try {
            const {quantity}=req.body
            const{cid,pid}=req.params;
            //console.log(quantity,cid,pid)
            const result=await cartService.updateCart(cid,pid,parseInt(quantity))
            if(!result){
                return res.status(401).send({message:"error al actualizar el carrito",status:"error"})
            }else{
                let productID=new mongoose.Types.ObjectId(pid);
                    let product=result.products.find(product=>product._id.equals(productID));
                    let quantity=product.quantity;
                    let productData=await productService.getProduct(pid);
                    let producto={
                        quantity,
                        thumbnail:productData.thumbnail,
                        title:productData.title,
                        price:productData.price,
                        id:pid
                    }
                return res.send({status:"succes",message:"Se ha cambiado la cantidad del producto",pid:pid,quantity:producto.quantity})
            }
        } catch (error) {
            res.send(error)
        }
    }
    cleanCart=async(req,res)=>{
        try {
            const {cid}=req.params;
            const result=await cartService.clearCart(cid)
            //const result=await cartManager.clear(cid)
            if(!result){
                return res.status(401).send({status:"error",message:"Error al vaciar el carrito"})
            }else{
                return res.send({status:"succes",message:"Se ha vaciado el carrito",result})
            }
        } catch (error) {
            res.status(501).send({status:"error",message:error.message})
        }
    }
    deleteCart=async (req,res)=>{
        try {
            let {cid}=req.params;
            const result = await cartService.deleteCart(cid)
            res.send(result)
        } catch (error) {
           res.send(error)
        }
    }    
    createCart=async (req, res) => {
        try {
            let filter={products:[]}
            const results=await cartService.createCart(filter)
            //const results = await cartManager.createCart();
            res.send(results);
        } catch (error) {
            res.send(error);
        }
    }
    createTicket=async(req,res)=>{
        try {
            if(req.session) req.user=req.session.user
            const{name,lastname,email,adress,city}=req.body
            const{cid}=req.user
            let cart=await cartService.getCart(cid)
            let inStock=[]
            let outStock=[]
            let total=0
            for(let i=0;i<cart.products.length;i++){
                const item=cart.products[i];
                const quantity=cart.products[i].quantity
                const getStock=await productService.getStock(item._id,quantity)
                let productData=await productService.getProduct(item._id)
                if(getStock){
                    inStock.push({quantity:quantity,product:productData.title,pid:productData._id.toJSON()})
                    total=total+productData.price
                }else{
                    outStock.push({quantity:quantity,product:productData.toJSON()})
                }
            }
            if(inStock.length>0){
                const ticket = await ticketService.createTicket({name,lastname,city,adress,amount:total,products:inStock,email})
                console.log(ticket,"ticket")
                if(ticket){
                for(let i=0;i<inStock.length;i++){
                    console.log(inStock[i].pid)
                    console.log(inStock[i].quantity)
                    await cartService.updateCart(cid,inStock[i].pid,inStock[i].quantity*-1)
                }
            }
            }
            
            res.send({status:"succes",message:`Ticket creado y enviado al email ${email}`})
        } catch (error) {
            console.error(error)
            res.send(error)
        }
    }    
}

module.exports=CartController