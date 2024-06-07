const passport=require('passport')

exports.passportCall=strategy=>{
    return (req,res,next)=>{
        passport.authenticate(strategy,(err,{user},info)=>{
            if(err)return next(err)
           // if(!user)return res.status(401).send({status:'error',message:info.message? info.message:info.toString()})
            req.user=user
            next()
        })(req,res,next)
    }
}
/*
exports.passportCall=strategy=>{
    return (req,res,next)=>{
        passport.authenticate(strategy,(err,{user},info)=>{
            if(err)return next(err)
            if(!user) next()
            req.user=user
            next()
        })(req,res,next)
    }
}*/