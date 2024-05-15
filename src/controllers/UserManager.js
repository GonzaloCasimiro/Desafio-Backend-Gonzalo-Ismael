const  User  = require("../dao/models/productSchema.js");
const { Model, default: mongoose } = require("mongoose");

class UserManager{
    constructor(){

    }
    async getUsers(){
        try {
            const users=await User.find({first_name:"Celia"}).explain("executionStats") //=> filta por celia y muestra los stats de cuanto tiempo tarda
            console.log(users)
            return users
        } catch (error) {
            return error.message
        }
        
    }
}

module.exports = UserManager