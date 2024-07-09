const Message = require("../../models/messageSchema.js")
const { Model, default: mongoose } = require("mongoose");

class MessagesDaoMongo{
    constructor(model){
        this.model=model
    }
    async create(){
        try {
            return await this.model.create({messages:[]});
        } catch (error) {
            return {status:"error",message:error}
        }
        
    }
    async get(mid){
       const message=this.model.findOne({_id:mid})
        return message
    }
    async message(data){
        return this.model.findOneAndUpdate({_id:data.mid},{$push:{messages:{user:data.user,message:data.message}}})
    }

}



module.exports = MessagesDaoMongo