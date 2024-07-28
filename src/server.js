const express = require("express");
const cors=require('cors')
//const { __dirname } = require("./utils.js");
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const productsSocket = require("./utils/productSocket.js");
const connectDB = require("./controllers/utils/db.js");
const cookieParser=require('cookie-parser');
const session =require('express-session');
const router=require('./routes/index.js')
//PASSPORT
const passport = require('passport')
const { initializePassport } = require("./config/passport.config.js");
//session file storage => persistencia en archivo
//const FileStore = require('session-file-store')
//session db storage => persistencia en mongo
const MongoStore =require("connect-mongo");
const { isLog } = require("./middlewares/auth.middleware.js");
const { passportCall } = require("./middlewares/passportCall.middelware.js");
const { port, mongoUrl, persistence } = require("./config/config.js");
const handleErrors = require("./utils/errors/index.js");
const addLoger = require("./utils/logers.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
//app.use(cookieParser());
app.use(cookieParser())    // firma "secreta de cookie" (luego la oculatermos con .env)
app.use(addLoger)
//session con mongo
app.use(session({
    store:MongoStore.create({
        mongoUrl:`${mongoUrl}`,
        mongoOptions:{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        },
        ttl:60*60*1000*24     // duracion24 hs
    }),
    secret:'s3cr3tC0d3r',
    resave:false,
    saveUninitialized:false,// para que no se auto cree antes de logear
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
        secure: false, 
        httpOnly: true
    }
}))
//passport
initializePassport()// llamar funcion de passport config
app.use(passport.initialize())// documentacion
app.use(passport.session())//documentacion

/*
const fileStorage=FileStore(session) //A
app.use(session({
    store:new fileStorage({
        path:'./sessions',  //=>en que archivo guardar/leer
        ttl:100,            //=> tiempo que durara la session
        retries:0           // => c/de veces que va intentar leer el ardchivo
    }),
    secret:'s3cr3tc0d3r',
    resave:true,
    saveUninitialized:true
}))*/
/*
app.use(session({
    secret:'s3cr3tc0d3r',
    resave:true,      // session activa aun que este inactiva
    saveUninitialized:true    //permite almacenar sesiones aunque no tengan valor
}))*/
let htppServer = app.listen(port, error => {
    console.log(`escuchando servidor ${port}`);
}).on("error", function (err) {
    process.once("SIGUSR2", function () {
        process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
        process.kill(process.pid, "SIGINT");
    });
});
const getServer=()=> htppServer = app.listen(port, error => {
    console.log(`escuchando servidor ${port}`);
}).on("error", function (err) {
    process.once("SIGUSR2", function () {
        process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
        process.kill(process.pid, "SIGINT");
    });
});
module.exports=getServer;
const io = new Server(htppServer);
app.use(productsSocket(io));

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('nuevoProducto',producto=>{
        const nuevoProducto=producto
        console.log(nuevoProducto)
        console.log(typeof nuevoProducto)
        io.emit("nuevoProductoParaTodos",nuevoProducto)
    })
    socket.on("productoEliminado",productoEliminado=>{
        //console.log(data.message)
        const enviarProductoEliminado=productoEliminado
        io.emit('productoEliminadoParaTodos',enviarProductoEliminado)
    })
    socket.on("editarProducto",producto=>{
        const productoActualizado=producto
        io.emit("editenProducto",productoActualizado)
    })
    // Manejar eventos específicos del cliente si es necesario
    // ENVIAR MENSAJES
    socket.on("nuevoMensaje",data=>{  
        io.emit("AgregarMensaje",data)
    })
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    //NUEVO PRODUCTO AL CART
    socket.on("newCartProduct",product=>{
        io.emit("addCartProduct",product)
    })
    //QUITAR PRODUCTO DEL CART
    socket.on("removerProducto",pid=>{
        io.emit("remuevanProducto",pid)
    })
});

//CONFIG HANDLEBARS
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
//rutas
app.use(router)
app.use(handleErrors())

connectDB();

app.get('/', passportCall('jwt'),(req, res) => {
    if(req.session.user){
        if(req.session.user.role==="admin") res.redirect('/api/views/admin')
        if(req.session.user.role==="user") res.redirect('/api/views/products')
            if(req.session.user.role==="premium") res.redirect('/api/views/products')
    }else if(req.user){
        if(req.user.role==="admin") res.redirect('/api/views/admin')
        if(req.user.role==="user") res.redirect('/api/views/products')
        if(req.user.role==="premium") res.redirect('/api/views/products')
    }else{
        res.render('login')
    }
});

//path - ttl - retires    => argumentos del storage => storage alamacenara las sessiones
