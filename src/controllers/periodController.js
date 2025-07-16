/**
 * @fileoverview Controlador para la gestión de períodos de nómina
 * @module controllers/periodController
 */

const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
const { validatePeriodCreation, loadEmployees, settlePeriod, closePeriod, deletePeriod, openPeriod } = require('../utils/periodValidation');
const { verifyId } = require('../utils/verifyId');
const settlementValidation = require('../utils/settlementValidation');

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
        const periodData = await validatePeriodCreation(req.body);
        if(periodData.errors) return next(new ValidationError('Period was not created', periodData.errors));

        const period = await periodService.create(periodData);
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
exports.openPeriod = async (req, res, next) => {
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


exports.deletePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        await removePeriod(id);
        res.json({message: 'The period was deleted successfully'});
    } catch (error) {
        next(error);
    }
}

async function removePeriod(id) {
    if (!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

    const period = await periodService.getById(id);
    if (!period) throw new NotFoundError('Period with id \'' + id + '\' was not found');

    if (period.settlements.length > 0) {
        for (const settlement of period.settlements) {
            const deletedSettlement = await settlementValidation.removeSettlement(settlement.id);
            if(!deletedSettlement) throw new Error('Error al eliminar nómina');
            console.log({message: 'Period controller: remove settlement'});
        }
    }

    const deletedPeriod = await periodService.delete(id);
    if (!deletedPeriod) throw new Error('Error al eliminar período');
    return deletedPeriod;
}