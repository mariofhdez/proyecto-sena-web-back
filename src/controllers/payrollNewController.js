const payrollNewService = require('../services/payrollNewService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

exports.getNews = async (req, res, next) => {
    try {
        const news = await payrollNewService.getAll();
        res.json(news);
    } catch (error) {
        next(error);
    }
};

exports.getNew = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        const news = await payrollNewService.getById(req.params.id);
        res.json(news);
    } catch (error) {
        next(error);
    }
};

exports.createNew = async (req, res, next) => {
    try {
        const newPayrollNews = await payrollNewService.create(req.body);
        res.status(201).json(newPayrollNews);
    } catch (error) {
        next(error);
    }
};

exports.updateNew = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        const updatedNews = await payrollNewService.update(req.params.id, req.body);
        res.json(updatedNews);
    } catch (error) {
        next(error);
    }
};

exports.deleteNew = async (req, res, next) => {
    try {
        if (!isValidNumericType(parseInt(req.params.id), 'number')) {
            throw new ValidationError('El \'id\' debe ser un valor numérico.');
        }

        await payrollNewService.remove(req.params.id);
        res.json({ mensaje: 'Novedad de nómina eliminada' });
    } catch (error) {
        next(error);
    }
};