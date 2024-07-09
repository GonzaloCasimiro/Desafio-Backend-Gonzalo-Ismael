const Product = require("../models/productSchema")

function editProductMid(req,res,next){
    const {pid,key,value}=req.body
    if(key==="category"){
     const enumCategory=Product.schema.path('category').enumValues;
     if(!enumCategory.includes(value))return res.status(401).send({status:"error",message:`${value} no es valido`})
    }
   if(key==="price" && isNaN(parseInt(value))){
        return res.status(401).send({status:"error",message:"Debes ingresar un precio (número)"})
   }else if(key!=="price" && !isNaN(parseInt(value))){
        return res.status(401).send({status:"error",message:"No puedes ingresar solo números"})
   }else{
    return next()
   }
}
module.exports=editProductMid