const { default: mongoose } = require("mongoose");
class MongooseTypeDto{
    constructor(id){
        this.id=id;
        this.cid=new mongoose.Types.ObjectId(this.id)
    }

}
module.exports = MongooseTypeDto