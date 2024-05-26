/*
const passport = require('passport')
const local = require('passport-local')
const UserManager = require('../controllers/UserManager.js')
const isValidPassword = require('../utils/bcrypt')
const createHash = require('../utils/bcrypt')
const { init } = require('../dao/models/userSchema')

const newUserManager=new UserManager()

const LocalStrategy=local.Strategy
const initPassport=()=>{
    passport.use('register',new LocalStrategy({
        passReqToCallback:true,// req => body => passport => accede a obj request
        usernameField:'email'
    },async(req,username,password,done)=>{
        const{name,lastname}=req.body
        try {
            //verificar si existe el usuario
            let userFound=await userService.getUserBy({email:username})
            if(userFound){
                console.log('el usuario ya existe')
                return done(null,false)
            }
            let newUser={
                name,
                lastname,
                email,
                password:createHash(password)
            }
            let result=await newUserManager.createUser(newUser)
            return done(null,result)
        } catch (error) {
            return done('error al registrar el usuario'+error)
        }
    }))
    passport.use('login',new LocalStrategy({
        usernameField:'email'
    },async(email,password=>{
        try {
            const user =await newUserManager.validateEmail(email)
            if(!user){
                console.log('email no resgitrado');
                return done(null,false)
            }
            const validate=await newUserManager.validateUser(email,password)
            if(validate) return done(null,validate)
        } catch (error) {
            return done('error al ingresar'+error)
        }
    }))
    passport.serializeUser()
    passport.deserialaizeUser()
}
module.exports =initPassport

*/