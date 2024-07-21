const passport=require('passport')
const { authorization } = require("../middlewares/authorization.middleware");
const { passportCall } = require("../middlewares/passportCall.middelware");
const { createHash, isValid } = require("../utils");
const { generateToken, authToken } = require("../utils/jsonwebtoken");
const UserDaoMongo = require('../dao/MONGO/UserDao.mongo');
const { cartService, userService } = require('../service/service');
const CustomError = require('../utils/errors/CustomError');
const { generateUserError } = require('../utils/errors/info');
const EError = require('../utils/errors/enum');
const newUserManager=new UserDaoMongo();
class SessionController{
    constructor(){}
    register=async(req,res,next)=>{
        try {
            let {name,lastname,password,email,role}=req.body
        if(!password ||!email||!name||!lastname){
    
            CustomError.createError({
                name:"Error al crear usuario",
                cause:generateUserError({name,lastname,password,email}),
                message:"Erro al crear usuario",
                code:EError.INVALID_TYPES
            })
        }
        const validateEmail=await userService.getUser(email)
        if(validateEmail){  
            CustomError.createError({
                name:"Error al crear usuario",
                cause:"Email ya registrado",
                message:"Error al crear usuario",
                code:EError.INVALID_TYPES
            })
        }else{
            const newCart = await cartService.createCart();
            const cid=newCart._id
            password=createHash(password)
            const newUser=await userService.createUser({name,lastname,password,email,cid,role})
            const token=generateToken({
                id:newUser._id,
                cid,
                role:newUser.role,
                email,
                name:newUser.name,
                lastname:newUser.lastname
            })
            return res.cookie('token',token,{
                maxAge:60*60*1000*24,
                httpOnly:true
            }).send({status:'succes',message:'usuario registrado',role:newUser.role})
        }
        } catch (error) {
            next(error)
        }
        
    }
    login=async(req,res,next)=>{
        try {
            let {password,email}=req.body
        if(!password ||!email){
            req.logger.warning(`No ingreso todos los datos- (Email , Contraseña)`)
            CustomError.createError({
                name:"Error al inciar sesion",
                cause:"Debes llenar todos los campos",
                message:"Error al iniciar sesion",
                code:EError.INVALID_TYPES
            })
            
        }//return res.status(401).send({status:'error',message:"Debe llenar todos los campos"})
        const user=await userService.getUser(email)
        if(!user){
            req.logger.warning('Ingreso un email no valido')
            CustomError.createError({
                name:"Error al iniciar sesion",
                cause:"Credenciales invalidas",
                message:"Error al inciar sesion",
                code:EError.INVALID_TYPES
            })
            //res.status(401).send({status:'error',message:"Credenciales invalidas"})
        }else{
            if(!isValid(user,password)){
                req.logger.warning('Ingreso email valido,password incorrecto')
                return res.status(401).send({status:'error',message:"Password incorrecto"})
            }
                req.logger.info(`Inicio sesion correctamente, usuario email : ${email}`)
            const token=generateToken({
                id:user._id,
                cid:user.cid,
                role:user.role,
                email,
                name:user.name,
                lastname:user.lastname
            })
            res.cookie('token',token,{
                maxAge:60*60*1000*24,
                httpOnly:true
            }).send({status:'succes',message:`Bienvenido ${user.name} ${user.lastname}`,role:user.role})
        }
        } catch (error) {
            req.logger.error(error)
            next(error)
        }
        
    }
    logout=(req,res)=>{
        if(req.session.user){
            req.session.destroy(err=>{
                if(!err)return res.redirect('/')
                else return res.send({status:"error",error:err})
            })
        }else{
            res.clearCookie("token").redirect("/")
        }
        
    }
    github=(passport.authenticate('github',{scope:'user:email'}),async(req,res)=>{

    })
    githubCallback=(passport.authenticate('github',{failureRedirect:'/login'}),(req,res)=>{
        req.session.user=req.user
        res.redirect('/')
    })
}
module.exports=SessionController
