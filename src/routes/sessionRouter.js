const {Router} =require("express");
const {auth} = require("../middlewares/auth.middleware");
const UserManager=require("../controllers/UserManager.js");
const newUserManager=new UserManager();
const sessionRouter=Router();
const CartManager = require("../controllers/CartsManager.js");
const cartManager = new CartManager("carts.json");
//session => login-register-logout
sessionRouter.get('/login',(req,res)=>{
    const {email,password}=req.body
    res.render('login')
})
sessionRouter.get('/register',(req,res)=>{
    res.render('register')
})
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
                const newUser=await newUserManager.newUser(name,lastname,password,email,cid,role)
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
        const validate=await newUserManager.validateUser(email,password);
        if(!validate) {
            const data={
                status:'error',
                message:'Credenciales incorrectas'
            }
            console.log('B')
            res.send(data)
        }else{
            req.session.user={
                email,
                cid:validate.cid,
                uid:validate._id,
                name:validate.name,
                lastname:validate.lastname,
                role:validate.role
            }
            const data={
                status:'succes',
                message:`Bienvenido/a ${validate.name} ${validate.lastname}`,
                uid:validate._id,
                role:validate.role
            }
            console.log("C")
            res.send(data)
        }
    }   
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