
const CartDaoMongo = require("../dao/MONGO/CartDao.mongo");
const ProductDaoMongo = require("../dao/MONGO/ProductDao.mongo");
const TicketDaoMongo = require("../dao/MONGO/TicketDao.mongo");
const UserDaoMongo = require("../dao/MONGO/UserDao.mongo");
const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const Ticket = require("../models/ticketModel");
const User = require("../models/userSchema");
const CartRepository = require("../repositories/cart.repository");
const ProductRepository = require("../repositories/product.repository");
const TicketRepository = require("../repositories/ticket.repository");
const UserRepository = require("../repositories/user.repository");
const cartService=new CartRepository(new CartDaoMongo(Cart))
const productService=new ProductRepository(new ProductDaoMongo(Product))
const userService=new UserRepository(new UserDaoMongo(User))
const ticketService=new TicketRepository(new TicketDaoMongo(Ticket));

module.exports={cartService,productService,userService,ticketService}