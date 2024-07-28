const mongoose = require("mongoose");
const mongoosePaginate =require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum:['samsung','motorola','apple','xiaomi','tcl'],
        required: true
    },
    thumbnail: {
        type: String,
        default: "#"
    },
    stock:{
        type:Number,
        required:true
    },
    mid:{
        type:String,
    },
    owner:{
        type:String,
        default:"admin"
    }
});
productSchema.plugin(mongoosePaginate)

const Product = mongoose.model('products', productSchema);

module.exports = Product;
