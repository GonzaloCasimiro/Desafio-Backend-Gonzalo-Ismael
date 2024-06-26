const  User  = require("../dao/models/userSchema.js");
const { Model, default: mongoose } = require("mongoose");

class UserManager{
    constructor(){

    }
    async getUsers(){
        try {
            //const users=await User.find({first_name:"Celia"}).explain("executionStats") //=> filta por celia y muestra los stats de cuanto tiempo tarda
            const users=await User.find()
            return users
        } catch (error) {
            return error.message
        }
        
    }
    async getUser(email){
        const user=await User.findOne({email:email})
        return user
    }
    async validateUser(email,password){
        const validate=await User.findOne({email,password});
        return validate
    }
    async validateEmail(email){
        const validate=await User.findOne({email:email})
        return validate
    }
    async newUser(name,lastname,password,email,cid,role){
        const user={
            name,
            lastname,
            password,
            email,
            cid,
            role
        }
        const newUser=await User.create(user)
        return newUser
    }
    async updateUser(key,value,email){
        const result=await User.updateOne({email:email},{[key]:value})
        return result
    }
    async deleteUser(email){
        const result=await User.deleteOne({email:email})
        return result 
    }
}

module.exports = UserManager