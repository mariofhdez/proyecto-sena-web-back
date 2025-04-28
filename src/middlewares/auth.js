const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
    if(!req.header('Authorization')) return res.status(401).json({ error: 'Falta en el \'header\' de la petición el elemento \'Authorization\'.'})
    const token = req.header('Authorization').split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Acceso denegado. No se ha proporcionado un token.'});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({ error: err.message});
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;