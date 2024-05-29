const {Router} =require("express");
const {auth} = require("../middlewares/auth.middleware");
const UserManager=require("../controllers/UserManager.js");
const newUserManager=new UserManager();
const sessionRouter=Router();
const CartManager = require("../controllers/CartsManager.js");
const { createHash, isValid } = require("../utils.js");
const { initializePassport } = require("../config/passport.config.js");
const passport = require("passport");
const cartManager = new CartManager("carts.json");

//session => login-register-logout
sessionRouter.get('/login',(req,res)=>{
    const {email,password}=req.body
    res.render('login')
})
sessionRouter.get('/register',(req,res)=>{
    res.render('register')
})
//sessionRouter.post('/register',passport)
/*
sessionRouter.post('/register',async(req,res)=>{
    try {
        const {name,lastname,password,email,role}=req.body;
        if(!name||!lastname||!password||!email){
            const data={
                status:'error',
                message:'Debes llenar todos los campos'
            }
            res.send('Debes llenar todos los campos');
        }else{
            const validateEmail= await newUserManager.validateEmail(email);
            if(validateEmail){
                const data={
                    status:'error',
                    message:'Ya existe una cuenta registrada con ese email'
                }
                res.send(data);
            }else{
                const newCart = await cartManager.createCart();
                const cid=newCart._id
                const hashPassword=createHash(password)
                const newUser=await newUserManager.newUser(name,lastname,hashPassword,email,cid,role)
                const data={
                    status:'succes',
                    payload:newUser,
                    message:`Tu cuenta ha sido creada en el email: ${email} ,ya puedes iniciar sesion en ella`
                }
                res.send(data)
            }
        }
    } catch (error) {
        res.send(error)
    }
    
})
sessionRouter.post('/login',async (req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        const data={
            status:'error',
            message:'Debes llenar todos los campos'
        }
        console.log("A")
        res.send(data);
    }else{
        const user=await newUserManager.getUser(email)
        if(!user) {
            const data={
                status:'error',
                message:'Credenciales incorrectas'
            }
            res.send(data)
        }else{
            console.log(user)
            const validate=isValid(user,password)
            if(validate===true){
                req.session.user={
                email,
                cid:user.cid,
                uid:user._id,
                name:user.name,
                lastname:user.lastname,
                role:user.role
                }
                const data={
                status:'succes',
                message:`Bienvenido/a ${user.name} ${user.lastname}`,
                uid:user._id,
                role:user.role
                }
                res.send(data)
            }else{
                const data={
                    status:'error',
                    message:'Credenciales incorrectas'
                }
                res.send(data)
            }
            
            
        }
    }   
})
*/
//RUTAS CON PASSPORT
sessionRouter.post('/register',passport.authenticate('register',{failureRedirect:'/failRegister'}) ,async(req,res)=>{
    res.send({status:'succes',message:'usuario registrado exitosamente'})
})
sessionRouter.post('/failRegister',(req,res)=>{
    console.log('fallo la estrategia de registro')
    res.send({error:'failed'})
})
sessionRouter.post('/login',passport.authenticate('login',{failureRedirect:'/failLogin'}),async(req,res)=>{
    console.log("A")
    if(!req.user){
        return res.status(400).send({status:'error',message:'credecnciales invalidas'})
    }else{
        req.session.user={
            name:req.user.name,
            lastname:req.user.lastname,
            email:req.user.email,
            role:req.user.role,
            cid:req.user.cid,
            uid:req.user._id
        }
        console.log(req.session.user)
        console.log("B")
        res.send({
            status:'succes',
            message:`Bienvenido/a ${req.user.name} ${req.user.lastname}`,
            uid:req.user._id,
            role:req.user.role
            })
    }
})
sessionRouter.post('/failLogin',(req,res)=>{
    res.send({error:'fallo el login'})
})
//localhost:8080/api/sessions/github
sessionRouter.get('/github',passport.authenticate('github',{scope:'user:email'}),async(req,res)=>{

})
sessionRouter.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),(req,res)=>{
    req.session.user=req.user
    res.redirect('/')
})

//logout
sessionRouter.get("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(!err)return res.redirect('/')
        else return res.send({status:"error",error:err})
    })
})
//ESTE ENDPOINT SOLO LO PUEDE VER UN ADMINISTRADOR
sessionRouter.get("/current",auth,(req,res)=>{
    res.send("datos solo para admins")
})

module.exports =sessionRouter