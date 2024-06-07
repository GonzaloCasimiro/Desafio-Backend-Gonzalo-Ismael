
  //REMOVER PRODUCTO DEL CARRITO
  function remove(event){
    event.preventDefault()
    const button=event.target;

    const data ={
      pid:button.getAttribute('cpid'),
      cid:cartId
    }
    console.log(data)
    fetch(`/api/carts/${cartId}/product/${data.pid}`, {
        method: 'DELETE',
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
        const pid=data.id;
        socket.emit("removerProducto",pid)
    })
    .catch(error => {
      alert(data.message)
    });
  }
 //VACIAR CARRITO
 const vaciarCarrito=document.getElementById("vaciarCarrito");
 function vaciar(button){
    button.addEventListener("click",e=>{
  e.preventDefault();
  const data={
    cid:cartId
  }
  console.log(data)
  fetch(`/api/carts/${data.cid}`,{
    method:"DELETE",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(data)
  }).then(response=>{
    if(response.ok){
      return response.json()
    }else{
      throw new Error("NO SE PUDO VACIAR EL CARRITO")
    }
  })
  .then(data=>{
    alert(data.message);
    const cartList=document.getElementById('cart');
    cartList.innerHTML=""
    const p=document.createElement('p');
    p.classList.add('text-sm', 'text-red-900')
    p.innerText="No hay productos en el carrito"
    cartList.appendChild(p)
  })
  .catch(error=>{
    alert(error)
  })
 })
 }
 if(vaciarCarrito) vaciar(vaciarCarrito)
 //IO AGREGAR PRODUCTO AL CART
const cartList=document.getElementById("cart");
function crearCard(producto){
  return `
          <div>
            <p class="text-sm font-semibold text-red-900">${producto.title}</p>
            <p class="text-sm text-red-700">Precio:${producto.price}</p>
            <p class="text-sm text-red-700">Cantidad: 1</p>
          </div>
          <button cpid=${producto.id} class="bg-red-500 text-white px-2 py-1 rounded-full text-sm hover:bg-red-600 focus:outline-none" onclick="remove(event)">
            Quitar
          </button>`
 }

 socket.on("addCartProduct",product=>{
  const producto=product
  const firstChild=cartList.firstElementChild;
  if(firstChild.tagName==="P"){
      const nuevoDiv=document.createElement('div');
      nuevoDiv.classList.add("product-item", "mb-4", "p-2", "bg-gray-100", "rounded-lg", "shadow-inner", "flex", "justify-between", "items-center");
      nuevoDiv.innerHTML=crearCard(producto);
      cartList.replaceChild(nuevoDiv,firstChild)
      const vaciarCarrito=document.createElement("buton");
      vaciarCarrito.setAttribute("id","vaciarCarrito")
      vaciarCarrito.classList.add("bg-gray-500", "text-white", "px-4", "py-2", "rounded", "hover:bg-gray-600", "focus:outline-none")
      vaciarCarrito.innerText="Vaciar Carrito"
      cartList.appendChild(vaciarCarrito)
      vaciar(vaciarCarrito);

  }else{
      const exist=document.querySelector(`[cpid="${producto.id}"]`)
      if(exist){
        let contenedor=exist.closest(".product-item");
        let cantidad=contenedor.querySelectorAll('p')[2];
        let cantidadTexto=cantidad.textContent;
        let cantidadActual=parseInt(cantidadTexto.split(':')[1]);
        let cantidadNueva=cantidadActual+1
        cantidad.textContent='Cantidad: '+cantidadNueva
      }else{
        console.log("AAAA")
        const nuevoDiv=document.createElement("div");
        nuevoDiv.classList.add("product-item", "mb-4", "p-2", "bg-gray-100", "rounded-lg", "shadow-inner", "flex", "justify-between", "items-center");
        nuevoDiv.innerHTML=crearCard(producto)
        const lastChild=cartList.lastElementChild
        console.log(lastChild)
        cartList.insertBefore(nuevoDiv,lastChild)
    }
  }
 })
//IO QUITAR PRODUCTO

 socket.on("remuevanProducto",pid=>{
    const producto=document.querySelector(`[cpid="${pid}"]`);
    if(producto){
        let contenedor=producto.closest('.product-item');
        let cantidad=contenedor.querySelectorAll('p')[2];
        let cantidadTexto=cantidad.textContent;
        let cantidadActual=parseInt(cantidadTexto.split(':')[1]);
        let cantidadNueva=cantidadActual-1;
        if(cantidadNueva===0) cartList.removeChild(contenedor)
        cantidad.textContent='Cantidad: '+cantidadNueva
    }
    const cartLength=cartList.children.length;
    if(cartLength===1){
      const vaciarCarrito=document.getElementById('vaciarCarrito')
      const p =document.createElement("p")
      p.innerText="No hay productos en el carrito"
      p.classList.add('text-sm' ,'text-red-900')
      cartList.replaceChild(p,vaciarCarrito)
    }
 })

 //IO VACIAR CARRITO
