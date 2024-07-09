const { persistence } = require('../config/config.js')
let ProductsDao
let CartsDao
let UsersDao
let ChatsDao
switch(persistence){
    case "FS":
        const {default:ProductDaoFs}=await import('./FS/ProductDao.mongo')
        ProductsDao=ProductDaoFs
        const {default:UserDaoFs}=await import('./FS/UserDao.mongo.js')
        UsersDao=UserDaoFs;
        const {default:CartDaoFs}=await import('./FS/CartDao.mongo.js')
        CartsDao=CartDaoMongo
        const {default:MessageDaoFs}=await import('./FS/ChatDao.mongo.js')
        ChatsDao=MessageDaoFs
        break;
    default:
        //MONGO
        const {default:ProductDaoMongo}=await import('./MONGO/ProductDao.mongo.js')
        ProductsDao=ProductDaoMongo;
        const {default:UserDaoMongo}=await import('./MONGO/UserDao.mongo.js')
        UsersDao=UserDaoMongo;
        const {default:CartDaoMongo}=await import('./MONGO/CartDao.mongo.js')
        CartsDao=CartDaoMongo;
        const {default:MessagesDaoMongo}=await import('./MONGO/ChatDao.mongo.js')
        ChatsDao=MessagesDaoMongo;
        break;
}
module.exports={ProductsDao,CartsDao,UsersDao,ChatsDao}