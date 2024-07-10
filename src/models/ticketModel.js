const { default: mongoose } = require("mongoose");

const ticketSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,        
    },
    lastname:{
        type:String,
    },
    city:{
        type:String,
    },
    adress:{
        type:String,
    },
    amount:{
        type:Number,
        required:true
    },
    products:[{
        product:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        pid:{
            type:String,
            required:true
        }
    }],
    email:{
        type:String,
    },
    status:{
        type:String,
        default:"on process",
        enum:["on process","paid"]
    }
},{timestamps:true,
    toJSON: {
    transform: (doc, ret) => {
        ret.createdAt = formatDate(ret.createdAt);
        ret.updatedAt = formatDate(ret.updatedAt);
        return ret;
    }
}});
const Ticket=mongoose.model('ticket',ticketSchema)


module.exports = Ticket
