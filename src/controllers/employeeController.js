/**
 * @fileoverview Controlador para la gestión de empleados
 * @module controllers/employeeController
 */

const employeeService = require('../services/employeeService');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { isValidNumericType, isNull } = require('../utils/typeofValidations');
const { validateNewEmployee, validateUniqueEmployee, validateUpdatedEmployee, employeeData } = require('../utils/employeeValidation');
const { verifyId } = require('../utils/verifyId');

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
    const identification = req.query.identification;
  
    if(identification) {
      const employee = await getEmployeeByIdentification(identification);
      if(!employee) throw new NotFoundError('Employee with identification \'' + identification + '\' was not found');
      res.json(employee);
    } else {
      const employees = await getAllEmployees();
      res.json(employees);
    }
  } catch (error) {
    next(error);
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
    const id = parseInt(req.params.id);
    if (!isValidNumericType(id)) throw new ValidationError('Field id must be a number type');
    
    const employee = await employeeService.getById(id);
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
    // Valida que los datos del empleado sean correctos
    const validation = validateNewEmployee(req.body);
    if(!validation.isValid) throw new ValidationError('Employee was not created', validation.errors);

    // Valida que la identificación no exista
    const isUniqueEmployee = await validateUniqueEmployee(req.body.identification);
    if(!isUniqueEmployee) throw new ValidationError('Employee was not created', "The employee with identification \'" + req.body.identification + "\' already exists");

    const data = {
      identification: req.body.identification,
      firstSurname: req.body.firstSurname,
      firstName: req.body.firstName,
      secondSurname: req.body.secondSurname,
      otherNames: req.body.otherNames,
      salary: req.body.salary,
      transportAllowance: req.body.transportAllowance,
      isActive: true,
      position: req.body.position
    }
    const newEmployee = await employeeService.create(data);
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
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
    // Convierte el id a un numero
    const id = parseInt(req.params.id);
    // Valida que el id sea un numero
    if (!isValidNumericType(id)) throw new ValidationError('Field id must be a number type');
    // Valida que el empleado exista
    const verified = await verifyId(id, "employee");
    if (!verified) throw new NotFoundError('Employee with id \'' + id + '\' was not found');
    // Valida que los datos en el request sean correctos
    const validation = validateUpdatedEmployee(req.body);
    if(!validation.isValid) {
      throw new ValidationError('Employee was not updated', validation.errors);
    }

    // Valida que la identificación no exista
    if(!isNull(req.body.identification)) {
      const isUniqueIdentification = await validateUniqueEmployee(req.body.identification);
      if(!isUniqueIdentification) {
        throw new ValidationError('Employee was not updated', "The employee with identification \'" + req.body.identification + "\' already exists");
      }
    }    
    const data = employeeData(req.body);
    const updatedEmployee = await employeeService.update(id, data);
    // console.log(res.json(updatedEmployee));
    res.json(updatedEmployee);
  } catch (error) {
    next(error);
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
    // Validar que el id sea un numero
    const id = parseInt(req.params.id);
    if (!isValidNumericType(id)) throw new ValidationError('Field id must be a number type');
     // Valida que el empleado exista
     const verified = await verifyId(id, "employee");
     if (!verified) throw new NotFoundError('Employee with id \'' + id + '\' was not found');
    await employeeService.remove(id);
    res.json({ message: 'Employee was deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getActiveEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAll({ where: { isActive: true } });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};


getAllEmployees = async () => {
  const employees = await employeeService.getAll();
  return employees;
}

getEmployeeByIdentification = async (identification) => {
  if (isNull(identification)) throw new ValidationError('Field identification is required');
  const employee = await employeeService.getEmployeeByIdentification(identification);
  return employee;
}