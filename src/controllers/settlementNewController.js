/**
 * @fileoverview Controlador para la gestión de novedades de nómina
 * @module controllers/payrollNewController
 */

const settlementNewService = require('../services/settlementNewService');
const conceptService = require('../services/conceptService');
const employeeService = require('../services/employeeService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');  
const {formatDate} = require('../utils/formatDate');
const { verifyId } = require('../utils/verifyId');

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
exports.retrieveNews = async (req, res, next) => {
    try {
        const settlementNews = await settlementNewService.getAll();
        res.json(settlementNews);
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
exports.getNewById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (!isValidNumericType( id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const settlementNew = await settlementNewService.getById(id);
        res.json(settlementNew);
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
        const data = {
            date: formatDate(req.body.date),
            quantity: req.body.quantity,
            value: req.body.value,
            status: 'OPEN',
            concept: {
                connect: { id: parseInt(req.body.conceptId, 10) }
            },
            employee: {
                connect: { id: parseInt(req.body.employeeId, 10) }
            }
        }

        const isValidConcept = await verifyId(parseInt(req.body.conceptId, 10),'payrollConcept');
        if(!isValidConcept) throw new ValidationError('El concepto no se encuentra registrado en base de datos');

        const isValidEmployee = await verifyId(parseInt(req.body.employeeId, 10), 'employee');
        if(!isValidEmployee) throw new ValidationError('El employee no se encuentra registrado en base de datos');

        const createdSettlementNew = await settlementNewService.create(data);
        res.status(201).json(createdSettlementNew);
    } catch (error) {
        // res.status(500).json({error: error.message});
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
        const id = parseInt(req.params.id);
        const data = req.body;
        if (!isValidNumericType( id)) {
            throw new ValidationError('El campo \'id\' debe ser un valor numérico.');
        }

        const updatedNews = await settlementNewService.update(id, data);
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
        const id = parseInt(req.params.id);
        if (!isValidNumericType( id)) {
            throw new ValidationError('El campo \'id\' debe ser un valor numérico.');
        }

        await settlementNewService.remove(id);
        res.json({ mensaje: 'Novedad de nómina eliminada' });
    } catch (error) {
        next(error);
    }
};

exports.getNewWithParams = async (req, res, next) => {
    try {
        const query = {
            employeeId: parseInt(req.query.employeeId, 10),
            date: {
                gte: formatDate(req.query.startDate),
                lte: formatDate(req.query.endDate)
            },
        }
        if (req.query.conceptType === 'DEVENGADO') {
            query.conceptId = {
                lte: 40
            }
        }
        if (req.query.conceptType === 'DEDUCCION') {
            query.conceptId = {
                gte: 40
            }
        }
        const settlementNews = await settlementNewService.query(query);
        res.json(settlementNews);
    } catch (error) {
        next(error);
    }
};