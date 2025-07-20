/**
 * @fileoverview Middleware para la autenticación y autorización de usuarios
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/appError');
const prisma = require('../config/database');

/**
 * Middleware para autenticar el token JWT en las solicitudes
 * 
 * @function authenticateToken
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @throws {UnauthorizedError} Si la cabecera Authorization no está presente
 * @throws {ForbiddenError} Si el token es inválido o el usuario está inactivo
 */
async function authenticateToken(req, res, next) {
    try {
        if (!req.header('Authorization')) {
            throw new UnauthorizedError('The headers \'Authorization\' has not been provided');
        }

        const token = req.header('Authorization').split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return next(new ForbiddenError(err.message));
            }

            // Verificar que el usuario esté activo en la base de datos
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { role: true, isActive: true }
            });

            if (!dbUser) {
                return next(new ForbiddenError('User not found'));
            }

            if (!dbUser.isActive) {
                return next(new ForbiddenError('User account is deactivated'));
            }

            if (dbUser.role !== user.role) {
                return next(new ForbiddenError('You are not authorized to access this resource'));
            }

            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
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
                expiresIn: '1h',
                algorithm: 'HS256'
            }
        );
        return token;
    } catch (error) {
        return error;
    }
}

function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) return next(new ForbiddenError('Access denied', 'You are not authorized to access this resource'));
        next();
    }
}

function authorizeRole(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) return next(new UnauthorizedError('You are not authenticated'));
        if (!allowedRoles.includes(req.user.role)) return next(new ForbiddenError('You are not authorized to access this resource'));
        next();
    }
}

function validateToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return new UnauthorizedError('Access denied', 'Invalid token');
        return decoded;
    } catch (error) {
        return error;
    }
}

module.exports = { authenticateToken, generateToken, requireRole, authorizeRole, validateToken };