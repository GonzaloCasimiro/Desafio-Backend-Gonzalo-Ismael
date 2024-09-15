const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true          
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    cid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    },
    role:{
        type:String,
        default:'user',
        enum:["user","admin","premium"]
    },
    lastConnection:{
        type:String,
        required:true
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
