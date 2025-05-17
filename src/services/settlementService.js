/**
 * @fileoverview Servicio para la gestión de liquidaciones
 * @module services/settlementService
 */

const { PrismaClient } = require('../../generated/prisma');
const { NotFoundError, ValidationError } = require('../utils/appError');
const prisma = new PrismaClient();

const {formatDate} = require('../utils/formatDate');

/**
 * Obtiene todas las liquidaciones
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todas las liquidaciones
 */
exports.getAll = async () => {
    return await prisma.settlement.findMany();
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
        where: { id: parseInt(id) }
    });
    
    if (!settlement) throw new NotFoundError('Liquidación no encontrada');
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
    return await prisma.settlement.create({
        data: {
            employeeId: data.employeeId,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            totalEarned: 0,
            totalDeduction: 0,
            totalPayment: 0,
            workedDays: 0,
            periodId: null,
        }
    });
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
    return await prisma.settlement.update({
        where: { id: parseInt(id) },
        data: {
            employeeId: data.employeeId,
            payrollPeriodId: data.payrollPeriodId,
            totalEarned: data.totalEarned,
            totalDeduction: data.totalDeduction,
            netPayment: data.netPayment
        }
    });
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
    return await prisma.settlement.delete({
        where: { id: parseInt(id) }
    });
};
