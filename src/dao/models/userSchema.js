const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true          
    },
    lastname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    cid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    },
    role:{
        type:String,
        default:'user'
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
