const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("BASE DE DATOS CONECTADA");
}

module.exports = connectDB;
