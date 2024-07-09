const fs = require('fs');

class CarManager{
    constructor(path){
        this.path=path;
    }
    async readFile(){
        try {
            const cars=await fs.promises.readFile(this.path,"utf-8")
            return JSON.parse(cars);
        }catch(error){
            if(error.code==="ENOENT"){
                return []
            }
            else{
                console.log(error);
            }
        }
    }
    async getNextId(){
        let cars=await this.readFile();
        if(cars==="ENOENT"||cars.length===0){
            return 1
        }else{ 
                return cars[cars.length -1].id+1
        }
    }
    async addProduct(cid,pid){
        try {
            const cars=await this.readFile();
            const carToUpdate=cars.find(car=>car.id===cid);

            if(cars.length===0 || carToUpdate===undefined){
                const newCar={
                    id:await this.getNextId(),
                    products:[{id:pid,quantity:1}]
                }
                cars.push(newCar);
                await fs.promises.writeFile(this.path,JSON.stringify(cars,null,"\t","utf-8"))
                console.log('El producto ha sido agregado al Carrito, ESTO DEVUELVE TRUE');
                return true
            }  else{
                    const productExists=carToUpdate.products.find(product=>product.id===pid);
                    if(productExists){
                        productExists.quantity++
                        await fs.promises.writeFile(this.path,JSON.stringify(cars,null,"\t"),"utf-8");
                        console.log("se ha agregado 1(cantidad) al producto que ya tenias en tu carrito,ESTO DEVUELVE TRUE");
                        return true
                    }else{
                        const newProduct={id:pid,quantity:1};
                        carToUpdate.products.push(newProduct);
                        await fs.promises.writeFile(this.path,JSON.stringify(cars,null,"\t"),"utf-8");
                        console.log("se ha agregadoel producto en tu carrito,ESTO DEVUELVE TRUE");
                        return true
                    }
                }
            
        } catch (error) {
            return error.message
        }        
    }
    async removeProduct(cid,pid){
        try {
            const carts=await this.readFile();
            const cart=carts.find(cart=>cart.id===cid);
            if(!cart){
                console.log('No existe un Carrito con ese id, esto devuelve false')
                return false
            }else{
                const productToDelete=cart.products.find(product=>product.id===pid);
                if(!productToDelete){
                    console.log("No existe producto con ese id,esto devuelve null");
                    return null;
                }else{
                    if(productToDelete.quantity>1){
                    productToDelete.quantity--
                    console.log('Se ha quitado 1(cantidad)del producto a tu carrito,ESTO DEVUELVE TRUE')
                    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,"\t"),"utf-8");
                    return true
                }else{
                    const index =cart.products.findIndex(product=>product.id===pid);
                    if(index!==-1){
                        cart.products.splice(index,1)
                        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,"\t"),"utf-8");
                        console.log("Se ha removido el producto,esto devuelve true");
                        return true
                    }else{
                        console.log('NO EXISTE PRODUCTO CON ESE ID')
                        return ('NO EXISTE PRODUCTO CON ESE ID')
                    }         
                }
                }  
            }
        } catch (error) {
            return error
        }
    }
    async getCart(cid){
        try {
            const carts=await this.readFile();
            const cart=carts.find(cart=>cart.id===cid);
            console.log(cid)
            console.log(cart)
            if(cart){
                console.log("DEVUELVO CART")
                return cart
            }else{
                console.log("devuelve false => manejar el return")
                return false
            }
        } catch (error) {
            return error
        }
    }
    async createCart(){
        try {
            const carts=await this.readFile();
            const newCart={
                id:await this.getNextId(),
                products:[]
            }
            console.log(newCart.id)
            carts.push(newCart)
            if (carts.length>1) fs.unlinkSync(this.path);
            await fs.promises.writeFile(this.path,JSON.stringify(carts,null,"\t"),`utf-8`)
            console.log(`CART CREADO CON EXITO`)
            return true
        } catch (error) {
            return error
        }
    }
}
module.exports=CarManager;