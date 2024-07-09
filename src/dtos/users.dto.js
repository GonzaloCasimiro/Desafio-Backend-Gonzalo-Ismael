class UserDto{
    constructor(user){
        this.name=user.name
        this.lastname=user.lastname
        this.email=user.email,
        this.password=user.password
        this.fullname=`${user.name} ${user.lastname}`
    }

}
module.exports = UserDto