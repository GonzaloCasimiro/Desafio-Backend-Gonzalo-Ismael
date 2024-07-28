//edit product
const editProduct=document.getElementById("edit-submit")
editProduct.addEventListener("click",e=>{
    e.preventDefault();
    const data={
        pid:editProduct.getAttribute('data-product-id'),
        key:document.getElementById('edit-select').value,
        value:document.getElementById('edit-value').value,
    }
    if(document.getElementById("owner")) data.owner=document.getElementById("owner").value
    fetch("/products",{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },body: JSON.stringify(data)
    }).then(response => {
        return response.json()
        
    }).then(data => {

        if(data.status==="error"){
            alert(data.message)
        }else{
            alert(data.message)
            let{key,value}=data.updateData
            const editInfo=document.getElementById(key)
            switch(key){
                case "price":
                key="Precio: $"
                break;
                case "category":
                    key="Categoría"
                break;
                case "code":
                    key="Código"
                break;
                case "stock":
                    key="Stock"
            }  
            editInfo.innerHTML=`${key}: ${value}`
            //socket.emit("editarProducto",product)
        }
    }).catch(error => {
        alert(error.message);
    });

})
