/**
 * @fileoverview Controlador para la gestión de novedades de nómina
 * @module controllers/payrollNewController
 */

const settlementNewService = require('../services/settlementNewService');
const { NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
const { formatDate } = require('../utils/formatDate');
const { verifyId } = require('../utils/verifyId');
const { validateSettlementNewCreation, validateUniqueSettlementNew, validateSettlementNewUpdate, validateSettlementNewQuery, validateAvailableConcept, validateSettlementNewPreload, settlementNewData } = require('../utils/settlementNewValidation');

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
        const queryParams = req.query;

        if (Object.keys(queryParams).length > 0) {
            const settlementNews = await getSettlementNewByParams(queryParams);
            res.json(settlementNews);
        } else {
            const settlementNews = await getAllSettlementNews();
            res.json(settlementNews);
        }
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
        if (!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

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
        const data = await validateSettlementNewCreation(req.body);
        if(data.errors) throw new ValidationError('Settlement new was not created', data.errors);

        const createdSettlementNew = await settlementNewService.create(data);
        if (!createdSettlementNew) throw new Error('Settlement new was not created');
        res.status(201).json(createdSettlementNew);
    } catch (error) {
        next(error);
    }
};

exports.preload = async (req, res, next) => {
    try {
        const data = await validateSettlementNewPreload(req.body);
        console.log(data);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

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
        // Convierte el id a un numero
        const id = parseInt(req.params.id);
        if (!isValidNumericType(id)) throw new ValidationError('Settlement new was not updated', 'The field id must be a numeric value.');

        // Valida que la novedad exista
        const verified = await verifyId(id, 'settlementNew');
        if (!verified) throw new NotFoundError('Settlement new with id \'' + id + '\' was not found');

        // Valida que el concepto exista
        const isValidConcept = await verifyId(parseInt(req.body.conceptId, 10,), 'payrollConcept');
        if (!isValidConcept) throw new NotFoundError('Concept with id \'' + req.body.conceptId + '\' was not found');
        // Valida que el empleado exista
        const isValidEmployee = await verifyId(parseInt(req.body.employeeId, 10), "employee");
        if (!isValidEmployee) throw new NotFoundError('Employee with id \'' + req.body.employeeId + '\' was not found');

        // Valida que los datos de la novedad sean correctos
        const validation = validateSettlementNewUpdate(req.body);
        if (!validation.isValid) throw new ValidationError('Settlement new was not updated', validation.errors);

        const data = settlementNewData(req.body);

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
        if (!isValidNumericType(id)) throw new ValidationError('El campo \'id\' debe ser un valor numérico.');

        // Valida que la novedad exista
        const verified = await verifyId(id, 'settlementNew');
        if (!verified) throw new NotFoundError('Settlement new with id \'' + id + '\' was not found');

        await settlementNewService.remove(id);
        res.json({ mensaje: 'Settlement new was deleted' });
    } catch (error) {
        next(error);
    }
};

exports.draftNew = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (!isValidNumericType(id)) throw new ValidationError('Settlement new was not drafted', 'The field id must be a numeric value.');

        const verified = await verifyId(id, 'settlementNew');
        if (!verified) throw new NotFoundError('Settlement new with id \'' + id + '\' was not found');

        const draftedNew = await settlementNewService.update(id, {
            status: 'DRAFT',
            settlementEarningsId: null,
            settlementDeductionsId: null
        });
        if (!draftedNew) throw new Error('Settlement new was not drafted');
        res.json(draftedNew);
    } catch (error) {
        next(error);
    }
}

// exports.getNewWithParams = async (req, res, next) => {
//     try {
//         const validation = validateSettlementQuery(req.query);
//         if (!validation.isValid) throw new ValidationError('Settlement new was not retrieved', validation.errors);


//         res.json(settlementNews);
//     } catch (error) {
//         next(error);
//     }
// };

getAllSettlementNews = async () => {
    const settlementNews = await settlementNewService.getAll();
    return settlementNews;
}

getSettlementNewByParams = async (params) => {
    const queryValidation = validateSettlementNewQuery(params);
    if (!queryValidation.isValid) throw new ValidationError('Settlement new was not retrieved', queryValidation.errors);

    const query = {
        employeeId: parseInt(params.employeeId, 10),
        date: {
            gte: formatDate(params.startDate),
            lte: formatDate(params.endDate)
        },
    }
    if (params.conceptType === 'DEVENGADO') {
        query.conceptId = {
            lte: 40
        }
    }
    if (params.conceptType === 'DEDUCCION') {
        query.conceptId = {
            gte: 40
        }
    }
    const settlementNews = await settlementNewService.query(query);
    return settlementNews;
}