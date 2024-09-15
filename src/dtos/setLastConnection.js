const lastConnectionDto=(fecha)=>{
    console.log(fecha,"fecha")
    let day=fecha.getDate();
    let month=fecha.getMonth()+1;
    let year=fecha.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    let lastConnection=`${day}-${month}-${year}`
    return lastConnection
}
module.exports = lastConnectionDto
