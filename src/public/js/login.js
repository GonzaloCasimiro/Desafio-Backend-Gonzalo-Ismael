const form = document.getElementById("myform");
form.addEventListener("submit",e=>{
    e.preventDefault();
    const data={
        email:document.getElementById("email").value,
        password:document.getElementById('password').value
    }
    console.log(data);
    fetch('/api/sessions/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(response=>{
        return response.json()
}).then(data=>{

    if(data.status==='succes'&& data.role==="user"){
        window.location.href=`/api/views/products`
    }else if(data.status==='succes'&& data.role==="admin"){
        window.location.href='/api/views/admin'
    }else{
        alert(data.message)
    }     
}).catch(error=>{
    console.error('Error',error)
})
})











const registerRequest=document.getElementById('register');
registerRequest.addEventListener('click',e=>{
    console.log('HOLA DESDE EL BOTON REGISTRASE')
    window.location="/register"
})