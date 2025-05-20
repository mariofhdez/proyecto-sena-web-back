/**
 * @fileoverview Servicio para la gestión de liquidaciones
 * @module services/settlementService
 */

const { PrismaClient } = require('../../generated/prisma');
const { ValidationError } = require('../utils/appError');
const prisma = new PrismaClient();

const { verifyId } = require('../utils/verifyId');

/**
 * Obtiene todas las liquidaciones
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todas las liquidaciones
 */
exports.getAll = async () => {
    const settlements = await prisma.settlement.findMany({
        include: {
            earnings: true,
            deductions: true,
            employee: true
        }
    });
    if (!settlements) throw new Error('Error al consultar las Nóminas');
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
            earnings: true,
            deductions: true,
            employee: true
        }
    });
    if (!settlement) throw new Error('Nómina no encontrada');
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
            earnings: true,
            deductions: true
        }
    });
    if (!newSettlement) throw new Error('No se pudo crear la Nómina');
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
    if (!isValidId) throw new ValidationError('La nómina  no se encuentra registrada en base de datos');
    const updatedSettlement = await prisma.settlement.update({
        where: { id: id },
        data,
        include: {
            earnings: true,
            deductions: true,
            employee: true
        }
    });
    if (!updatedSettlement) throw new Error('No se pudo actualizar la Nómina');
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
    if (!isValidId) throw new ValidationError('La nómina  no se encuentra registrada en base de datos');
    return await prisma.settlement.delete({where: { id: id }});
};
