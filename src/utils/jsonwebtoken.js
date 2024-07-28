const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/config')
//const PRIVATE_KEY='c0d3rk3ys3cr3tt0k3n'

const generatePasswordToken=email=>jwt.sign({email:email},PRIVATE_KEY,{expiresIn:'1h'})
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
const decodePasswordToken = (token) => {
    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);
        return decoded.email; // Devuelve el email del token decodificado
    } catch (err) {
        throw new Error('Token inválido o expirado');
    }
};
const verifyPasswordToken=(req,res,next)=>{
    const {token}=req.params;
    jwt.verify(token,PRIVATE_KEY,(error,decoded)=>{
        if(error){
            req.logger.info("Token expirado")
            return res.render('login', { message: 'El tiempo para  restablecer la contraseña ha expirado, por favor solicita nuevamente.' });
        
           // return  res.status(401).send({status:'expired',message:"El token ha expirado"})
        }
        next()
    })
}
module.exports={generateToken,authToken,PRIVATE_KEY,generatePasswordToken,decodePasswordToken,authToken,verifyPasswordToken}