const passport = require('passport')
const { PRIVATE_KEY } = require('../config/config')
const local = require('passport-local')
const UserManager = require('../controllers/UserManager')
const { createHash, isValid } = require('../utils')
const CartManager = require('../controllers/CartsManager')
const cartManager=new CartManager()
const LocalStrategy= local.Strategy
const userManager=new UserManager()
const GithubStrategy = require('passport-github2')
const jwt=require('passport-jwt')
const JWTStrategy=jwt.Strategy
const ExtractJWT=jwt.ExtractJwt
const initializePassport =()=>{
    //jwt
    const cookieExtractor=req=>{
        let token=null
        if(req&&req.cookies){
            token=req.cookies['token']
        }
        return token
    }
    passport.use('jwt',new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:PRIVATE_KEY
    },async(jwt_payload, done)=>{
        try {
           return done(null,jwt_payload) 
        } catch (error) {
            return done(error)
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    }) // guarda el id en session
    passport.deserializeUser(async(id,done)=>{
        try {
            let user=await userManager.getUser(id)
            done(null,user)
        } catch (error) {
            done(error)
        }
    })
    passport.use('github',new GithubStrategy({
        clientID:'Ov23liP4TlAmI1gV8uED',
        clientSecret:'4719b7a9e3a27f7fd8acbf70ae9987bc6fda9c39',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    },async(accesToken,refreshToken,profile,done)=>{
        try {
            const email=profile._json.email
            const user=await userManager.getUser(email)
            if(!user){
                const role="user"
                const name=profile._json.name
                const lastname=""
                const password=''
                const cart=await cartManager.createCart()
                const cid=cart._id;
                const result=await userManager.newUser(name,lastname,password,email,cid,role)
                done(null,result)
            }else{
                done(null,user)
            }
        } catch (error) {
            return done(error)
        }
    }))

}
/*
const initializePassport=()=>{
    passport.use('register',new LocalStrategy({
        passReqToCallback:true, // LINEA PARA PODER OBTENER LOS DATOS DEL BODY
        usernameField:'email'//SETEAR A EMAIL
    },async(req,username,password,done)=>{
        const {name,lastname,role}=req.body
        try {
            let user=await userManager.getUser(username)
            if(user){
                console.log('el usuario ya existe')
                const data={status:'error',message:"el usuario ya existe"}
                return done(null,false,data)
            }
            //crear usuario
            const email=username;
            const hashPassword=createHash(password)
            const cart=await cartManager.createCart()
            const cid=cart._id;
            const result=await userManager.newUser(name,lastname,hashPassword,email,cid,role)
            return done(null,result)
        } catch (error) {
            return done('error al registrar el usuario'+error)
        }
    }))
    passport.use('login',new LocalStrategy({
        usernameField:'email',

    },async(username,password,done)=>{
        try {
            const user=await userManager.getUser(username)
            if(!user){
                console.log(username)
                return done(null,false)    // ESTO DEBERIA IR AL POST('/FAILLOGIN')
            }
            if(!isValid(user,password)){  
               return done(null,false)     //// ESTO DEBERIA IR AL POST('/FAILLOGIN')
            }
            return done(null,user)        // ESTO DEBERIA IR AL POST('/LOGIN')
        } catch (error) {
            return done('error al iniciar usuario'+error) // ESTO DEBERIA IR AL POST('/FAILLOGIN')
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    }) // guarda el id en session
    passport.deserializeUser(async(id,done)=>{
        try {
            let user=await userManager.getUserById(id)
            done(null,user)
        } catch (error) {
            done(error)
        }
    })// extrae el usuario del session
    passport.use('github',new GithubStrategy({
        clientID:'Ov23liP4TlAmI1gV8uED',
        clientSecret:'4719b7a9e3a27f7fd8acbf70ae9987bc6fda9c39',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    },async(accesToken,refreshToken,profile,done)=>{
        try {
            console.log(profile,"A profile")
            const email=profile._json.email
            const user=await userManager.getUser(email)
            if(!user){
                const role="user"
                const name=profile._json.name
                const lastname=profile._json.name;
                const password=''
                const cart=await cartManager.createCart()
                const cid=cart._id;
                const result=await userManager.newUser(name,lastname,password,email,cid,role)
                done(null,result)
            }else{
                done(null,user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}
    */
module.exports={initializePassport}