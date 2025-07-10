/**
 * @fileoverview Controlador para la gestión de períodos de nómina
 * @module controllers/periodController
 */

const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
const { validatePeriodCreation } = require('../utils/periodValidation');

/**
 * Obtiene todos los períodos de nómina del sistema
 */
exports.retrievePeriods = async (req, res, next) => {
    try {
        const periods = await periodService.getAll();
        res.json(periods);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene un período específico por su ID
 */
exports.getPeriodById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const period = await periodService.getById(id);
        res.json(period);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene el período abierto actual
 */
exports.getOpenPeriod = async (req, res, next) => {
    try {
        const openPeriod = await getOpenPeriod();
        res.json(openPeriod);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea un nuevo período de nómina
 */
exports.createPeriod = async (req, res, next) => {
    try {
        const validation = await validatePeriodCreation(req.body);
        if(!validation.isValid) {
            throw new ValidationError('Period was not created', validation.errors);
        }

        const period = await periodService.create(req.body);
        res.status(201).json(period);
    } catch (error) {
        next(error);
    }
}

/**
 * Actualiza un período de nómina
 */
exports.updatePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const period = await updatePeriod(id, req.body);
        res.json(period);
    } catch (error) {
        next(error);
    }
}

/**
 * Cierra un período de nómina
 */
exports.closePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const closedPeriod = await closePeriod(id);
        res.json(closedPeriod);
    } catch (error) {
        next(error);
    }
}

/**
 * Abre un período de nómina
 */
exports.openPeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const openedPeriod = await openPeriod(id);
        res.json(openedPeriod);
    } catch (error) {
        next(error);
    }
}

/**
 * Elimina un período de nómina
 */
exports.deletePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }
        
        await periodService.delete(id);
        res.json({ message: 'Period deleted successfully' });
    } catch (error) {
        next(error);
    }
}