
const register=document.getElementById("register");
register.addEventListener('submit',e=>{
    e.preventDefault();
    const data={
        name:document.getElementById('name').value,
        lastname:document.getElementById('lastname').value,
        email:document.getElementById('email').value,
        password:document.getElementById('password').value
    }
    console.log(data)
    fetch('/api/sessions/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(response=>{
        console.log(response)
    if(!response.ok){
        throw new Error('FAILED REQUEST')
    }
    return response.json()
}).then(data=>{
    console.log("DATA",data)
    if(data.status==='succes'){
        alert(data.message)
        window.location.href='/api/sessions/login'
    }else{
        alert(data.message)
    }
}).catch(error=>{
    console.log(error)
})
})