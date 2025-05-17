/**
 * @fileoverview Controlador para la gestión de novedades de nómina
 * @module controllers/payrollNewController
 */

const settlementNewService = require('../services/settlementNewService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

/**
 * Obtiene todas las novedades de nómina
 * 
 * @async
 * @function getNews
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de novedades de nómina
 */
exports.getNews = async (req, res, next) => {
    try {
        const news = await settlementNewService.getAll();
        res.json(news);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene una novedad de nómina específica por su ID
 * 
 * @async
 * @function getNew
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la novedad a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos de la novedad
 * @throws {ValidationError} Si el ID no es válido
 */
exports.getNew = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        const news = await settlementNewService.getById(req.params.id);
        res.json(news);
    } catch (error) {
        next(error);
    }
};

/**
 * Crea una nueva novedad de nómina
 * 
 * @async
 * @function createNew
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la novedad a crear
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la novedad creada
 */
exports.createNew = async (req, res, next) => {
    try {
        const newPayrollNews = await settlementNewService.create(req.body);
        res.status(201).json(newPayrollNews);
    } catch (error) {
        next(error);
    }
};

/**
 * Actualiza una novedad de nómina existente
 * 
 * @async
 * @function updateNew
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la novedad a actualizar
 * @param {Object} req.body - Datos actualizados de la novedad
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la novedad actualizada
 * @throws {ValidationError} Si el ID no es válido
 */
exports.updateNew = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        const updatedNews = await settlementNewService.update(req.params.id, req.body);
        res.json(updatedNews);
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina una novedad de nómina
 * 
 * @async
 * @function deleteNew
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la novedad a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de confirmación
 * @throws {ValidationError} Si el ID no es válido
 */
exports.deleteNew = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        await settlementNewService.remove(req.params.id);
        res.json({ mensaje: 'Novedad de nómina eliminada' });
    } catch (error) {
        next(error);
    }
};