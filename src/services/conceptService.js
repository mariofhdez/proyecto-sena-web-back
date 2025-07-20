/**
 * @fileoverview Servicio para la gestión de conceptos de nómina
 * @module services/conceptService
 */

const prisma = require('../config/database');

const { NotFoundError } = require('../utils/appError');

/**
 * Obtiene todos los conceptos de nómina del sistema
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los conceptos de nómina
 * @throws {Error} Si ocurre un error al consultar los conceptos
 */
exports.getAll = async (query) => {
    const settlementNews = await prisma.concept.findMany(query);
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
    const news = await prisma.concept.findUnique({
        where: { id: id }
    });
    if (!news) throw new NotFoundError('Novedad de nómina no encontrada');
    return news;
};

/**
 * Obtiene un concepto específico por su código
 * 
 * @async
 * @function getByCode
 * @param {string} code - Código del concepto (3 caracteres)
 * @returns {Object|null} Datos del concepto encontrado o null si no existe
 */
exports.getByCode = async (code) => {
    const concept = await prisma.concept.findUnique({
        where: { code: code }
    });
    return concept;
};