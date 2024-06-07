const jwt = require('jsonwebtoken')
const PRIVATE_KEY='c0d3rk3ys3cr3tt0k3n'


const generateToken= user=> jwt.sign({user},PRIVATE_KEY,{expiresIn:'24h'})
// Bearer       asñlkdaksdkasdjskksksksadksadk
// validar que venga por header (header-cookie)
const authToken=(req,res,next)=>{
    const authHeader=req.headers.authorization
    console.log(authHeader)
    if(!authHeader)return res.status(401).send({status:'error',message:"Not authenticated"})
    const token=authHeader.split(' ')[1]
    jwt.verify(token,PRIVATE_KEY,(error,credential)=>{
        if(error)res.status(401).send({status:'error',message:"Not authorized"})
        req.user=credential.user
        next()
        })
}
module.exports={generateToken,authToken,PRIVATE_KEY}