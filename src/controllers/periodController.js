/**
 * @fileoverview Controlador para la gestión de períodos de nómina
 * @module controllers/periodController
 */

const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
// const { formatDate } = require('../utils/formatDate');
const { validatePeriodCreation, loadEmployees, createPeriod, settlePeriod, closePeriod, deletePeriod, openPeriod, draftPeriod, voidPeriod } = require('../utils/periodValidation');
const { verifyId } = require('../utils/verifyId');

/**
 * Obtiene todos los períodos de nómina del sistema
 * 
 * @async
 * @function retrievePeriods
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.query - Parámetros de consulta (opcional)
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de períodos
 * @throws {Error} Si ocurre un error al consultar los períodos
 */
exports.retrievePeriods = async (req, res, next) => {
    try {
        const queryParams = req.query;
        if(Object.keys(queryParams).length > 0) {
            const periods = await periodService.getAll(queryParams);
            res.json(periods);
        } else {
            const periods = await periodService.getAll();
            res.json(periods);
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene un período específico por su ID
 * 
 * @async
 * @function getPeriodById
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período
 * @throws {ValidationError} Si el ID no es válido
 */
exports.getPeriodById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const period = await periodService.getById(id);
        res.json(period);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea un nuevo período de nómina
 * 
 * @async
 * @function createPeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del período a crear
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período creado
 * @throws {ValidationError} Si los datos del período no son válidos
 */
exports.createPeriod = async (req, res, next) => {
    try {
        const validation = await validatePeriodCreation(req.body);
        if(!validation.isValid) throw new ValidationError('Period was not created', validation.errors);

        const period = await createPeriod(req.body);
        res.status(201).json(period);
    } catch (error) {
        next(error);
    }
}

/**
 * Liquida un período de nómina
 * 
 * @async
 * @function settlePeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a liquidar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período liquidado
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el período no existe
 * @throws {Error} Si el período no se puede liquidar
 */
exports.settlePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');
        
        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) {
            return next(new NotFoundError('Period with id \'' + id + '\' was not found'));
        }

        const settledPeriod = await settlePeriod(id);
        if(!settledPeriod) throw new Error('Period was not settled');
        res.json(settledPeriod);

    } catch (error) {
        next(error);
    }
}

/**
 * Cierra un período de nómina
 * 
 * @async
 * @function closePeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a cerrar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período cerrado
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el período no existe
 * @throws {Error} Si el período no se puede cerrar
 */
exports.closePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) throw new NotFoundError('Period with id \'' + id + '\' was not found');

        const closedPeriod = await closePeriod(id);
        if(!closedPeriod) throw new Error('Period was not closed');
        res.json(closedPeriod);
    } catch (error) {
        next(error);
    }
}

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
 * @throws {NotFoundError} Si el período no existe
 */
exports.deletePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');
        
        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) throw new NotFoundError('Period with id \'' + id + '\' was not found');
        
        const period = await deletePeriod(id);

        res.json('The period was deleted successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * Carga empleados a un período específico
 * 
 * @async
 * @function loadEmployees
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período
 * @param {Object} req.body - Datos de la solicitud
 * @param {Array} req.body.employees - Lista de empleados a cargar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período actualizado
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el período no existe
 */
exports.loadEmployees = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) {
            return next(new NotFoundError('Period with id \'' + id + '\' was not found'));
        }

        const employees = req.body.employees;
        const period = await loadEmployees(id, employees, next);
        res.json(period);
    } catch (error) {
        next(error);
    }
}

/**
 * Abre un período de nómina
 * 
 * @async
 * @function openPeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a abrir
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período abierto
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el período no existe
 * @throws {Error} Si el período no se puede abrir
 */
exports.openPeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) throw new NotFoundError('Period with id \'' + id + '\' was not found');

        const openedPeriod = await openPeriod(id);
        if(!openedPeriod) throw new Error('Period was not opened');
        res.json(openedPeriod);
    } catch (error) {
        next(error);
    }
}

/**
 * Revierte la liquidación de un período (lo convierte a borrador)
 * 
 * @async
 * @function reversePeriodSettle
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a revertir
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período en borrador
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el período no existe
 * @throws {Error} Si el período no se puede revertir
 */
exports.reversePeriodSettle = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) throw new NotFoundError('Period with id \'' + id + '\' was not found');

        const draftedPeriod = await draftPeriod(id);
        if(!draftedPeriod) throw new Error('Period was not drafted');
        res.json(draftedPeriod);
    } catch (error) {
        next(error);
    }
}

/**
 * Anula un período de nómina
 * 
 * @async
 * @function voidPeriod
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del período a anular
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del período anulado
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si el período no existe
 * @throws {Error} Si el período no se puede anular
 */
exports.voidPeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const isValidPeriod = await verifyId(id, "period");
        if (!isValidPeriod) throw new NotFoundError('Period with id \'' + id + '\' was not found');

        const voidedPeriod = await voidPeriod(id);
        if(!voidedPeriod) throw new Error('Period was not voided');
        res.json(voidedPeriod);
    } catch (error) {
        next(error);
    }
}