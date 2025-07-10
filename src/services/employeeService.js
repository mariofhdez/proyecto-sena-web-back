/**
 * @fileoverview Servicio para la gestión de empleados
 * @module services/employeeService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError, ValidationError } = require('../utils/appError');

/**
 * Obtiene todos los empleados del sistema
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los empleados
 */
exports.getAll = async () => {
  const employees = await prisma.employee.findMany();
  if (!employees) throw NotFoundError('Error al consultar empleados');
  return employees;
};

/**
 * Obtiene un empleado específico por su ID
 * 
 * @async
 * @function getById
 * @param {number|string} id - ID del empleado a consultar
 * @returns {Object} Datos del empleado encontrado
 * @throws {NotFoundError} Si el empleado no existe
 */
exports.getById = async (id) => {
  const employee = await prisma.employee.findUnique({ where: { id: id } });
  if (!employee) throw new NotFoundError('Empleado no encontrado');
  return employee;
};

/**
 * Crea un nuevo empleado en el sistema
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del empleado a crear
 * @returns {Object} Datos del empleado creado
 */
exports.create = async (data) => {
  const newEmployee = await prisma.employee.create({ data });
  if (!newEmployee) throw new Error('No se pudo crear el empleado')
  return newEmployee;
};

/**
 * Actualiza los datos de un empleado existente
 * 
 * @async
 * @function update
 * @param {number|string} id - ID del empleado a actualizar
 * @param {Object} data - Nuevos datos del empleado
 * @returns {Object} Datos del empleado actualizado
 */
exports.update = async (id, data) => {
  const updatedEmployee = await prisma.employee.update({
    where: { id: id },
    data
  });
  if (!updatedEmployee) throw new Error('No se pudo actualizar empleado')
  return updatedEmployee;
};

/**
 * Elimina un empleado del sistema
 * 
 * @async
 * @function remove
 * @param {number|string} id - ID del empleado a eliminar
 * @returns {Object} Datos del empleado eliminado
 * @throws {ValidationError} Si el empleado tiene liquidaciones asociadas
 */
exports.remove = async (id) => {
  // Verificar si el empleado tiene liquidaciones asociadas
  const settlements = await prisma.settlement.findMany({
    where: { employeeId: parseInt(id) }
  });

  if (settlements.length > 0) {
    throw new ValidationError('No se puede eliminar el empleado porque tiene liquidaciones asociadas');
  }

  // Verificar si el empleado tiene detalles de liquidación asociados
  const settlementDetails = await prisma.settlementDetail.findMany({
    where: { employeeId: parseInt(id) }
  });

  if (settlementDetails.length > 0) {
    throw new ValidationError('No se puede eliminar el empleado porque tiene detalles de liquidación asociados');
  }

  // Verificar si el empleado tiene novedades asociadas
  const novelties = await prisma.novelty.findMany({
    where: { employeeId: parseInt(id) }
  });
  if (novelties.length > 0) {
    throw new ValidationError('No se puede eliminar el empleado porque tiene novedades asociadas');
  }

  const deletedEmployee = await prisma.employee.delete({ where: { id: parseInt(id) } });
  if (!deletedEmployee) throw new Error('No se pudo eliminar el empleado')
  return deletedEmployee;
};

exports.getEmployeeByIdentification = async (identification) => {
  const employee = await prisma.employee.findFirst({ where: { identification: identification } });
  return employee;
};
