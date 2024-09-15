const chai= require('chai')
const connectDB = require('../src/controllers/utils/db')
const UserDaoMongo = require('../src/dao/MONGO/UserDao.mongo')
const User = require('../src/models/userSchema')
const  mongoose  = require('mongoose')
connectDB()
const expect=chai.expect
describe('Set de test con chai',()=>{
    before(function(){
        this.userDao=new UserDaoMongo(User)
    })
    beforeEach(function(){
        mongoose.connection.collections.users.drop()
        this.timeout(500)
    })
    it('el dao debe obtener los usuarios en formato arreglo',async function(){
        const result= await this.userDao.getAll()
        expect(result).to.be.deep.equal([])
    })
})