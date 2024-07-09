class UserRepository{
    constructor(dao){
        this.dao=dao
    }
    getUsers=async() => await this.dao.getAll()
    getUser=async email => await this.dao.get(email)
    validateUser= async(email,password)=> await this.dao.validate(email,password)
    createUser= async data => await this.dao.create(data)
    updateUser= async data => await this.dao.update(data)
    deleteUser= async email => await this.dao.delete(email)
}
module.exports = UserRepository