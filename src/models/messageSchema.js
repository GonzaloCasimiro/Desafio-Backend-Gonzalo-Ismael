
const mongoose = require("mongoose");
const {Schema}=require('mongoose')
        //A
const messagesSchema =new Schema({
    messages: [{
      message: { type: String, required: true },
      user: { type: String, required: true }
    }]
  });                       //"B"            "A"
const Message= mongoose.model('messages', messagesSchema);

module.exports = Message;


// B es el nombre de la coleccion en la base de datos
