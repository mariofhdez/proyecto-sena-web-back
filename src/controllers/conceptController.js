/**
 * @fileoverview Controlador para la gestión de conceptos de nómina
 * @module controllers/conceptController
 */

const conceptService = require('../services/conceptService');
const { ValidationError, NotFoundError } = require('../utils/appError');

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

/**
 * Obtiene un concepto específico por su código
 * 
 * @async
 * @function getConceptByCode
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.code - Código del concepto (3 caracteres)
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del concepto
 * @throws {ValidationError} Si el código no es válido
 * @throws {NotFoundError} Si el concepto no existe
 */
exports.getConceptByCode = async (req, res, next) => {
    try {
        const { code } = req.params;
        
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