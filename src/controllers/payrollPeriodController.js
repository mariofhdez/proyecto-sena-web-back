const payrollPeriodService = require('../services/payrollPeriodService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

exports.getPeriods = async (req, res, next) => {
    try {
        const periods = await payrollPeriodService.getAll();
        res.json(periods);
    } catch (error) {
        next(error);
    }
};

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

exports.createPeriod = async (req, res, next) => {
    try {
        const newPeriod = await payrollPeriodService.create(req.body);
        res.status(201).json(newPeriod);
    } catch (error) {
        next(error);
    }
};

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
