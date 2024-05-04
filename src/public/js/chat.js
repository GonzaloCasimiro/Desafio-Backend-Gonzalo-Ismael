console.log("hola")
const socket = io();
// ENVIAR MENSAJE
const enviarMensaje=document.getElementById("sendMessageForm")
enviarMensaje.addEventListener("submit",e=>{
    e.preventDefault();
    const data={
        user:document.getElementById("userNameInput").value,
        message:document.getElementById("messageInput").value
    }
    fetch('/views/message', {
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
            throw new Error('No se pudo registrar el mensaje');
        }
    })
    .then(data => {
        if(data.message){
            alert(data.message)
            socket.emit("nuevoMensaje",data)
        }
        else{
            console.log(data)
        }
        
    })
    .catch(error => {
    console.error(error);
    });

})

// MENSAJE EN TIEMPO REAL
const messagesList=document.getElementById("messagesList");

socket.on("AgregarMensaje",data=>{
    const nuevoDiv=document.createElement("DIV");
    nuevoDiv.classList.add("flex", "items-start", "mb-4")
    nuevoDiv.innerHTML=`<img src="" alt="" class="w-10 h-10 rounded-full mr-4">
    <div class="bg-gray-200 p-4 rounded-lg">
      <p class="font-semibold">${data.user}</p>
      <p class="text-gray-700">${data.message}</p>`
    messagesList.appendChild(nuevoDiv)
})