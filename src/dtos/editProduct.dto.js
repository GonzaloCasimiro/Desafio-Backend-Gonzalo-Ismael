class editProductDto{
    constructor(data){
        if(data.key==="price"){
            this.value=parseInt(data.value)
            this.key=data.key;
            this.pid=data.pid;
        }else{
            this.value=data.value
            this.key=data.key;
            this.pid=data.pid;
        }
    }
}
module.exports= editProductDto