const noveltyService = require('../services/noveltyService');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { validateNoveltyBody, validatePreloadBody } = require('../utils/noveltyValidation');
const { isValidNumericType } = require('../utils/typeofValidations');
const { verifyId } = require('../utils/verifyId');

exports.retrieveNovelties = async (req, res, next) => {
    try {
        const query = req.query;

        if (Object.keys(query).length > 0) {
            const novelties = await noveltyService.getAllNovelties({where: query});
            res.json(novelties);
        } else {
            const novelties = await noveltyService.getAllNovelties();
            res.json(novelties);
        }
    } catch (error) {
        next(error);
    }
}

exports.getNoveltyById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const novelty = await noveltyService.getById(id);
        res.json(novelty);
    } catch (error) {
        next(error);
    }
}

exports.createNovelty = async (req, res, next) => {
    try {
        if(!req.body.employeeId || !req.body.conceptId) throw new ValidationError('Novelty was not created', `The field ${!req.body.employeeId ? 'employeeId' : 'conceptId'} is required`);
        const data = await validateNoveltyBody(null, req.body);
        if(data.errors) throw new ValidationError('Novelty was not created', data.errors);

        const createdNovelty = await noveltyService.create(data);
        if (!createdNovelty) throw new Error('Novelty was not created');
        res.status(201).json(createdNovelty);
    } catch (error) {
        next(error);
    }
}

exports.preload = async (req, res, next) => {
    try {
        const data = await validatePreloadBody(req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

exports.updateNovelty = async (req, res, next) => {
    try {
        // Convierte el id a un numero
        const id = parseInt(req.params.id);
        if (!isValidNumericType(id)) throw new ValidationError('Novelty was not updated', 'The field id must be a numeric value.');

        // Valida que la novedad exista
        const verified = await verifyId(id, 'novelty');
        if (!verified) throw new NotFoundError('Novelty with id \'' + id + '\' was not found');

        // Valida que los datos de la novedad sean correctos
        const data = await validateNoveltyBody(id, req.body);
        if (data.errors) throw new ValidationError('Novelty was not updated', data.errors);

        const updatedNovelty = await noveltyService.update(id, data);
        res.json(updatedNovelty);
    } catch (error) {
        next(error);
    }
};

exports.deleteNovelty = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (!isValidNumericType(id)) throw new ValidationError('El campo \'id\' debe ser un valor numérico.');

        // Valida que la novedad exista
        const verified = await verifyId(id, 'novelty');
        if (!verified) throw new NotFoundError('Novelty with id \'' + id + '\' was not found');

        await noveltyService.remove(id);
        res.json({ mensaje: 'Novelty was deleted' });
    } catch (error) {
        next(error);
    }
};

exports.getNoveltiesByEmployee = async (req, res, next) => {
    try {
        const employeeId = parseInt(req.params.employeeId);
        if (!isValidNumericType(employeeId)) throw new ValidationError('The field employeeId must be a numeric value.');

        const novelties = await noveltyService.getAllNovelties({employeeId: employeeId});
        res.json(novelties);
    } catch (error) {
        next(error);
    }
}

exports.getNoveltiesByPeriod = async (req, res, next) => {
    try {
        const periodId = parseInt(req.params.periodId);
        if (!isValidNumericType(periodId)) throw new ValidationError('The field periodId must be a numeric value.');

        const novelties = await noveltyService.getAllNovelties({periodId: periodId});
        res.json(novelties);
    } catch (error) {
        next(error);
    }
}
