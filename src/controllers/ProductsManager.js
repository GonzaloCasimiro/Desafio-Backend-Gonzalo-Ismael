const fs = require("fs");
//const { __dirname } = require("../utils.js");
const  Product  = require("../dao/models/productSchema.js");
const { Model, default: mongoose } = require("mongoose");

class ProductManager {
    constructor(ruta) {
        this.path = ruta;
    }

    verificarCadena(parametro) {
        if (typeof parametro !== "string") {
            throw new Error(`"${parametro}" no es una cadena de texto, se espera una cadena de texto`);
        }
    }

    verificarNumero(parametro) {
        if (isNaN(parametro)) {
            throw new Error(`"${parametro}" no es un número, se espera un número`);
        }
    }

    async readFile() {
        try {
            const products = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(products);
        } catch (error) {
            if (error.code === "ENOENT") {
                return [];
            } else {
                console.log(error);
            }
        }
    }

    async addProduct(title, description, price, code, stock, category, thumbnail) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                const data = {
                    message: "DEBES LLENAR TODOS LOS CAMPOS",
                    status: 400
                };
                return data;
            } else {
                const newProduct = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    category,
                    status:true
                };
                const result = await Product.create(newProduct);

                return result.toObject()
            }
        } catch (error) {
            if (error.code === 11000) {
                const data = {
                    message: "ESE CODE YA SE ENCUENTRA REGISTRADO",
                    status: 409
                };
                return data;
            } else {
                return error;
            }
        }
    }

    async getProducts(limits=5,numberPage=1,sort=-1,stock=0) {
        try {
            if(stock===1){
                const products=await Product.paginate({stock:{$gt : 0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }else{
                const products = await Product.paginate({},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }    
        } catch (error) {
            return error;
        }
    }
    async getProductsByCategory(limits=5,numberPage=1,sort=-1,category,stock=0) {
        try {
            console.log(stock)
            if(stock>0){
                const products = await Product.paginate({category:category,stock:{$gt:0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }
            else{
                const products = await Product.paginate({category:category},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
                return products
            }
                
        } catch (error) {
            return error;
        }
    }
    async getlimitsProducts(limit){
        try {
            console.log(limit)
            const products=await Product.find().limit(limit)
            const productsB=products.map(product=>product.toObject())
            return productsB;
        } catch (error) {
            return error
        }
    }
    async getProductsById(id) {
        try {
            
            const product=await Product.findById(id);
            if(product===null){
                const data={
                    message:"NO SE ENCONTRO PRODUCTO CON ESE ID",
                    status:null
                }
            }else{
                const productB=product.toObject();
                return productB
            }
            
            //const products = await this.readFile();
            //const productByID = products.find(item => item.id === id);
            /*if (productByID !== undefined) {
                console.log(`Objeto encontrado su id es :${productByID.id},su titulo:${productByID.title},su descripcion: ${productByID.description},su img: ${productByID.thumbnail},su code es ${productByID.code} y su stock es de : ${productByID.stock},su categoria: ${productByID.category},su status: ${productByID.status}`);
                return productByID;
            } else {
                return null;
            }*/
        } catch (error) {
            return error;
        }
    }

    async updateProduct(id, objeto) {
        try {
            console.log(id)
            const pid=new mongoose.Types.ObjectId(id)
            console.log(pid)
            const product=await Product.findOne({_id:pid});
            if(!product){
                const data={
                    status:"error",
                    message:"No existe producto con ese id"
                }
                return data

            }else{
                for(const key in objeto){
                    if(Object.hasOwnProperty.call(objeto,key)){
                        product[key]=objeto[key]
                    }
                }
                const result=await product.save()
                const data={
                    status:"succes",
                    message:"Producto Actualizado con exito",
                    product:product
                }
                return data
                }
        } catch (error) {
            if (error.code === 11000) {
                const data = {
                    message: "ESE CODE YA SE ENCUENTRA REGISTRADO",
                    status: "false"
                };
                return data;
            } else {
                return error;
            }
        }
    }

    async deleteProduct(id) {
        try {
            //const result=await Product.findByIdAndDelete(ObjectId(id))
            const result =await  Product.findByIdAndDelete(id)
            console.log(result)
            if(result===null){
                const data={
                    message:"NO EXISTE PRODUCTO CON ESE ID",
                    status:null
                }
                console.log("no existe")
                return data
                
            }else{
                console.log("Producto")
                const data={
                    id:uid,
                    message:"PRODUCTO ELIMINADO CON EXITO"
                }
                return result
            }
        } catch (error) {
            console.log(error)
            console.log("C")
            return error;
        }
    }

    async getNextId() {
        let products = await this.readFile();
        if (products === "ENOENT" || products.length === 0) {
            return 1;
        } else {
            console.log;
            return products[products.length - 1].id + 1;
        }
    }
}

module.exports = ProductManager;
