const {Router}= require("express")
const UserManager=require("../controllers/UserManager.js");
const newUserManager=new UserManager();
const userRouter=Router();

userRouter.get("/",async(req,res)=>{
    try {
        const result=await newUserManager.getUsers();
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

module.exports= userRouter