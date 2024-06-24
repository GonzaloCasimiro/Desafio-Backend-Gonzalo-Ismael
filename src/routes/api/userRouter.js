const {Router}= require("express")
const userRouter=Router();
const SessionController = require("../../controllers/user.controller.js");
const {deleteUser,updateUser,createUser,getUser,getUsers}=new SessionController()

userRouter.get("/getUsers",getUsers)
userRouter.post("/getUser",getUser)
userRouter.post('/updateUser',updateUser)
userRouter.post('/createUser',createUser)
userRouter.post('/deleteUser' ,deleteUser)

module.exports= userRouter