const {Router}= require("express")
const UserManager=require("../controllers/UserManager.js");
const newUserManager=new UserManager();
const userRouter=Router();
const CartManager = require("../controllers/CartsManager.js");
const cartManager = new CartManager("carts.json");
userRouter.get("/",async(req,res)=>{
    try {
        const result=await newUserManager.getUsers();
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})
userRouter.post('/createUser',async(req,res)=>{
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
})
userRouter.get('/login',async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            res.send('Debes llenar todos los campos');
        }else{
            const validate=await newUserManager.validateUser(email,password);
            if(!validate) {
                res.send('Credenciales incorrectas');
            }else{
                res.send(validate)
            }
        }   
        
    } catch (error) {
        res.send(error)
    }
})
module.exports= userRouter