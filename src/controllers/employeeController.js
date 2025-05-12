const employeeService = require('../services/employeeService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    if(!isValidNumericType(parseInt(req.params.id), 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');

    const employee = await employeeService.getById(req.params.id);
    if (!employee) throw new NotFoundError('Empleado no encontrado' );
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const newEmployee = await employeeService.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear empleado', detalle: error.message });
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const updatedEmployee = await employeeService.update(req.params.id, req.body);
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar empleado', detalle: error.message });
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.remove(req.params.id);
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar empleado', detalle: error.message });
  }
};
