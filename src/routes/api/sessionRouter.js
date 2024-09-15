const {Router} =require("express");
const sessionRouter=Router();
const passport = require("passport");
const { passportCall } = require("../../middlewares/passportCall.middelware.js");
const { authorization } = require("../../middlewares/authorization.middleware.js");
const SessionController = require("../../controllers/session.controller.js");
const {register,login,logout,forgotPassword,resetPassword}=new SessionController()
//session => login-register-logout
sessionRouter.get('/login',(req,res)=>{
    res.render('login')
})
sessionRouter.get('/register',(req,res)=>{
    res.render('register')
})
sessionRouter.post('/register',register)
sessionRouter.post('/login',login)

//localhost:8080/api/sessions/github
sessionRouter.get('/github',passport.authenticate('github',{scope:'user:email'}),async(req,res)=>{

})
sessionRouter.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),(req,res)=>{
    req.session.user=req.user
    res.redirect('/')
})

sessionRouter.get("/logout",logout)
//ESTE ENDPOINT SOLO LO PUEDE VER UN ADMINISTRADOR
sessionRouter.get("/current",passportCall('jwt'),authorization('admin'),(req,res)=>{
    res.send("datos solo para admins")
})
sessionRouter.post('/forgot-password',forgotPassword)
sessionRouter.post('/reset-password',resetPassword)
module.exports =sessionRouter


