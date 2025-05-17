/**
 * @fileoverview Servicio para la gestión de novedades de nómina
 * @module services/payrollNewService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');

const {formatDate} = require('../utils/formatDate')

/**
 * Obtiene todas las novedades de nómina con sus relaciones
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todas las novedades de nómina con sus conceptos, empleados y liquidaciones asociadas
 */
exports.getAll = async () => {
    return await prisma.payrollNews.findMany({
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
        }
    });
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
    const news = await prisma.payrollNews.findUnique({
        where: { id: parseInt(id) },
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
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
    

    return await prisma.payrollNews.create({
        data: {
            newsDate: formatDate(data.newsDate),
            newsQuantity: data.newsQuantity,
            newsValue: data.newsValue,
            payrollConcept: {
                connect: {
                    id: data.payrollConceptId
                }
            },
            employee: {
                connect: {
                    id: data.employeeId
                }
            },
            status: 'OPEN'
        },
        include: {
            payrollConcept: true,
            employee: true
        }
    });
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
 * @param {number} [data.employeeSettlementId] - ID de la liquidación del empleado
 * @returns {Object} Datos de la novedad actualizada con sus relaciones
 */
exports.update = async (id, data) => {
    return await prisma.payrollNews.update({
        where: { id: parseInt(id) },
        data: {
            newsDate: data.newsDate ? new Date(data.newsDate) : undefined,
            newsQuantity: data.newsQuantity,
            newsValue: data.newsValue,
            payrollConceptId: data.payrollConceptId,
            employeeId: data.employeeId,
            employeeSettlementId: data.employeeSettlementId
        },
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
        }
    });
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
    return await prisma.payrollNews.delete({
        where: { id: parseInt(id) }
    });
};