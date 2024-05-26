const bcrypt=require('bcrypt')
const createHash=async(password)=>bcrypt.hashSync(password,bcrypt.genSaltSync(10))

const isValidPassword=(password,user)=>bcrypt.compareSync(password,user.password)
module.exports = createHash
module.exports = isValidPassword