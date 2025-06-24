const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
// const { formatDate } = require('../utils/formatDate');
const { validatePeriodCreation, loadEmployees, createPeriod, settlePeriod, closePeriod, deletePeriod, openPeriod, draftPeriod, voidPeriod } = require('../utils/periodValidation');
const { verifyId } = require('../utils/verifyId');

exports.retrievePeriods = async (req, res, next) => {
    try {
        const queryParams = req.query;
        if(Object.keys(queryParams).length > 0) {
            // TODO: Implementar query en periodService
            // const periods = await periodService.query(queryParams);
            const periods = [];
            res.json(periods);
        } else {
            const periods = await periodService.getAll();
            res.json(periods);
        }
    } catch (error) {
        next(error);
    }
}

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