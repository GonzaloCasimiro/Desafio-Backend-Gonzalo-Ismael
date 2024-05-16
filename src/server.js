const express = require("express");
//const { __dirname } = require("./utils.js");
const handlebars = require('express-handlebars');
const ProductManager = require("./controllers/ProductsManager.js");
const CartManager = require("./controllers/CartsManager.js");
const productRouter = require("./routes/productsRouter.js");
const cartRouter = require("./routes/cartsRouter.js");
const viewRouter = require("./routes/viewsRouter.js");
const { Server } = require('socket.io');
const productsSocket = require("./utils/productSocket.js");
const connectDB = require("./controllers/utils/db.js");
const cookieParser=require('cookie-parser');
const session =require('express-session');
const userRouter = require("./routes/userRouter.js");
const pruebasRouter = require("./routes/pruebas.Router.js");
const sessionRouter = require("./routes/sessionRouter.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(cookieParser("f1rm4s3cr3t4"))    // firma "secreta de cookie" (luego la oculatermos con .env)
app.use(session({
    secret:'s3cr3tc0d3r',
    resave:true,      // session activa aun que este inactiva
    saveUninitialized:true    //permite almacenar sesiones aunque no tengan valor
}))
const htppServer = app.listen(8080, error => {
    console.log('Escuchando servidor en puerto 8080');
}).on("error", function (err) {
    process.once("SIGUSR2", function () {
        process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
        process.kill(process.pid, "SIGINT");
    });
});

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
app.use('/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/views', viewRouter);
app.use("/user",userRouter)
app.use("/pruebas",pruebasRouter)
app.use("/api/sessions",sessionRouter)

connectDB();

app.get('/', (req, res) => {
    res.render('index');
});

