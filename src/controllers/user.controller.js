const CartDaoMongo = require("../dao/MONGO/CartDao.mongo");
const UserDaoMongo = require("../dao/MONGO/UserDao.mongo");
const { cartService, userService } = require("../service/service");
const CustomError = require("../utils/errors/CustomError");
const { createError } = require("../utils/errors/CustomError");
const EError = require("../utils/errors/enum");
const { generateUserError } = require("../utils/errors/info");
UserDaoMongo
CartDaoMongo

class UserController{
    constructor(){}
    
    getUsers=async(req,res)=>{
        try {
            const result=await userService.getUsers();
            res.send(result)
        } catch (error) {
            res.send(error)
        }
    }
    getUser=async(req,res)=>{
        try {
            const {email}=req.body
            const result=await userService.getUser(email)
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
                const validateEmail= await userService.getUser(email);
                if(validateEmail){
                    res.send('Ese Email ya ha sido registrado');
                }else{
                    const newCart = await cartService.createCart();
                    const cid=newCart._id
                    const newUser=await userService.createUser({name,lastname,password,email,cid})
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
            const result=await userService.updateUser({key,value,email})
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
            const user=await userService.getUser(email);
            if(!user) return res.status(401).send({status:"error",message:"Email incorrecto"})
            if(isValid(user,password)){
                const del=await userService.deleteUser(email);
                res.send({status:'succes',message:"usuario eliminado"})
            }else{
                res.status(403).send({status:"error",message:"credenciales incorrectas"})
            }    
        } catch (error) {
            res.status(500).send({status:"error",message:error.message})
        }
    }
    buttonPremium=async(req,res,next)=>{

        try {
            const {uid}=req.params
            if(req.session.user)req.user=req.session.user;
            const user=req.user;
            if(user.role!=="premium"){
                CustomError.createError({
                    name:"Error al activar premium",
                    cause:"No eres usuario premium",
                    message:"Error al activar premium",
                    code:EError.NOT_ALLOWED_ERROR
                })
            }else{
                return res.send({status:'success',message:"exito"})
            }
        }catch(error){
            console.error(error)
            next(error)
        }
    }
}
module.exports= UserController