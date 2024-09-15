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
const deletedAccount=async(email)=>{
    return await transport.sendMail({
        from:'Coder Ecommerce <ecommerc>',
        to:email,
        subject:'Tu cuenta ha sido eliminado por inactividad',
        html:`<div>
            <h1>Tu cuenta ha sido eliminada por inactividad</h1>
            <p>Si no estas conforme con esta accion, contacta a un administrador para más detalles.</p>
        </div>`
    })
}
const deletedProduct=async(email)=>{
    return await transport.sendMail({
        from:'Coder Ecommerce <ecommerc>',
        to:email,
        subject:'Tu producto ha sido eliminado del ecommerce, contaca con un administrador para más detalles',
        html:`<div>
            <h1>Tu producto ha sido eliminado</h1>
            <p>Si no estas conforme con esta accion, contacta a un administrador para más detalles.</p>
        </div>`
    })
}
const purchasedTicket = async (email, productos,total) => {
    console.log(productos,"desde el purhcase")
    const productListHTML = productos.map(producto => `
        <tr>
            <td>${producto.product}</td>
            <td>${producto.quantity}</td>
        </tr>
    `).join('');

    const total = productos.reduce((acc, producto) => acc + (producto.price * producto.quantity), 0);

    return await transport.sendMail({
        from: 'Coder Ecommerce <ecommerce>',
        to: email,
        subject: 'Tu compra ha sido exitosa',
        html: `
            <div>
                <h1>Tu compra ha sido exitosa</h1>
                <p>Si tienes alguna duda o consulta, contacta con un administrador.</p>
                <h2>Detalles de tu compra:</h2>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productListHTML}
                    </tbody>
                </table>
                <p><strong>Total: </strong>$${total.toFixed(2)}</p>
            </div>
        `
    });
}

module.exports={sendMail,rePassword,deletedAccount,deletedProduct,purchasedTicket}