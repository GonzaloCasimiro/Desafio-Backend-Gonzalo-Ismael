const mongoose = require("mongoose");
/*
const connectDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("BASE DE DATOS CONECTADA");
}*/



const connectDB = () => {
    const uri = 'mongodb+srv://gonzaloismael:123gonza@cluster0.udpj4jc.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
    
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("BASE DE DATOS CONECTADA");
        })
        .catch(err => {
            console.error("ERROR AL CONECTAR LA BASE DE DATOS", err);
        });
}



module.exports = connectDB;
