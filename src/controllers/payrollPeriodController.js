/**
 * @fileoverview Controlador para la gestión de períodos de nómina
 * @module controllers/payrollPeriodController
 */

const payrollPeriodService = require('../services/payrollPeriodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

/**
 * Obtiene todos los períodos de nómina
 * 
 * @async
 * @function getPeriods
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de períodos de nómina
 */
exports.getPeriods = async (req, res, next) => {
    try {
        const periods = await payrollPeriodService.getAll();
        res.json(periods);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene un período de nómina específico por su ID
 * 
 * @async
 * @function getPeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período
 * @throws {ValidationError} Si el ID no es válido
 */
exports.getPeriod = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        const period = await payrollPeriodService.getById(req.params.id);
        res.json(period);
    } catch (error) {
        next(error);
    }
};

/**
 * Crea un nuevo período de nómina
 * 
 * @async
 * @function createPeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del período a crear
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del nuevo período creado
 */
exports.createPeriod = async (req, res, next) => {
    try {
        const newPeriod = await payrollPeriodService.create(req.body);
        res.status(201).json(newPeriod);
    } catch (error) {
        next(error);
    }
};

/**
 * Actualiza un período de nómina existente
 * 
 * @async
 * @function updatePeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a actualizar
 * @param {Object} req.body - Datos actualizados del período
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período actualizado
 * @throws {ValidationError} Si el ID no es válido
 */
exports.updatePeriod = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        const updatedPeriod = await payrollPeriodService.update(req.params.id, req.body);
        res.json(updatedPeriod);
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un período de nómina
 * 
 * @async
 * @function deletePeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de confirmación
 * @throws {ValidationError} Si el ID no es válido
 */
exports.deletePeriod = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        await payrollPeriodService.remove(req.params.id);
        res.json({ mensaje: 'Período de nómina eliminado' });
    } catch (error) {
        next(error);
    }
};
