/**
 * @fileoverview Controlador para la gestión de conceptos de nómina
 * @module controllers/conceptController
 */

const conceptService = require('../services/conceptService');

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