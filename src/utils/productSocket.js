const productsSocket = (io) => {
    return (req, res, next) => {
        req.socketServer =io;
        return next();
    };
};

module.exports = productsSocket;
