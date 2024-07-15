const generateUserError=(user)=>{
    const {name,lastname,email,password}=user
    let nullString="";
    if(!name) nullString=nullString+" Nombre"
    if(!lastname) nullString=nullString+" Apellido"
    if(!email) nullString=nullString+" Email"
    if(!password) nullString=nullString+" Password"
   return `Debes llenar todos los campos,te ha faltado : ${nullString}`
}
const productError=(product)=>{
    const{title,price,stock,code,description,category}=product
    let nullString="";
    if(!title) nullString=nullString+" titulo"
    if(!price) nullString=nullString+" precio"
    if(!code) nullString=nullString+" codigo"
    if(!description) nullString=nullString+" descripción"
    if(!stock) nullString=nullString+" stock"
    if(!category) nullString=nullString+" categoría"
    console.log("AA")
    return `Debes llenar todos los campos,te ha faltado : ${nullString}`
    
}
module.exports= {generateUserError,productError}