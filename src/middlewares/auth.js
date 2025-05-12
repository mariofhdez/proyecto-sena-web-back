const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/appError');

function authenticateToken(req, res, next) {

    if (!req.header('Authorization')) throw new UnauthorizedError('La cabecera Authorization no ha sido proporcionada');

    const token = req.header('Authorization').split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new ForbiddenError('Token inválido'));
        req.user = user;
        next();
    });

}

function generateToken(user) {
    try {
        const { id, email, role, isActive } = user;
        const token = jwt.sign(
            {
                id: id,
                email: email,
                role: role,
                isActive: isActive
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '4h',
                algorithm: 'HS256'
            }
        )
        return token
    } catch (error) {
        return error
    }
}

module.exports = { authenticateToken, generateToken };