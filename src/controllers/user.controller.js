const CartManager = require("./CartsManager");
const UserManager = require("./UserManager")
const newUserManager=new UserManager()
const cartManager = new CartManager();
class UserController{
    constructor(){}
    
    getUsers=async(req,res)=>{
        try {
            const result=await newUserManager.getUsers();
            res.send(result)
        } catch (error) {
            res.send(error)
        }
    }
    getUser=async(req,res)=>{
        try {
            const {email}=req.body
            const result=await newUserManager.getUser(email)
            if(!result){
                res.status(401).send({status:"error",message:`${email} no se encuentra registrado`})
            }else{
                res.send(result)
            }   
        } catch (error) {
            
        }
    }
    createUser=async(req,res)=>{
        try {
            const {name,lastname,password,email}=req.body;
            if(!name||!lastname||!password||!email){
                res.send('Debes llenar todos los campos');
            }else{
                const validateEmail= await newUserManager.validateEmail(email);
                if(validateEmail){
                    res.send('Ese Email ya ha sido registrado');
                }else{
                    const newCart = await cartManager.createCart();
                    const cid=newCart._id
                    const newUser=await newUserManager.newUser(name,lastname,password,email,cid)
                    console.log(newUser)
                    res.send(newUser)
                }
            }
        } catch (error) {
            res.send(error)
        }
    }
    updateUser=async(req,res)=>{
        try {
            const {key,value,email}=req.body;
            const result=await newUserManager.updateUser(key,value,email)
            const {modifiedCount,matchedCount}=result
            if(matchedCount ===0) return res.status(401).send({status:"error",message:"Email incorrecto"});
            if(modifiedCount ===0) return res.status(403).send({status:"error",message:"Error al Actualizar,contacta un administrador"});
            if(modifiedCount!==0) return res.send({status:"succes",message:`${key} ha sido actualizado`})    
        } catch (error) {
            res.status(500).send({status:"error",message:error.message})
        }
    }
    deleteUser=async(req,res)=>{
        try {
            const {password,email}=req.body
            const user=await newUserManager.getUser(email);
            if(!user) return res.status(401).send({status:"error",message:"Email incorrecto"})
            if(isValid(user,password)){
                const del=await newUserManager.deleteUser(email);
                res.send({status:'succes',message:"usuario eliminado"})
            }else{
                res.status(403).send({status:"error",message:"credenciales incorrectas"})
            }    
        } catch (error) {
            res.status(500).send({status:"error",message:error.message})
        }
    }
}
module.exports= UserController