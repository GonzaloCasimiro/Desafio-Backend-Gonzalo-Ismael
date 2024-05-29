/*const { fileURLToPath } = require("url");
const { dirname } = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

module.exports = { __dirname };
*/
const bcrypt=require('bcrypt')
const createHash= password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));         //encrypta el pw
const isValid=(user,password)=>bcrypt.compareSync(password,user.password)              //valida el pw 
module.exports={createHash,isValid}