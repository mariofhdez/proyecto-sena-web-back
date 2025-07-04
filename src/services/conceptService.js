/**
 * @fileoverview Servicio para la gestión de conceptos de nómina
 * @module services/conceptService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');

/**
 * Obtiene todos los conceptos de nómina del sistema
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los conceptos de nómina
 * @throws {Error} Si ocurre un error al consultar los conceptos
 */
exports.getAll = async () => {
    const settlementNews = await prisma.payrollConcept.findMany({});
    if(!settlementNews) throw new Error('Error al consultar las Novedades');
    return settlementNews;
};

/**
 * Obtiene un concepto específico por su ID
 * 
 * @async
 * @function getById
 * @param {number} id - ID del concepto a consultar
 * @returns {Object} Datos del concepto encontrado
 * @throws {NotFoundError} Si el concepto no existe
 */
exports.getById = async (id) => {
    const news = await prisma.payrollConcept.findUnique({
        where: { id: id }
    });
    if (!news) throw new NotFoundError('Novedad de nómina no encontrada');
    return news;
};