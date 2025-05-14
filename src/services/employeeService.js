/**
 * @fileoverview Servicio para la gestión de empleados
 * @module services/employeeService
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');

/**
 * Obtiene todos los empleados del sistema
 * 
 * @async
 * @function getAll
 * @returns {Array<Object>} Lista de todos los empleados
 */
exports.getAll = async () => {
  return await prisma.employee.findMany();
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
  const user = await prisma.employee.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new NotFoundError('Usuario no encontrado');
  return user;
};

/**
 * Crea un nuevo empleado en el sistema
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del empleado a crear
 * @param {string} data.firstSurname - Primer apellido del empleado
 * @param {string} data.firstName - Primer nombre del empleado
 * @param {string} data.secondSurname - Segundo apellido del empleado
 * @param {string} data.otherNames - Otros nombres del empleado
 * @param {string} data.identification - Número de identificación
 * @param {Object} data.address - Información de dirección
 * @param {Object} data.payment - Información de pago
 * @param {Object} data.contract - Información del contrato
 * @returns {Object} Datos del empleado creado
 */
exports.create = async (data) => {
  // Formatear las fechas al formato ISO
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString();
  };

  return await prisma.employee.create({ 
    data: {
      firstSurname: data.firstSurname,
      firstName: data.firstName,
      secondSurname: data.secondSurname,
      otherNames: data.otherNames,
      identification: data.identification,
      identificationType: {
        connect: {
          id: data.identificationType
        }
      },
      address: {
        create: {
          address: data.address.address,
          cityId: data.address.city,
          stateId: data.address.state
        }
      },
      paymentData: {
        create: {
          paymentMethodId: data.payment.paymentMethod,
          accountNumber: data.payment.bankAccount,
          bankEntity: data.payment.bank,
          isActive: true
        }
      },
      contracts: {
        create: {
          pensionRisk: data.contract.risk,
          integralSalary: data.contract.integralSalary,
          salary: data.contract.salary,
          startDate: formatDate(data.contract.startDate),
          endDate: formatDate(data.contract.endDate),
          position: data.contract.position,
          workerType: {
            connect: {
              id: data.contract.workerType
            }
          },
          workerSubtype: {
            connect: {
              id: data.contract.workerSubtype
            }
          },
          contractType: {
            connect: {
              id: data.contract.type
            }
          },
          address: {
            create: {
              address: data.address.address,
              cityId: data.address.city,
              stateId: data.address.state
            }
          }
        }
      }
    } 
  });
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
  return await prisma.employee.update({
    where: { id: parseInt(id) },
    data
  });
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
  return await prisma.employee.delete({ where: { id: parseInt(id) } });
};
