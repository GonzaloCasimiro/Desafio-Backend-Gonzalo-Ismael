const passport=require('passport')
const { authorization } = require("../middlewares/authorization.middleware");
const { passportCall } = require("../middlewares/passportCall.middelware");
const { createHash, isValid } = require("../utils");
const { generateToken, authToken } = require("../utils/jsonwebtoken");
const UserDaoMongo = require('../dao/MONGO/UserDao.mongo');
const { cartService, userService } = require('../service/service');
const newUserManager=new UserDaoMongo();

class SessionController{
    constructor(){}
    register=async(req,res)=>{
        let {name,lastname,password,email,role}=req.body
        if(!password ||!email||!name||!lastname)return res.status(401).send({status:'error',message:"Debe llenar todos los campos"})
        //usuario existe ?
        const validateEmail=await userService.getUser(email)
        if(validateEmail){  
            return res.status(401).send({status:'error',message:"Email ya registrado"})
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
    }
    login=async(req,res)=>{
        const {password,email}=req.body
        if(!password ||!email)return res.status(401).send({status:'error',message:"Debe llenar todos los campos"})
        const user=await userService.getUser(email)
        if(!user){
            res.status(401).send({status:'error',message:"Credenciales invalidas"})
        }else{
            if(!isValid(user,password))return res.status(401).send({status:'error',message:"Password incorrecto"})
            
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
