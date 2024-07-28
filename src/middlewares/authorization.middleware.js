exports.authorization= role =>{
    return async(req,res,next)=>{
        if(req.session.user)req.user=req.session.user
        if(!req.user){
            return res.status(401).send({status:'error',error:'Unauthorized'})
        }
        
        if(req.user.role!==role)return res.status(403).send({status:'error',error:'not premissions'})
        next()
    }
}
exports.productAuth= ()=>{
    return async(req,res,next)=>{
    if(req.session.user)req.user=req.session.user
    if(!req.user){
        return res.status(401).send({status:'error',error:'Unauthorized'})
    }
    let role=req.user.role
    if(role!=="admin"&&role!=="premium")return res.status(403).send({status:'error',error:'solo para admins o usuarios premium'})
     next()
    }
   
}
exports.purchaseAuth=()=>{
    return async(req,res,next)=>{
        if(req.session.user)req.user=req.session.user
        if(!req.user){
            return res.status(401).send({status:'error',error:'Unauthorized'})
        }
        let role=req.user.role
        if(role!=="premium"&&role!=="user")return res.status(403).send({status:'error',error:'Solo para usuarios premium'})
        next()
    }
}