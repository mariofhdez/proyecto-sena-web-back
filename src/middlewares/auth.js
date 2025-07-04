/**
 * @fileoverview Middleware para la autenticación y autorización de usuarios
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/appError');

/**
 * Middleware para autenticar el token JWT en las solicitudes
 * 
 * @function authenticateToken
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @throws {UnauthorizedError} Si la cabecera Authorization no está presente
 * @throws {ForbiddenError} Si el token es inválido
 */
function authenticateToken(req, res, next) {
    if (!req.header('Authorization')) throw new UnauthorizedError('La cabecera Authorization no ha sido proporcionada');

    const token = req.header('Authorization').split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new ForbiddenError('Token inválido'));
        req.user = user;
        next();
    });
}

/**
 * Genera un token JWT para un usuario dado
 * 
 * @function generateToken
 * @param {Object} user - Objeto de usuario que contiene id, email, role, y isActive
 * @param {number} user.id - ID del usuario
 * @param {string} user.email - Correo electrónico del usuario
 * @param {string} user.role - Rol del usuario en el sistema
 * @param {boolean} user.isActive - Estado de activación del usuario
 * @returns {string} Token JWT generado
 * @throws {Error} Si ocurre un error durante la generación del token
 */
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
        );
        return token;
    } catch (error) {
        return error;
    }
}

module.exports = { authenticateToken, generateToken };