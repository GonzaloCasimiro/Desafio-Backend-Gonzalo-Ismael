const {Router} =require("express");
const auth = require("../middlewares/auth.middleware");
const pruebasRouter=Router();


//CREAR ENDPOINT PARA PROBAR LOS METODOS DE COOKIE-PARSER
pruebasRouter.get("/setCookie",(req,res)=>{
    //res manda una orden al navegador// maxAge => Tiempo => en este caso 100seg (10000milisegundos)
    res.cookie('CoderCookie',"esta es una cookie muy poderosa",{maxAge:10000000}).send('cookie')
})
//LEER COOKIE

pruebasRouter.get("/getCookie",(req,res)=>{
    //traer cookie, si aun sigue en el navegador
    res.send(req.cookies)
})
//DELETE COOKIE
pruebasRouter.get("/deleteCookie",(req,res)=>{
    //delete coookie
    res.clearCookie("CoderCookie").send("cookie borrada")
})
//SEGURIDAD A UNA COOKIE// FIRMAR UNA COOKIE 
pruebasRouter.get("/setCookieFirmada",(req,res)=>{
    //res manda una orden al navegador// maxAge => Tiempo => en este caso 100seg (10000milisegundos)
    res.cookie('CoderCookie',"esta es una cookie muy poderosa",{maxAge:10000000,signed:true}).send('cookie firmada')
})
//obtener cookie firmada
pruebasRouter.get("/getCookieFirmadas",(req,res)=>{
    //traer cookie, si aun sigue en el navegador
    res.send(req.signedCookies)
})

//SESSIONS
pruebasRouter.get("/session",(req,res)=>{
    if(req.session.counter){       //si ya se visit, suma una visita
        req.session.counter++
        res.send(`se ha visitado el sitio ${req.session.counter} veces.`)
    }else{ //si es la primer visita, set req.session.counter a 1
        req.session.counter=1
        res.send("Bienvenidos")
    }
})
//DESTROY SESSION
pruebasRouter.get("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(!err)return res.send('logout')
        else return res.send({status:"error",error:err})
    })
})
//ESTE ENDPOINT SOLO LO PUEDE VER UN ADMINISTRADOR
pruebasRouter.get("/current",auth,(req,res)=>{
    res.send("datos solo para admins")
})
module.exports= pruebasRouter