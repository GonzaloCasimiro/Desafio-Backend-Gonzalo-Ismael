const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true          
    },
    lastname:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    cid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    },
    role:{
        type:String,
        default:'user',
        enum:["user","admin"]
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
