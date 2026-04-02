/**
 * @fileoverview Utilidades para la verificación de IDs en la base de datos
 * @module utils/verifyId
 */

const prisma = require('../config/database');

/**
 * Verifica si un ID existe en un modelo específico de la base de datos
 * 
 * @async
 * @function verifyId
 * @param {number|string} id - ID a verificar
 * @param {string} model - Nombre del modelo de Prisma a consultar
 * @returns {boolean} true si el ID existe, false en caso contrario
 */
async function verifyId(id, model){
  const isVerified = await prisma[model].findUnique({ where: {id: id}});
  return isVerified? true: false;
}

module.exports = { verifyId }