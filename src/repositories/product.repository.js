

class ProductRepository{
    constructor(dao){
        this.dao=dao
    }
    getProduct= async pid =>await this.dao.get(pid)
    getProductByCode=async code=> await this.dao.getByCode(code)
    createProduct=async data =>await this.dao.create(data)
    deleteProduct=async pid => await this.dao.delete(pid)
    getProducts=async data=>await this.dao.getProducts(data)
    getProductsByCategory=async data=> await this.dao.getProductsByCategory(data)
    getLimitsProducts=async limit => await this.dao.getLimitsProducts(limit)
    updateProduct=async (pid,key,value) => await this.dao.update(pid,key,value)
    getStock=async (pid,quantity)=> await this.dao.getStock(pid,quantity);
    updateStock=async (pid,quantity)=>await this.dao.getStock(pid,quantity)
    setProduct=async (pid,mid) => await this.dao.set(pid,mid)
    /*
    async getProducts(limits=5,numberPage=1,sort=-1,stock=0) {

        if(stock===1){
            const products=await this.model.paginate({stock:{$gt : 0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
            return products
        }else{
            const products = await this.model.paginate({},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
            return products
        }    
}
    async getProductsByCategory(limits=5,numberPage=1,sort=-1,category,stock=0) {
        if(stock>0){
            const products = await this.model.paginate({category:category,stock:{$gt:0}},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
            return products
        }
        else{
            const products = await this.model.paginate({category:category},{limit:limits,page:numberPage,lean:true,sort:{price:sort}})
            return products
        }
    }
    async getlimitsProducts(limit){
        const products=await this.model.find().limit(limit)
        const productsB=products.map(product=>product.toObject())
        return productsB;
    }
    async updateProduct(id,key,value) {
        const update=await this.model.findByIdAndUpdate({id:id},{[key]:value})
        return update    
    }
    async getStock(pid){
        const result=await this.model.exists({_id:pid,stock:{$gt:0}}) //devuelve el producto si cumple con los requisitos (pid  y mayor a 0)
        return !!result    // !! convierte en booleano true o false
    }*/
}

module.exports= ProductRepository