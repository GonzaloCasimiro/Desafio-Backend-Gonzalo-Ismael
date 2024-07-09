class MongoDao {
    constructor(model){
        this.model=model
    }
    async get(filter){
        return await this.model.findOne(filter)
        
    }
    async delete(filter){
        return await this.model.findByIdAndDelete(filter)
    }
    async create(){
        return await this.model.create()
    }
    async update(){
        return await this.model.findAndUpdate(filter)
    }
}
module.exports = MongoDao