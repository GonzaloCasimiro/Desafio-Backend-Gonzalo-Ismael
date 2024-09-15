const chai=require('chai');
const  mongoose  = require('mongoose');
const supertest = require('supertest');
const connectDB = require('../src/controllers/utils/db');
const User = require('../src/models/userSchema');
const { extractToken } = require('../src/middlewares/passportCall.middelware');

const expect=chai.expect
const requester=supertest('http://localhost:8080');
connectDB()
describe('Test de ecommcrce',()=>{
    /*
    describe('Test de user',()=>{
        it('el endpoint debe crear un usuario correctamente',async()=>{
            const userMock={
                name:'gonzalo',
                lastname:'ismael',
                email:'gonzalo@gmail.com',
                password:'123456'
            }
            const {
                statusCode,
                ok,
                _body   
            }=await requester.post('/api/users/createUser').send(userMock);
            console.log(statusCode);
            console.log(ok)
            console.log(_body)
            expect(_body.status).equals('success')
        })
        it('el endpoint no debe crear un usuario con el mismo email',async()=>{
            const userMock={
                name:'gonzalo',
                lastname:'ismael',
                email:'gonzalo@gmail.com',
                password:'123456'
            }
            const {
                statusCode,
                ok,
                _body   
            }=await requester.post('/api/users/createUser').send(userMock)
            console.log(statusCode);
            console.log(ok)
            console.log(_body)
            expect(_body.status).equals("error")
        })
    })*/
    describe('Test de sessions',()=>{
        it('Debe registrar correctamente un usuario,debe agregar y quitar un producto a su carrito de compras y luego cerrar sesion para eliminar la cookie',async()=>{
            let cid
            let pid="664b0207bda9e82892bdbcab"
            const mockUser={
                name:'gonzalo',
                lastname:'ismael',
                email:'gonzaloismaelcasimiro@gmail.com',
                password:'123456'
            }
            const res=await requester.post('/api/sessions/register').send(mockUser)
            let cookies = res.headers['set-cookie'];
            let tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
            const toke=await extractToken("jwt")
            console.log(toke,"ASD")
            console.log(tokenCookie)
            expect(res.body.status).to.equal('succes')
            expect(tokenCookie).to.exist;

            /*
            // agregar producto al carrito//add product
            const addProduct=await requester.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', tokenCookie)
            console.log(addProduct.body)
            expect(addProduct.body.status).to.equal('succes')
            cid=addProduct.body.cart._id
            // quitar producto del carrito//remove product
            const removeProduct=await requester.delete(`/api/carts/${cid}/product/${pid}`).set('Cookie', tokenCookie)
            console.log(removeProduct.body)
            expect(removeProduct.body.status).to.equal('succes')
            */
            // eliminar la cookie//logout
            const logout=await requester.post('/api/sessions/logout').send()
            cookies=logout.headers['set-cookie'];
            tokenCookie = cookies ? cookies.find(cookie => cookie.startsWith('token=')) :undefined
            console.log(tokenCookie,"despues del logout")
            expect(tokenCookie).to.not.exist;

        })
        it('Eliminar el usuario creado',async()=>{
            const res=await User.deleteOne({email:"gonzaloismaelcasimiro@gmail.com"})
            console.log(res)
            expect(res.deletedCount).to.equal(1)
        })
    })
    describe('Test de Carts',()=>{
        const cid="66b6d51c6d5f8bd5d3c9a07b"
        const pid="664b0207bda9e82892bdbcab"
        it('Debe traer un cart por su id',async()=>{
            const res=await requester.get(`/api/carts/${cid}`)
            console.log(res.body)
            expect(res.body._id).to.exist
        })
        it('Debe devolver un error Cast por cid incorrecto',async()=>{
            const res=await requester.get('/api/carts/abc123')
            console.log(res.body)
            expect(res.body.name).to.equals('CastError')
        })
        
    })

})
