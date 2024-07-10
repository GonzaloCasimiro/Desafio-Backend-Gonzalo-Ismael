const ticket = document.getElementById('ticket');

ticket.addEventListener('submit',e=>{
    e.preventDefault();
    const data={
        name:document.getElementById('name').value,
        lastname:document.getElementById('lastname').value,
        city:document.getElementById('city').value,
        adress:document.getElementById('adress').value,
        email:document.getElementById('email').value,
    }
    fetch('/api/carts/purchase',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(response=>{
    if(!response.ok){
        throw new Error('FAILED REQUEST')
    }
    return response.json()
}).then(data=>{
   alert(data.message)
   window.location.href="/"
    
}).catch(error=>{
    console.log(error)
})
})