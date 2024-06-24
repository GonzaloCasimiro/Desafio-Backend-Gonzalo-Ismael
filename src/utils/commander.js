const {Command}=require('commander')
const program=new Command()
program
    .option('--mode <mode>','modo de trabajo del servidor','production')
    .parse()
module.exports = program