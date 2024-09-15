const UserDaoMongo = require("../src/dao/MONGO/UserDao.mongo");
const Asserts=require('assert')
const mongoose = require('mongoose');
const connectDB = require("../src/controllers/utils/db");
const User = require("../src/models/userSchema");
connectDB()
//mongoose.connect('mongodb+srv://gonzaloismael:123gonza@cluster0.udpj4jc.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
const assert=Asserts.strict

describe('Test Users Dao',()=>{
    before(function(){
        this.userDao=new UserDaoMongo(User)
    })
    beforeEach(function(){
        this.timeout(500)
    })
    it('El dao debe obtener los usuarios en formato arreglo',async function (){
        // las acciones a ejecutar
        console.log(this.userDao,"dao")
        const result=await this.userDao.getAll()
        assert.strictEqual(Array.isArray(result),true)
    })
    it('El dao debe agregar un usuario  correctamente a la base de datos',async function (){
        //acciones
        
    })
})