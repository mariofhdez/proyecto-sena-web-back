const jwt = require('jsonwebtoken');
const { UnathorizedError, ForbiddenError } = require('../utils/appError');

function authenticateToken(req, res, next){
    if(!req.header('Authorization')) next(new UnathorizedError('Falta en el \'header\' de la petición el elemento \'Authorization\'.'));
    const token = req.header('Authorization').split(' ')[1];
    if(!token) return next(new UnathorizedError('Acceso denegado. No se ha proporcionado un token.'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(new ForbiddenError('Token inválido'));
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;