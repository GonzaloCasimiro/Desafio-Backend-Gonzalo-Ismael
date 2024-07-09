const {Router}=require('express');
const MessagesDaoMongo = require('../../dao/MONGO/ChatDao.mongo');
const Message = require('../../models/messageSchema');
const { passportCall } = require('../../middlewares/passportCall.middelware');
const messageManager=new MessagesDaoMongo(Message)
const commentRouter=Router()

commentRouter.post("/",passportCall("jwt"), async(req,res)=>{
    try {
        if(!req.user){
            return res.status(403).send({status:"error",message:"Debes Iniciar para comentar"})
        }
        if(req.user.role==="admin"){
            return res.status(403).send({status:"error",message:"Solo apto para usuarios"})
        }

        const {mid,user,message}=req.body;
        const result=await messageManager.message({mid,user,message})
        if(result){
            return res.status(200).send({status:"success",message:"Comentario enviado"})
        }
        return res.status(401).send({status:"error",message:"credenciales invalidas"})
    } catch (error) {
        res.send(error)
    }
})
module.exports=commentRouter