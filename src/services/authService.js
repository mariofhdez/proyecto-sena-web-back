/**
 * @fileoverview Servicio para la autenticación de usuarios
 * @module services/authService
 */

const prisma = require('../config/database');

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
        throw new ValidationError('User creation failed', 'This email is already registered');
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
        throw new ValidationError("Access denied",'Invalid email or password');
    }

    // Verificar intentos de login
    if (user.loginAttempts >= 5 && 
        new Date() - new Date(user.lastLoginAttempt) < 15 * 60 * 1000) {
        throw new ValidationError('Too many failed attempts. Try again later');
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
        throw new ValidationError("Access denied",'Invalid email or password');
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
    console.log('Looking for user with ID:', userId);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        }
    });
    
    if (!user) {
        throw new ValidationError('User not found', 'User does not exist');
    }
    
    return user;
}