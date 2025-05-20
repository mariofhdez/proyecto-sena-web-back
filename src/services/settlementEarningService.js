/**
 * @fileoverview Servicio para la gestión de devengos de liquidación
 * @module services/settlementEarningsService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { ValidationError } = require('../utils/appError');
const { verifyId } = require('../utils/verifyId');

/**
 * Obtiene todos los devengos de liquidación
 * p
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los devengos
 */
exports.getAll = async () => {
  const earnings = await prisma.settlementEarning.findMany();
  if (!earnings) throw new Error('No se encontraron Devengados');
  return earnings;
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
    where: { id: id },
    include: {
      news: true
    }
  });
  if (!earning) throw new Error('Devengados no encontrados');
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
  const newEarning = await prisma.settlementEarning.create({
    data: data
  });
  if (!newEarning) throw new Error('No se pudo crear el Devengado');
  return newEarning;
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
  const isValidId = await verifyId(id, 'settlementEarning');
  if (!isValidId) throw new ValidationError('El Devengado no se encuentra registrado en base de datos');

  const updatedSettlementEarning = await prisma.settlementEarning.update({
    where: { id: id },
    data: data
  });
  if (!updatedSettlementEarning) throw new Error('No se pudo realizar al actualización al Devengado');
  return updatedSettlementEarning;
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
  const isValidId = await verifyId(id, 'settlementEarning');
  if (!isValidId) throw new ValidationError('El Devengado no se encuentra registrado en base de datos');
  return await prisma.settlementEarning.delete({where: { id: parseInt(id) }
  });
};
