const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
// const { formatDate } = require('../utils/formatDate');
const { validatePeriodCreation, loadEmployees, createPeriod, settlePeriod } = require('../utils/periodValidation');
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

        const settlePeriod = await settlePeriod(id);
        // TODO: Implementar la lógica para liquidar el periodo
        res.json({message: 'Period settled'});

    } catch (error) {
        next(error);
    }
}

exports.closePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');
        
        // TODO: Implementar la lógica para cerrar el periodo
        res.json({message: 'Period closed'});
    } catch (error) {
        next(error);
    }
}

exports.deletePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');
        const period = await periodService.delete(id);
        res.status(204).send();
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