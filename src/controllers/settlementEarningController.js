/**
 * @fileoverview Controlador para la gestión de devengados de liquidación
 * @module controllers/settlementEarningController
 */

const settlementEarningService = require('../services/settlementEarningService');

/**
 * Obtiene todos los devengados del sistema
 * 
 * @async
 * @function retrieve
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de devengados
 * @throws {Error} Si ocurre un error al consultar los devengados
 */
exports.retrieve = async (req, res, next) => {
    try {
        const settlementEarnings = await settlementEarningService.retrieve();
        res.json(settlementEarnings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Obtiene un devengado específico por su ID
 * 
 * @async
 * @function getEarningsById
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del devengado a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del devengado
 * @throws {Error} Si ocurre un error al consultar el devengado
 */
exports.getEarningsById = async (req, res, next) => {
    try {
        const earning = await settlementEarningService.getById(parseInt(req.params.id, 10));
        res.json(earning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Crea un nuevo devengado
 * 
 * @async
 * @function createEarning
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del devengado a crear
 * @param {number} req.body.value - Valor del devengado
 * @param {number} req.body.settlementId - ID de la liquidación
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con el devengado creado
 * @throws {Error} Si ocurre un error al crear el devengado
 */
exports.createEarning = async (req, res, next) => {
    try {
        const data = {
            value: req.body.value,
            settlement: {
                connect: {
                    id: req.body.settlementId
                }
            }
        }
        const earning = await settlementEarningService.create(data);
        res.json(earning)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Actualiza un devengado existente
 * 
 * @async
 * @function updateEarning
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del devengado a actualizar
 * @param {Object} req.body - Datos actualizados del devengado
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con el devengado actualizado
 * @throws {Error} Si ocurre un error al actualizar el devengado
 */
exports.updateEarning = async (req, res, next) => {
    try {
        const updatedSettlementEarning = await settlementEarningService.update(parseInt(req.params.id, 10), req.body);
        res.json(updatedSettlementEarning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Elimina un devengado del sistema
 * 
 * @async
 * @function deleteEarning
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del devengado a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta vacía con estado 204
 * @throws {Error} Si ocurre un error al eliminar el devengado
 */
exports.deleteEarning = async (req, res, next) => {
    try {
        await settlementEarningService.delete(parseInt(req.params.id, 10));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}