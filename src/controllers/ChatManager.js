const Message = require("../dao/models/messageSchema.js")
const { Model, default: mongoose } = require("mongoose");

class messagesManager{
    constructor(){
    }
    async getAllMessages(cid){
        try {
            const messages=await Message.find();
            const formatedMessages=messages.map(message=>message.toObject())
            return formatedMessages
        } catch (error) {
            return error.code
        }
    }
    async newMessage(message,user){
        try {
            const newMessage={
                user:user,
                message:message
            }
            const result=Message.create(newMessage);
            const data={
                status:"succes",
                message:"Mensaje enviado con exito"
            }
            return data
        } catch (error) {
            return error
        }
    }

}



module.exports = messagesManager