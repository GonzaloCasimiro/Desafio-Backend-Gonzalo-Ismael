function auth(req,res,next){
    if(req.session?.user&&req.session?.user?.role==="admin"){
        return next()
    }else{
        return res.status(401).send("error de autorizacion")
    }
}
function isLog(req,res,next){
    if(!req.session.user){
        return next()
    }else if(req.cookies.user.role==="admin"){

        return res.redirect('/api/views/admin')
    }else{
        return res.redirect(`/api/views/products`)
    }
}

module.exports= {isLog,auth}