/**
 * @fileoverview Servicio para la gestión de liquidaciones
 * @module services/settlementService
 */

const prisma = require('../config/database');
const { NotFoundError } = require('../utils/appError');

const { verifyId } = require('../utils/verifyId');

/**
 * Obtiene todas las liquidaciones
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todas las liquidaciones
 */
exports.getAll = async (query) => {
    let where = {
        status: { not: 'VOID'},
        ...query
    }
    const settlements = await prisma.settlement.findMany({
        include: {
            details: true,
            employee: true
        },
        where: where
    });
    if (!settlements) throw new NotFoundError('Settlements were not found');
    return settlements;
};

/**
 * Obtiene una liquidación específica por su ID
 * 
 * @async
 * @function getById
 * @param {number|string} id - ID de la liquidación a consultar
 * @returns {Object} Datos de la liquidación encontrada
 * @throws {NotFoundError} Si la liquidación no existe
 */
exports.getById = async (id) => {
    const settlement = await prisma.settlement.findUnique({
        where: { id: id },
        include: {
            employee: true,
            period: true,
            details: {include: {concept: true}}
        }
    });
    if (!settlement) throw new NotFoundError('Settlement with id \'' + id + '\' was not found');
    return settlement;
};

/**
 * Crea una nueva liquidación
 * 
 * @async
 * @function create
 * @param {Object} data - Datos de la liquidación a crear
 * @param {number} data.employeeId - ID del empleado
 * @param {number} data.payrollPeriodId - ID del período de nómina
 * @param {number} data.totalEarned - Total devengado
 * @param {number} data.totalDeduction - Total deducido
 * @param {number} data.netPayment - Pago neto
 * @returns {Object} Datos de la liquidación creada
 */
exports.create = async (data) => {
    const newSettlement = await prisma.settlement.create({
        data,
        include: {
            details: true
        }
    });
    if (!newSettlement) throw new Error('Settlement was not created');
    return newSettlement;
};

/**
 * Actualiza una liquidación existente
 * 
 * @async
 * @function update
 * @param {number|string} id - ID de la liquidación a actualizar
 * @param {Object} data - Nuevos datos de la liquidación
 * @returns {Object} Datos de la liquidación actualizada
 */
exports.update = async (id, data) => {
    const isValidId = await verifyId(id, 'settlement');
    if (!isValidId) throw new NotFoundError('Settlement with id \'' + id + '\' was not found');
    const updatedSettlement = await prisma.settlement.update({
        where: { id: id },
        data,
        include: {
            details: true,
            employee: true
        }
    });
    if (!updatedSettlement) throw new Error('Settlement was not updated');
    return updatedSettlement;
};

/**
 * Elimina una liquidación
 * 
 * @async
 * @function remove
 * @param {number|string} id - ID de la liquidación a eliminar
 * @returns {Object} Datos de la liquidación eliminada
 */
exports.remove = async (id) => {
    const isValidId = await verifyId(id, 'settlement');
    if (!isValidId) throw new NotFoundError('Settlement with id \'' + id + '\' was not found');
    const deletedSettlement = await prisma.settlement.delete({where: { id: id }});
    if (!deletedSettlement) throw new Error('Settlement was not deleted');
    return deletedSettlement;
};

exports.count = async (query) => {
    const count = await prisma.settlement.count({
        where: query
    })
    return count;
}