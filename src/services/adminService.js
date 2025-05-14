/**
 * @fileoverview Servicio para la gestión de usuarios por parte del administrador
 * @module services/adminService
 */

const { PrismaClient } = require('../../generated/prisma');
const { NotFoundError } = require('../utils/appError');
const prisma = new PrismaClient();

/**
 * Obtiene todos los usuarios del sistema
 * 
 * @async
 * @function getUsersService
 * @returns {Array<Object>} Lista de usuarios con información básica
 */
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

/**
 * Obtiene un usuario específico por su ID
 * 
 * @async
 * @function getUserById
 * @param {number|string} id - ID del usuario a consultar
 * @returns {Object} Datos del usuario encontrado
 * @throws {NotFoundError} Si el usuario no existe
 */
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
 * Desactiva un usuario en el sistema
 * 
 * @async
 * @function deactivateUser
 * @param {number|string} userId - ID del usuario a desactivar
 * @returns {Object} Resultado de la operación de actualización
 * @throws {NotFoundError} Si el usuario no existe
 */
exports.deactivateUser = async (userId) => {
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
        data: { isActive: false }
    });
}

/**
 * Elimina permanentemente un usuario del sistema
 * 
 * @async
 * @function deleteUser
 * @param {number|string} userId - ID del usuario a eliminar
 * @returns {Object} Resultado de la operación de eliminación
 * @throws {NotFoundError} Si el usuario no existe
 */
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