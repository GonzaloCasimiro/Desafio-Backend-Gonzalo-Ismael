const fs=require("fs");


class ProductManager{
    constructor(ruta){
        this.path=ruta;
    }
    /**
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {string} thumbnail 
     * @param {number} code 
     * @param {number} strock 
     */
    verificarCadena(parametro){
        if(typeof parametro !== "string"){
            throw new Error(`"${parametro}" no es una cadena de texto,se espera una cadena de texto`);
        }
    }
    verificarNumero(parametro){
        if(isNaN(parametro)){
            throw new Error(`"${parametro}" no es un numero,se espera un numero`)
        }
    }
    async readFile(){
        try {
            const products=await fs.promises.readFile(this.path,"utf-8")
            return JSON.parse(products);
        }catch(error){
            if(error.code==="ENOENT"){
                return []
            }
            else{
                console.log(error);
            }
        }
    }
/**
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {number} price 
 * @param {number} code 
 * @param {number} stock 
 * @param {string} category 
 * @param {string} thumbnail 
 * @returns 
 */
    async addProduct(title,description,price,code,stock,category,thumbnail){
        try {
                const products=await this.readFile();
                if(!title||!description||!price||!code||!stock||!category){
                    return ('NO HAS LLENADO TODOS LOS CAMPOS')
                }else{
                    this.verificarCadena(title);
                    this.verificarCadena(description)
                    this.verificarCadena(thumbnail)
                    this.verificarNumero(price)
                    this.verificarNumero(code)
                    this.verificarNumero(stock)
                    this.verificarCadena(category)

                    if(products.some(product=>product.code===code)===true){
                         return 'ESE CODE YA ESTA REGISTRADO EN UN PRODUCTO'
                    }else{
                        let newProduct={
                            id:await this.getNextId(),
                            title:title,
                            description:description,
                            price:price,
                            thumbnail:thumbnail,
                            code:code,
                            stock:stock,
                            status:true,
                            category:category
                        }
                        products.push(newProduct);
                        if(products.length===1){
                            await fs.promises.writeFile(this.path,JSON.stringify(products,null,"\t"),"utf-8")
                            console.log('archivo creado y guardado con el nuevo producto')
                            return newProduct
                        }else{
                            fs.unlinkSync(this.path);
                            await fs.promises.writeFile(this.path,JSON.stringify(products,null,"\t"),"utf-8");
                            console.log('archivo creado y guardado con el nuevo producto')
                            return newProduct
                        }        
                    }             
                }
            } catch (error) {
                console.log(error);
                return error
            }        
    }
    async getProducts(){
        try {
            const products=await this.readFile();
            if(products.length===0){
                return "NO EXISTEN PRODUCTOS EN ESTA LISTA"
            }else{
                return products
            }
        } catch (error) {
            return error
        }
    }
    async getProductsById(id){
        try {
            const products=await this.readFile();
            const productByID=products.find(item=>item.id===id);
            if(productByID!==undefined){
                console.log(`Objeto encontrado su id es :${productByID.id},su titulo:${productByID.title},su descripcion: ${productByID.description},su img: ${productByID.thumbnail},su code es ${productByID.code} y su stock es de : ${productByID.stock},su categoria: ${productByID.category},su status: ${productByID.status}`);
                return productByID
            }else{
                return null
            }
        } catch (error) {
            return error    
        }
    }
    async updateProduct(id,objeto){
        try {
            const products=await this.readFile();
            const productToUpdate=products.find(item=>item.id===id);
            if(productToUpdate!==undefined){
                Object.keys(productToUpdate).forEach(key=>{
                    if(objeto.hasOwnProperty(key)){
                        productToUpdate[key]=objeto[key]
                        console.log(objeto[key]);
                    }
                })
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'),"utf-8")
                return "Producto actualizado"
            }
        } catch (error) {
            return error
        }
    }
async deleteProduct(id){
    try {
        const products=await this.readFile();
        let product=products.find(product=>product.id===id);
        console.log(product)
        if(product !== undefined){
            const newProducts=products.filter(product=>product.id!==id);
            fs.unlinkSync(this.path);
            await fs.promises.writeFile(this.path,JSON.stringify(newProducts,null,"\t"),"utf-8");
            console.log('PRODUCTO ELIMINADO CONE XITO,DEVUELVE TRUE')
            return(true)
        }else{
            console.log('NO EXISTE PRODUCTO CON ESE ID,DEVUELVE NULL')
            return null
        }
    } catch (error) {
        return error
    }
    }
async getNextId(){
        let products=await this.readFile();
        if(products==="ENOENT"||products.length===0){
            return 1
        }else{ 
                console.log
                return products[products.length -1].id+1
        }
    }
}
module.exports =ProductManager;