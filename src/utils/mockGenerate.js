const {faker}=require('@faker-js/faker')
const generateProducts=()=>{
    const categories=['samsung','tcl','motorola','apple']
    return {
        title:faker.commerce.product(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price(),
        code:faker.string.uuid(),
        category:faker.helpers.arrayElement(categories),
        stock:faker.number.int({min:10,max:50})
    }
}
module.exports=generateProducts
