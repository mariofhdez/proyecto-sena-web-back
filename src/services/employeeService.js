/**
 * @fileoverview Servicio para la gestión de empleados
 * @module services/employeeService
 */

const prisma = require('../config/database');

const { NotFoundError, ValidationError } = require('../utils/appError');

/**
 * Obtiene todos los empleados del sistema
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los empleados
 */
exports.getAll = async (data) => {
  const employees = await prisma.employee.findMany(data);
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
 */
exports.remove = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id: id },
    include: {
      novelties: true,
      settlements: true
    }
  });
  if (!employee) throw new NotFoundError('Empleado no encontrado');
  if (employee.novelties.length > 0) throw new ValidationError('Employee was not deleted','The employee has novelties');
  if (employee.settlements.length > 0) throw new ValidationError('Employee was not deleted','The employee has settlements');
  const deletedEmployee = await prisma.employee.delete({ where: { id: id } });
  if (!deletedEmployee) throw new Error('No se pudo eliminar el empleado')
  return deletedEmployee;
};

exports.getEmployeeByIdentification = async (identification) => {
  const employee = await prisma.employee.findFirst({ where: { identification: identification } });
  return employee;
};

exports.toggleEmployeeStatus = async (id) => {
  const employee = await prisma.employee.findFirst({
    where: {id: parseInt(id, 10)}
  })

  if(!employee) throw new NotFoundError('Employee was not found');

  return prisma.employee.update({
    where: { id: parseInt(employee.id,10)},
    data: { isActive: !employee.isActive}
  })
}
