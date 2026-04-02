/**
 * @fileoverview Servicio para la gestión de usuarios
 * @module services/userService
 */

const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const { ValidationError } = require('../utils/appError');
const { generateToken } = require('../middlewares/auth');

exports.createUser = async (email, name, password, role, isActive) => {
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
            isActive,
        },
        select: {
            email: true,
            name: true,
            role: true,
            isActive: true,
        }
    });
    return newUser;
}   

exports.getUsersService = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });
    return users;
}

exports.getUserById = async (id) => {
    const user = await prisma.user.findFirst({
        where: { id: parseInt(id, 10) }, 
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    return user;
}

/**
 * Actualiza la información de un usuario específico
 * 
 * @async
 * @function updateUser
 * @param {number|string} userId - ID del usuario a actualizar
 * @param {Object} data - Datos a actualizar del usuario
 * @returns {Object} Datos del usuario actualizado
 */
exports.updateUser = async (userId, data) => {

    return prisma.user.update({
        where: { id: parseInt(userId) },
        data
    });
}

exports.deleteUser = async (userId) => {
    const user = await prisma.user.findFirst({
        where: { id: parseInt(userId, 10) }, 
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    return prisma.user.delete({ where: { id: parseInt(userId, 10) } });
}

exports.toggleUserStatus = async (userId) => {
    const user = await prisma.user.findFirst({
        where: { id: parseInt(userId, 10) }, 
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    return prisma.user.update({
        where: { id: parseInt(user.id, 10) },
        data: { isActive: !user.isActive }
    });
}

exports.deleteAllUsers = async () => {
    await prisma.user.deleteMany({});
}