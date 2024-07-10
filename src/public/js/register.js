
const register=document.getElementById("register");
register.addEventListener('submit',e=>{
    e.preventDefault();
    const data={
        name:document.getElementById('name').value,
        lastname:document.getElementById('lastname').value,
        email:document.getElementById('email').value,
        password:document.getElementById('password').value
    }
    fetch('/api/sessions/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(response=>{
    return response.json()
}).then(data=>{
    if(data.status==='succes'){
        if(data.role==="admin"){
            alert(data.message);
            return window.location.href=`/api/views/admin`
        }
        if(data.role==="user"){
            alert(data.message)
            return window.location.href="/api/views/products"
        }
    }else{
        console.log(data)
        alert(data.message)
    }  
}).catch(error=>{
    console.log(error)
})
})