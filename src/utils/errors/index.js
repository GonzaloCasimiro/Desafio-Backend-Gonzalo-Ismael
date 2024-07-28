const EError = require("./enum");

const handleErrors=()=>(error,req,res,next)=>{
    switch(error.code){
        case EError.INVALID_TYPES:
            return res.send({status:'error',message:error.cause})
            break
        case EError.DATABASE_ERROR:
            return res.send({status:"error",message:error.cause})
            break
        case EError.NOT_ALLOWED_ERROR:
            return res.send({status:"error",message:error.cause})
            case 11000:
            return res.status(400).send({status:'error',message:"Code en uso"})
        default: 
            return res.send({status:'error',error:"error no identificado"})
    }
}
module.exports= handleErrors