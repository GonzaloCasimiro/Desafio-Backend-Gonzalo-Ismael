
const dotenv = require('dotenv')
const program = require('../utils/commander')
const MongoSingleton = require('../utils/MongoSingleton')
const {mode}=program.opts()
const enviroment='development'
dotenv.config({
    path:mode==='development'? './.env.development':'./.env.production'
})

module.exports={
    port:process.env.PORT,
    mongoUrl:process.env.MONGO_URL,
    PRIVATE_KEY:process.env.PRIVATE_KEY,
    persistence:process.env.PERSISTENCE
}