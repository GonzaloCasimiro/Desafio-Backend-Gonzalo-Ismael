const {Router}= require("express")
const userRouter=Router();
const SessionController = require("../../controllers/user.controller.js");
const { authorization } = require("../../middlewares/authorization.middleware.js");
const { passportCall } = require("../../middlewares/passportCall.middelware.js");
const {deleteUser,updateUser,createUser,getUser,getUsers}=new SessionController()

userRouter.get("/getUsers",passportCall("jwt"), authorization('admin'),getUsers)
userRouter.post("/getUser",getUser)
userRouter.post('/updateUser',updateUser)
userRouter.post('/createUser',createUser)
userRouter.post('/deleteUser' ,deleteUser)

module.exports= userRouter
