/**
 * @fileoverview Servicio para la gestión de períodos de nómina
 * @module services/payrollPeriodService
 */

const { PrismaClient } = require('../../generated/prisma');
const { NotFoundError, ValidationError } = require('../utils/appError');
const prisma = new PrismaClient();

/**
 * Obtiene todos los períodos de nómina
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los períodos de nómina
 */
exports.getAll = async () => {
    return await prisma.payrollPeriod.findMany();
};

/**
 * Obtiene un período de nómina específico por su ID
 * 
 * @async
 * @function getById
 * @param {number|string} id - ID del período a consultar
 * @returns {Object} Datos del período encontrado
 * @throws {NotFoundError} Si el período no existe
 */
exports.getById = async (id) => {
    const period = await prisma.payrollPeriod.findUnique({
        where: { id: parseInt(id) }
    });
    
    if (!period) throw new NotFoundError('Período no encontrado');
    return period;
};

/**
 * Crea un nuevo período de nómina
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del período a crear
 * @param {string|Date} data.startDate - Fecha de inicio del período
 * @param {string|Date} data.endDate - Fecha de fin del período
 * @param {number} [data.employeesCount] - Cantidad de empleados en el período
 * @param {number} [data.totalEarned] - Total de ingresos en el período
 * @param {number} [data.totalDeduction] - Total de deducciones en el período
 * @param {number} [data.totalPayment] - Total de pagos en el período
 * @param {string|Date} [data.settlementDate] - Fecha de liquidación
 * @returns {Object} Datos del período creado
 * @throws {ValidationError} Si faltan las fechas de inicio o fin
 */
exports.create = async (data) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toISOString();
      };

    if (!data.startDate || !data.endDate) {
        throw new ValidationError('Las fechas de inicio y fin son requeridas');
    }

    return await prisma.payrollPeriod.create({
        data: {
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            employeesCount: data.employeesCount,
            totalEarned: data.totalEarned,
            totalDeduction: data.totalDeduction,
            totalPayment: data.totalPayment,
            settlementDate: formatDate(data.settlementDate)
        }
    });
};

/**
 * Actualiza un período de nómina existente
 * 
 * @async
 * @function update
 * @param {number|string} id - ID del período a actualizar
 * @param {Object} data - Datos a actualizar
 * @param {string|Date} [data.startDate] - Fecha de inicio del período
 * @param {string|Date} [data.endDate] - Fecha de fin del período
 * @param {string} [data.status] - Estado del período
 * @param {string} [data.description] - Descripción del período
 * @returns {Object} Datos del período actualizado
 * @throws {NotFoundError} Si el período no existe
 */
exports.update = async (id, data) => {
    const period = await this.getById(id);

    return await prisma.payrollPeriod.update({
        where: { id: parseInt(id) },
        data: {
            startDate: data.startDate ? new Date(data.startDate) : period.startDate,
            endDate: data.endDate ? new Date(data.endDate) : period.endDate,
            status: data.status || period.status,
            description: data.description || period.description
        }
    });
};

/**
 * Elimina un período de nómina
 * 
 * @async
 * @function remove
 * @param {number|string} id - ID del período a eliminar
 * @returns {Object} Resultado de la operación de eliminación
 * @throws {NotFoundError} Si el período no existe
 */
exports.remove = async (id) => {
    await this.getById(id);
    
    return await prisma.payrollPeriod.delete({
        where: { id: parseInt(id) }
    });
};
