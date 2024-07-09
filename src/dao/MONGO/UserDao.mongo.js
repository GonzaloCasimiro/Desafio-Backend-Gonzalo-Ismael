const  User  = require("../../models/userSchema.js");
const { Model, default: mongoose } = require("mongoose");

class UserDaoMongo{
    constructor(model){
        this.model=model
    }
    async getAll(){
            //const users=await User.find({first_name:"Celia"}).explain("executionStats") //=> filta por celia y muestra los stats de cuanto tiempo tarda
            const users=await this.model.find()
            return users      
    }
    async get(email){
        const user=await this.model.findOne({email:email})
        return user
    }
    async validateUser(email,password){
        const validate=await this.model.findOne({email,password});
        return validate
    }
    async validateEmail(email){
        const validate=await this.model.findOne({email:email})
        return validate
    }
    async create(data){
        console.log(data)
        const newUser=await this.model.create(data)
        console.log(newUser)
        return newUser
    }
    async update({key,value,email}={}){
        const result=await this.model.updateOne({email:email},{[key]:value})
        return result
    }
    async delete(email){
        const result=await this.model.deleteOne({email:email})
        return result 
    }
}

module.exports = UserDaoMongo