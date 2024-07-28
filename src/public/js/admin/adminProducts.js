const form = document.getElementById('myForm');
console.log(form)
form.addEventListener('submit', e => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;

    const data = {
        title: title,
        description: description,
        price: price,
        code: code,
        stock: stock,
        category: category,
        brand:category,
    };
    if(document.getElementById('owner'))data.owner=document.getElementById('owner').value
    fetch('/api/views/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();  
        } else if (response.status ) {
            return response.json().then(error => {
                alert(error.message);  
            });
        } else {
            throw new Error('No se pudo registrar el producto')
        }
        /*
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('No se pudo registrar el producto');
        }*/
    })
    .then(data => {
        if(data.status){
            if(data.status==="success"){
                const producto=data.payload
            //socket.emit('nuevoProducto',producto);
            alert(data.message)
            }else{
                alert(data.message)
            }  
        }else{
            alert(data.message)
        }
        
    })
    .catch(error => {

        console.error(error);
    });
});

//delete product
const deleteProduct=document.getElementById("deleteProduct")

deleteProduct.addEventListener("submit",e=>{
    e.preventDefault();
        const data={
            pid:document.getElementById("pid-delete").value,

        }
        if(document.getElementById("premiumDelete")) data.email=document.getElementById('premiumDelete').value
    fetch('/products',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }else if (response.status ) {
            return response.json().then(error => {
                alert(error.message);  
            });
        } 
         else {
            throw new Error('NO SE PUEDO ELIMINAR EL PRODUCTO');
        }
    }).then(data => {
        if(data.message){
            alert(data.message)
        }else{
            const productoEliminado={
                message:"UN PRODUCTO HA SIDO ELIMINADO",
                id:pid
            }
            socket.emit("productoEliminado",productoEliminado)
            console.log(data)
        }
    }).catch(error => {
    });
})

//
const buscarProduct=document.getElementById("searchProductForm")
    buscarProduct.addEventListener('submit',e=>{
        e.preventDefault();
        const code=document.getElementById('productCode').value
        fetch(`/products/code/${code}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }else if (response.status ) {
                return response.json().then(error => {
                    alert(error.message);  
                });
            } 
             else {
                throw new Error('NO SE PUEDO ELIMINAR EL PRODUCTO');
            }
        }).then(data => {
            if(data.message){
                let userConfirm=confirm(`${data.message}, acepta para ver el producto`)
                if(userConfirm){
                    window.location.href=`/api/views/update/${data.pid}`
                }
            }else{
                alert(data.message)
            }
        }).catch(error => {
            alert(error)
        });
    })