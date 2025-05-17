/**
 * @fileoverview Servicio para la gestión de devengos de liquidación
 * @module services/settlementEarningsService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError, ValidationError } = require('../utils/appError');

/**
 * Obtiene todos los devengos de liquidación
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los devengos
 */
exports.getAll = async () => {
  return await prisma.settlementEarning.findMany();
};

/**
 * Obtiene un devengo específico por su ID
 * 
 * @async
 * @function getById
 * @param {number|string} id - ID del devengo a consultar
 * @returns {Object} Datos del devengo encontrado
 * @throws {NotFoundError} Si el devengo no existe
 */
exports.getById = async (id) => {
  const earning = await prisma.settlementEarning.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!earning) throw new NotFoundError('Devengo no encontrado');
  return earning;
};

/**
 * Crea un nuevo devengo de liquidación
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del devengo a crear
 * @param {number} data.employeeId - ID del empleado
 * @param {number} data.payrollPeriodId - ID del período de nómina
 * @param {number} data.baseSalary - Salario base
 * @param {number} data.transportAllowance - Subsidio de transporte
 * @param {number} data.workedDays - Días trabajados
 * @param {number} data.workedHours - Horas trabajadas
 * @param {number} data.extraHours - Horas extras
 * @param {number} data.extraHoursValue - Valor de horas extras
 * @param {number} data.nightHours - Horas nocturnas
 * @param {number} data.nightHoursValue - Valor de horas nocturnas
 * @param {number} data.holidayHours - Horas festivas
 * @param {number} data.holidayHoursValue - Valor de horas festivas
 * @param {number} data.totalEarned - Total devengado
 * @returns {Object} Datos del devengo creado
 */
exports.create = async (data) => {
  // Verificar que el PayrollNews existe
  const payrollNews = await prisma.payrollNews.findUnique({
    where: { id: data.payrollNewId }
  });

  if (!payrollNews) {
    throw new NotFoundError('La novedad de nómina no existe');
  }

  return await prisma.settlementEarning.create({
    data: {
      earningValue: data.earningValue,
      payrollNewsId: data.payrollNewId,
      settlementId: parseInt(data.settlementId)
    }
  });
};

/**
 * Actualiza un devengo de liquidación existente
 * 
 * @async
 * @function update
 * @param {number|string} id - ID del devengo a actualizar
 * @param {Object} data - Nuevos datos del devengo
 * @returns {Object} Datos del devengo actualizado
 */
exports.update = async (id, data) => {
  return await prisma.settlementEarning.update({
    where: { id: parseInt(id) },
    data: {
      settlementId: parseInt(data.settlementId,10)
    }
  });
};

/**
 * Elimina un devengo de liquidación
 * 
 * @async
 * @function remove
 * @param {number|string} id - ID del devengo a eliminar
 * @returns {Object} Datos del devengo eliminado
 */
exports.remove = async (id) => {
  return await prisma.settlementEarning.delete({
    where: { id: parseInt(id) }
  });
};
