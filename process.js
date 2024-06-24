/*
console.log(process)
console.log('hola')
console.log(process.cwd())//direccion del directorio
console.log(process.pid)//proceso id
console.log(process.memoryUsage())
console.log(process.argv)//argumentos, direccion donde tenemmos node.exe y direccion del directorio 
console.log(process.version)//version node
*/
// MANEJO DE ARGUMENTOS
console.log(process.argv.slice(2))// => quito los 2 primeros arguemntos que son las direcciones de dir
//node process.js --node development


// COMANDER
/*
const {Command}=require('commander')
const program=new Command()
program
    .option('-d','Variable para debug',false)
    .option('-p <port>','Puerto del servidor',8080)
    .option('--mode <mode>','modo de trabajo del servidor','production')
    .option('-u <user>','usuario utilizando el app','no se ha declarado user')
    .option('-l, --letters [letters..]','specifiy letter')
    .parse()

console.log('Options: ',program.opts())

console.log('Argumentos: ',program.args)
*/
//node process.js -d -p 3000 --mode development -u root --letters a b s
// -p 300 -u root 2 a 5 --letters a b s

// listeners
process.on('exit',code=>{
    console.log('antes de salir del proceso',code)
})
process.on('uncaughtException',exception=>{
    console.log('Este atrapa todos los errores no controlados, una variable o funcion que no exista',exception)
})
/*
process.on('message',message=>{
    console.log('Mandar mensajes a otro proceso')
})*/
console.log('ejecutando cod')
//console.log(gonza)

//procesos hijos
