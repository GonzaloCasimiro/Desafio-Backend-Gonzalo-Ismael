const {Router} =require("express");
const auth = require("../middlewares/auth.middleware");
const sessionRouter=Router();
//session => login-register-logout

sessionRouter.post('/login',(req,res)=>{
    const {email,password}=req.body
    if(email!=="fede@gmail.com"|| password !=="mipassword"){
        res.send('login failed')
    }else{
        req.session.user={
            email,
            admin:true
        }
        console.log(req.session.user)
        res.send(req.session.user)
    }
})
//logout
sessionRouter.get("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(!err)return res.send('logout')
        else return res.send({status:"error",error:err})
    })
})
//ESTE ENDPOINT SOLO LO PUEDE VER UN ADMINISTRADOR
sessionRouter.get("/current",auth,(req,res)=>{
    res.send("datos solo para admins")
})

module.exports =sessionRouter