/**
 * @fileoverview Controlador para la gestión de empleados
 * @module controllers/employeeController
 */

const employeeService = require('../services/employeeService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

/**
 * Obtiene todos los empleados del sistema
 * 
 * @async
 * @function getEmployees
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de empleados
 */
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un empleado específico por su ID
 * 
 * @async
 * @function getEmployee
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del empleado a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del empleado
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el empleado no existe
 */
exports.getEmployee = async (req, res, next) => {
  try {
    if (!isValidNumericType(parseInt(req.params.id), 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');

    const employee = await employeeService.getById(parseInt(req.params.id));
    // if (!employee) throw new NotFoundError('Empleado no encontrado' );
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo empleado en el sistema
 * 
 * @async
 * @function createEmployee
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del empleado a crear
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del empleado creado
 */
exports.createEmployee = async (req, res, next) => {
  try {
    const data = {
      identification: req.body.identification,
      firstSurname: req.body.firstSurname,
      firstName: req.body.firstName,
      secondSurname: req.body.secondSurname,
      otherNames: req.body.otherNames,
      salary: req.body.salary,
      transportAllowance: req.body.transportAllowance,
      isActive: req.body.isActive,
    }
    const newEmployee = await employeeService.create(data);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear empleado', detalle: error.message });
  }
};

/**
 * Actualiza la información de un empleado existente
 * 
 * @async
 * @function updateEmployee
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del empleado a actualizar
 * @param {Object} req.body - Datos a actualizar del empleado
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del empleado actualizado
 */
exports.updateEmployee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedEmployee = await employeeService.update(id, data);
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Elimina un empleado del sistema
 * 
 * @async
 * @function deleteEmployee
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del empleado a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de confirmación
 */
exports.deleteEmployee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await employeeService.remove(id);
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
