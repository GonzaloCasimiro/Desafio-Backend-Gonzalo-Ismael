const {Router}= require("express")
const userRouter=Router();
const SessionController = require("../../controllers/user.controller.js");
const { authorization } = require("../../middlewares/authorization.middleware.js");
const { passportCall } = require("../../middlewares/passportCall.middelware.js");
const {deleteUser,updateUser,createUser,getUser,getUsers,buttonPremium,deleteUsers}=new SessionController()

userRouter.get("/",passportCall("jwt"), authorization('admin'),getUsers)
userRouter.post("/getUser",passportCall('jwt'),authorization('admin'),getUser)
userRouter.delete('/deleteusers',deleteUsers)
userRouter.post('/updateUser',updateUser)
userRouter.post('/createUser',createUser)
userRouter.post('/deleteUser' ,deleteUser)
userRouter.get('/premium/:uid',passportCall("jwt"),buttonPremium)

module.exports= userRouter
