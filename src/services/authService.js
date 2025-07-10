/**
 * @fileoverview Servicio para la autenticación de usuarios
 * @module services/authService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const { ValidationError } = require('../utils/appError');
const {generateToken} = require('../middlewares/auth')

/**
 * Registra un nuevo usuario en el sistema
 * 
 * @async
 * @function registerService
 * @param {string} email - Correo electrónico del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} role - Rol del usuario en el sistema
 * @returns {Object} Datos del usuario creado sin la contraseña
 * @throws {ValidationError} Si el correo ya está registrado
 */
exports.registerService = async (email, name, password, role) => {
    const existingUser = await prisma.user.findFirst({ where: {email}});
    if(existingUser){
        throw new ValidationError('Este correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role,
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        select: {
            email: true,
            name: true,
            role: true,
            isActive: true,
            password: false,
            createdAt: false,
            updatedAt: false,
        }
    });
    return newUser;

}

/**
 * Autentica a un usuario en el sistema
 * 
 * @async
 * @function loginService
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {string} Token JWT para autenticación
 * @throws {ValidationError} Si las credenciales son inválidas o hay demasiados intentos fallidos
 */
exports.loginService = async (email, password) => {
    const user = await prisma.user.findUnique({ 
        where: { email: email },
        select: {
            id: true,
            email: true,
            password: true,
            role: true,
            isActive: true,
            loginAttempts: true,
            lastLoginAttempt: true
        }
    });

    if (!user) {
        throw new ValidationError("Acceso denegado",'Usuario o contraseña inválidas');
    }

    // Verificar intentos de login
    if (user.loginAttempts >= 5 && 
        new Date() - new Date(user.lastLoginAttempt) < 15 * 60 * 1000) {
        throw new ValidationError('Demasiados intentos fallidos. Intente más tarde');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: user.loginAttempts + 1,
                lastLoginAttempt: new Date()
            }
        });
        throw new ValidationError("Acceso denegado",'Usuario o contraseña inválidas');
    }

    // Resetear intentos de login
    await prisma.user.update({
        where: { id: user.id },
        data: {
            loginAttempts: 0,
            lastLoginAttempt: new Date()
        }
    });

    return generateToken(user);
}

exports.getMeService = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        }
    })
}