const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
const { formatDate } = require('../utils/formatDate');
const { validatePeriodCreation } = require('../utils/periodValidation');

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
        const data = {
            startDate: formatDate(req.body.startDate),
            endDate: formatDate(req.body.endDate),
            status: 'DRAFT'
        }
        const period = await periodService.create(data);
        res.status(201).json(period);
    } catch (error) {
        next(error);
    }
}

exports.settlePeriod = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');
        
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