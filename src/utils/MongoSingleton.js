const mongoose =require('mongoose')

class MongoSingleton{
    static #instance
    constructor(){}

    static getInstance(){
        if(this.#instance){
            console.log("base de datos,ya conectada");
            return this.#instance
        }
        this.#instance=new MongoSingleton()
        console.log("conectado")
        return this.#instance
    }
}
module.exports=MongoSingleton