/**
 * @fileoverview Servicio para la gestión de novedades de nómina
 * @module services/settlementNewervice
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');
const { verifyId } = require('../utils/verifyId');

/**
 * Obtiene todas las novedades de nómina con sus relaciones
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todas las novedades de nómina con sus conceptos, empleados y liquidaciones asociadas
 */
exports.getAll = async () => {
    const settlementNews = await prisma.settlementNew.findMany({
        include: {
            concept: true,
            employee: true,
            
        }
    });
    if(!settlementNews) throw new Error('Error al consultar las Novedades');
    return settlementNews;
};

/**
 * Obtiene una novedad de nómina específica por su ID
 * 
 * @async
 * @function getById
 * @param {number|string} id - ID de la novedad a consultar
 * @returns {Object} Datos de la novedad encontrada con sus relaciones
 * @throws {NotFoundError} Si la novedad no existe
 */
exports.getById = async (id) => {
    const news = await prisma.settlementNew.findUnique({
        where: { id: id },
        include: {
            concept: true,
            employee: true,
            
        }
    });
    if (!news) throw new NotFoundError('Novedad de nómina no encontrada');
    return news;
};

/**
 * Crea una nueva novedad de nómina en el sistema
 * 
 * @async
 * @function create
 * @param {Object} data - Datos de la novedad a crear
 * @param {string|Date} data.newsDate - Fecha de la novedad
 * @param {number} data.newsQuantity - Cantidad de la novedad
 * @param {number} data.newsValue - Valor de la novedad
 * @param {number} data.payrollConceptId - ID del concepto de nómina asociado
 * @param {number} data.employeeId - ID del empleado asociado
 * @returns {Object} Datos de la novedad creada con sus relaciones
 */
exports.create = async (data) => {
    const newsettlementNew = await prisma.settlementNew.create({
        data,
        include: {
            employee: true,
            concept: true
        }
    });
    if (!newsettlementNew) throw new Error('No se pudo crear la Novedad');
    return newsettlementNew;
};

/**
 * Actualiza una novedad de nómina existente
 * 
 * @async
 * @function update
 * @param {number|string} id - ID de la novedad a actualizar
 * @param {Object} data - Datos a actualizar
 * @param {string|Date} [data.newsDate] - Fecha de la novedad
 * @param {number} [data.newsQuantity] - Cantidad de la novedad
 * @param {number} [data.newsValue] - Valor de la novedad
 * @param {number} [data.payrollConceptId] - ID del concepto de nómina
 * @param {number} [data.employeeId] - ID del empleado
 * @param {number} [data. - ID de la liquidación del empleado
 * @returns {Object} Datos de la novedad actualizada con sus relaciones
 */
exports.update = async (id, data) => {

    const verified = await verifyId(id, 'settlementNew');
    if (!verified) throw new NotFoundError('Novedad no se encuentra registrada en la base de datos');
    const updatedsettlementNew = await prisma.settlementNew.update({
        where: { id: id },
        data,
        include: {
            concept: true,
            employee: true,
            
        }
    });
    if (!updatedsettlementNew) throw new Error('No se pudo realizar al actualización a la Novedad');
    return updatedsettlementNew;
};

/**
 * Elimina una novedad de nómina del sistema
 * 
 * @async
 * @function remove
 * @param {number|string} id - ID de la novedad a eliminar
 * @returns {Object} Resultado de la operación de eliminación
 */
exports.remove = async (id) => {
    const verified = await verifyId(id, 'settlementNew');
    if (!verified) throw new NotFoundError('Novedad no se encuentra registrada en la base de datos');
    return await prisma.settlementNew.delete({where: { id: id}});
};

exports.query = async (query, includes) => {
    const settlementNews = await prisma.settlementNew.findMany({
        where: query,
        include: {
            concept: includes
        }
    });
    if (!settlementNews) throw new Error('No se encontraron novedades con los parámetros específicados');
    return settlementNews;
}

exports.toAdd = async (query) => {
    const sum = await prisma.settlementNew.aggregate({
        _sum: {
            value: true
        },
        where: query
    })
    if(!sum) throw new Error('Error al sumar las novedades de nómina');
    return sum;
}