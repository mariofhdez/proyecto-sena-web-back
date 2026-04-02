/**
 * @fileoverview Controlador para la gestión de conceptos de nómina
 * @module controllers/conceptController
 */

const conceptService = require('../services/conceptService');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');

/**
 * Obtiene todos los conceptos de nómina del sistema
 * 
 * @async
 * @function getAllConcepts
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de conceptos
 * @throws {Error} Si ocurre un error al consultar los conceptos
 */
exports.getAllConcepts = async (req, res, next) => {
    try {
        const concepts = await conceptService.getAll();
        res.json(concepts);
    } catch (error) {
        next(error);
    }
}

exports.getConceptById = async (req, res, next) => {

    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) throw new ValidationError('Field id must be a number type');
        const concept = await conceptService.getById(id);
        res.json(concept);
    } catch (error) {
        next(error);
    }
}

exports.getConceptByCode = async (req, res, next) => {
    try {
        const code = req.params.code;
        
        // Validar que el código tenga exactamente 3 caracteres
        if (!code || code.length !== 3) {
            throw new ValidationError('El código del concepto debe tener exactamente 3 caracteres');
        }
        
        const concept = await conceptService.getByCode(code);
        if (!concept) {
            throw new NotFoundError(`Concepto con código '${code}' no encontrado`);
        }
        
        res.json(concept);
    } catch (error) {
        next(error);
    }
}