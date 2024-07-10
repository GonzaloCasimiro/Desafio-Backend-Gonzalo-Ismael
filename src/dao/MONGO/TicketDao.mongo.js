class TicketDaoMongo{
    constructor(model){
        this.model=model
    }
    async get (tid){
        return await this.model.findOne({_id:tid})
    }
    async delete(tid){
        return await this.model.findOneAndDelete({_id:tid})
    }
    async create(data){
        return await this.model.create(data)
    }
    async getAll(email,status){
        console.log(email,status)
        return await this.model.findOne({email:email,status:status})
    }
}
module.exports= TicketDaoMongo