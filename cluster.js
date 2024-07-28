const cluster = require('node:cluster')
const {cpus}=require('node:os');
const getServer = require('./src/server');

//console.log(cluster.isPrimary)
const numeroDeProcesadores = cpus().length //numero de hilo
//console.log('numero de hilos: ',numeroDeProcesadores)
if(cluster.isPrimary){
    console.log('proceso primario, generando un proceso hijo...')
    for(let i=0;i<numeroDeProcesadores;i++){// crea un proceso hijo por cada hilo del cpu
        cluster.fork()  // crea un proceso hijo
    }
    cluster.on('message',worker=>{
        console.log(`worker ${worker.process.pid} recibio un mensaje`)
    })
}else{
    console.log(' al ser un proceso forkeado,no cuento como primaro, por lo tanto is primary is false, soy un worker')
    console.log(`Soy un proces hijo con el id ${process.pid}`)
    getServer()
}