/**
 * @fileoverview Servicio para la gestión de usuarios
 * @module services/userService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

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