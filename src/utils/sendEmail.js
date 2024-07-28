const nodemailer = require('nodemailer');
const { gmail_user, gmail_pass, port } = require('../config/config');
const transport=nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:gmail_user,
        pass:gmail_pass
    }
})

const sendMail=async (email)=>{
    return await transport.sendMail({
        from:'Coder Test <projecto ecommerce>',
        to:email,
        subject:'Email de prueba',
        html:`<div>
            <h1>Email de prueba</h1>
        </div>`,
    })
}
/*const rePassword=async(email)=>{
    return await transport.sendMail({
        from:'Ecommerce',
        to:email,
        subject:'Reestablece Tu Contraseña',
        html:`<div>
        <a href='http://localhost:${port}/api/views/re-pass>
        <button>Recuperar</button>
        </a>
        </div>`,
    })
}*/
const rePassword=async(email,token)=>{
    return await transport.sendMail({
        from:'Coder Test <proyecto ecommerce>',
        to:email,
        subject:'Reestablece Tu Contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <p>Haga clic en el botón de abajo para restablecer su contraseña:</p>
                <a href="http://localhost:${port}/api/views/resetPassword/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Recuperar</a>
                <p>Ignorar si no has solicitado esto</p>
            </div>
        `
    })
}
module.exports={sendMail,rePassword}