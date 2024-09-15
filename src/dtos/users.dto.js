const moment = require("moment")


class UserDto{
    constructor(user){
        this.name=user.name
        this.lastname=user.lastname
        this.email=user.email,
        this.password=user.password
        this.fullname=`${user.name} ${user.lastname}`
    }

}
const usersDto= (users)=>{
    let list=[]
    users.forEach(user=>{
        list.push({name:user.name,lastname:user.lastname,email:user.email,role:user.role})
    })
    return list
}
const usersStatus=(users)=>{
    let inactives=[]
    let actives=[]
    let admins=[]
    let date=moment()
    users.forEach(user=>{
        if(user.role!=="admin"){
            const lastConnectionDate=moment(user.lastConnection,'D-M-YYYY')
            const daysOffline=date.diff(lastConnectionDate,'days')
            if(daysOffline>=2){
                inactives.push({name:user.name,lastname:user.lastname,email:user.email,role:user.role})
            }else{
            actives.push({name:user.name,lastname:user.lastname,email:user.email,role:user.role})
            }
        }else{
            admins.push({name:user.name,lastname:user.lastname,email:user.email,role:user.role})
        }
        
    })
    return {actives:actives,inactives:inactives,admins:admins}
}

module.exports = {UserDto,usersDto,usersStatus}