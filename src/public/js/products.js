const socket = io();
const listProducts=document.getElementById("cardConteiner");
function createProductCard(producto) {
    return `
      <div class="card relative overflow-hidden border rounded-lg shadow-lg">
        <img src="${producto.thumbnail}" alt="${producto.title}" class="w-full h-64 object-cover">
        <div class="card-body p-4">
          <h5 class="card-title font-bold text-xl mb-2">${producto.title}</h5>
          <p class="card-description text-gray-700 mb-2">${producto.description}</p>
          <p class="card-price font-bold text-gray-900 mb-2">$${producto.price}</p>
          <p class="card-code text-sm text-gray-600 mb-2">Code: ${producto.code}</p>
          <p class="card-category text-sm text-gray-600 mb-2">Category: ${producto.category}</p>
          <button class="add-to-cart absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" data-product-id="${producto._id}">Add to Cart</button>
        </div>
      </div>
    `;
  }
//AGREGAR PRODUCTO EN TIEMPO REAL
socket.on("nuevoProductoParaTodos",nuevoProducto=>{
    const nuevoDiv=document.createElement("div")

    nuevoDiv.innerHTML=createProductCard(nuevoProducto)
    listProducts.appendChild(nuevoDiv)
})

const form = document.getElementById('myForm');
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
        category: category
    };
    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("B")
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('No se pudo registrar el producto');
        }
    })
    .then(data => {
        if(data.status){
            if(data.status==="success"){
                const producto=data.payload
            socket.emit('nuevoProducto',producto);
            }else{
                alert(data.message)
            }  
        }else{
            console.log(data)
        }
        
    })
    .catch(error => {

        console.error(error);
    });
});

//ELIMINAR PRODUCTO EN TIEMPO REAL
socket.on("productoEliminadoParaTodos",enviarProductoEliminado=>{
    console.log(enviarProductoEliminado)
    const button = document.querySelector(`button[data-product-id="${enviarProductoEliminado.id}"]`);
    const cardDiv=button.closest(".card");
    cardDiv.remove()
})

const deleteProduct=document.getElementById("deleteProduct")

deleteProduct.addEventListener("submit",e=>{
    e.preventDefault();
    const data={
        pid:document.getElementById("pid").value
    }
    const pid=data.pid
    console.log(pid)
    fetch('/products/'+data.pid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
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
        console.error('Error:', error);
        alert('Hubo un error al intentar eliminar el producto');
    });
})
//UPDATE
const updateProduct=document.getElementById("updateProductForm")
updateProduct.addEventListener("submit",e=>{
    e.preventDefault();

    const data={
        pid:document.getElementById("productId").value,
        title:document.getElementById("titleup").value,
        description:document.getElementById("descriptionup").value,
        price:document.getElementById("priceup").value,
        code:document.getElementById("codeup").value,
        category:document.getElementById("categoryup").value,
        thumbnail:document.getElementById("thumbnailup").value,
    }
    for(const key in data){
        if (data[key]===undefined||data[key]===""){
            delete data[key]
        }
    }
    console.log(data)
    fetch('/products/'+data.pid,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('NO SE PUEDO ACTUALIZAR EL PRODUCTO');
        }
    }).then(data => {
        console.log(data.status)
        if(data.status==="false"){
            alert(data.message)
        }else{
            alert(data.message)
            const product=data.product
            socket.emit("editarProducto",product)
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al intentar editar el producto');
    });

})
//UPDATE SOCKET
socket.on("editenProducto",productoActualizado=>{
    const button = document.querySelector(`button[data-product-id="${productoActualizado._id}"]`);//buscar boton por el id
    let card=button.closest(".card");   // conseguir el div por la clase card
    //card.remove();// eliminar
    //const nuevoDiv=document.createElement("div")            //creo div
    //nuevoDiv.innerHTML=createProductCard(productoActualizado)//relleno el div 
    //listProducts.appendChild(nuevoDiv)// pusho el div a la lista de divs
    card=editarCard(productoActualizado,card)
    console.log(`Este es el id del producto que hay que editar ${productoActualizado._id}`)
})

function editarCard(producto,div){
    div.innerHTML="";

    div.innerHTML=
    `
    
        <img src="${producto.thumbnail}" alt="${producto.title}" class="w-full h-64 object-cover">
        <div class="card-body p-4">
          <h5 class="card-title font-bold text-xl mb-2">${producto.title}</h5>
          <p class="card-description text-gray-700 mb-2">${producto.description}</p>
          <p class="card-price font-bold text-gray-900 mb-2">$${producto.price}</p>
          <p class="card-code text-sm text-gray-600 mb-2">Code: ${producto.code}</p>
          <p class="card-category text-sm text-gray-600 mb-2">Category: ${producto.category}</p>
          <button class="add-to-cart absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" data-product-id="${producto._id}">Add to Cart</button>
        </div>
      
    `;
}

//ADD TO CART
function addToCart(event){
    event.preventDefault();
    const button=event.target;

    const data ={
      pid:button.getAttribute('pid'),
    }
    console.log(data)
    fetch(`/api/carts/${cartId}/product/${data.pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('No se pudo registrar el producto');
        }
    })
    .then(data => {
        alert(data.message)    
        if(data.status==='true'){
            const product=data.product
            socket.emit("newCartProduct",product)
        }
    })
    .catch(error => {
      alert(error)
    });
}