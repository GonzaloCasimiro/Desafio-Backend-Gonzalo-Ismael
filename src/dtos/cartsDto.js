const { default: mongoose } = require("mongoose");
const { productService } = require("../service/service")

function mapProductsDto(cart,ticket){
    const array=[]
        ticket.forEach(element => {
            const exist=cart.some(item=>item._id.toString() === element.pid.toString())
            if(!exist){  
                let id=element.pid
                array.push({_id:id,quantity:element.quantity})
            }
        });
    return array
}
async function setProductsInCart(cart){                
        for(let i=0;i<cart.products.length;i++){
            let item=cart.products[i];
            let productData=await productService.getProduct(item._id)
            productData=productData.toJSON()
            //const productData=await Product.findById(item._id);
            if(productData){
                cart.products[i].product=productData
            }
        }
        return cart
}
async function stock(cart){
    const productStock={inStock:[],outStock:[],total:0}
    for(let i=0;i<cart.products.length;i++){
        const item=cart.products[i];
        const quantity=cart.products[i].quantity;
        let getStock=await productService.getStock(item._id,quantity)
        let productData=await productService.getProduct(item._id)
        if(getStock){
            productStock.inStock.push({quantity:quantity,product:productData.toJSON()})
            productStock.total=productStock.total+productData.price
        }else{
            productStock.outStock.push({quantity:quantity,product:productData.toJSON()})
        }
        }
    return productStock
}
module.exports={mapProductsDto,setProductsInCart,stock}