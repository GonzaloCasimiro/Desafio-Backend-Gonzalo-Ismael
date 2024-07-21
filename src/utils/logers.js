
const winston =require('winston');
const program = require('./commander');
const {mode}=program.opts()
/* 
//configurar log con consola
const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level:'http'
        })
    ]
})*/
//agregando mas transportes
/*
const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level:'http'
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'warn'
        })
    ]
})*/
const customLevelOptions={
    levels:{
        debug:0,
        http:1,
        info:2,
        warning:3,
        error:4,
        fatal:5
    },
    colors:{
        fatal:'red',
        error:'red',
        warning:'yellow',
        info:'blue',
        debug:'white',
        http:'white'
    }
}
//paso 3 agregando custom levels
const developmentLogger = winston.createLogger({
    levels:customLevelOptions.levels,
    transports:[
        new winston.transports.Console({
            level:'debug',
            format:winston.format.combine(
                winston.format.colorize({colors:customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level:'http',
            format:winston.format.combine(
                winston.format.colorize({colors:customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level:'info',
            format:winston.format.combine(
                winston.format.colorize({colors:customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level:'warning',
            format:winston.format.combine(
                winston.format.colorize({colors:customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'error',
            format:winston.format.simple()
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'fatal',
            format:winston.format.simple()
        }),

    ]
})
const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({colors:customLevelOptions.colors}),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level:'warning',
            format:winston.format.combine(
                winston.format.colorize({colors:customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'error',
            format:winston.format.simple()
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'fatal',
            format:winston.format.simple()
        }),
    ]
});
const logger = mode === 'production' ? productionLogger : developmentLogger;

// middleware
const addLoger=(req,res,next)=>{
    req.logger=logger
    req.logger.info(`${req.method} en ${req.url}- ${new Date().toLocaleString()}`)
    next()
}
module.exports=addLoger