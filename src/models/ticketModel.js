const { default: mongoose } = require("mongoose");

const ticketSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true          
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
        default:"on process"
    }
});
const Ticket=mongoose.model('ticket',ticketSchema)


module.exports = Ticket
