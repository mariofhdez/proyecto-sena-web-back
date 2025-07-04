/**
 * @fileoverview Controlador para la gestión de deducciones de liquidación
 * @module controllers/settlementDeductionController
 */

const settlementDeductionService = require('../services/settlementDeductionService');

/**
 * Obtiene todas las deducciones del sistema
 * 
 * @async
 * @function retrieve
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de deducciones
 * @throws {Error} Si ocurre un error al consultar las deducciones
 */
exports.retrieve = async (req, res, next) => {
    try {
        const settlementDeductions = await settlementDeductionService.retrieve();
        res.json(settlementDeductions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Obtiene una deducción específica por su ID
 * 
 * @async
 * @function getDeductionsById
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la deducción a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos de la deducción
 * @throws {Error} Si ocurre un error al consultar la deducción
 */
exports.getDeductionsById = async (req, res, next) => {
    try {
        const deduction = await settlementDeductionService.getById(parseInt(req.params.id, 10));
        res.json(deduction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Crea una nueva deducción
 * 
 * @async
 * @function createDeduction
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la deducción a crear
 * @param {number} req.body.value - Valor de la deducción
 * @param {number} req.body.settlementId - ID de la liquidación
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la deducción creada
 * @throws {Error} Si ocurre un error al crear la deducción
 */
exports.createDeduction = async (req, res, next) => {
    try {
        const data = {
            value: req.body.value,
            settlement: {
                connect: {
                    id: req.body.settlementId
                }
            }
        }
        const deduction = await settlementDeductionService.create(data);
        res.json(deduction)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Actualiza una deducción existente
 * 
 * @async
 * @function updateDeduction
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la deducción a actualizar
 * @param {Object} req.body - Datos actualizados de la deducción
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la deducción actualizada
 * @throws {Error} Si ocurre un error al actualizar la deducción
 */
exports.updateDeduction = async (req, res, next) => {
    try {
        const updatedSettlementDeduction = await settlementDeductionService.update(parseInt(req.params.id, 10), req.body);
        res.json(updatedSettlementDeduction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Elimina una deducción del sistema
 * 
 * @async
 * @function deleteDeduction
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la deducción a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta vacía con estado 204
 * @throws {Error} Si ocurre un error al eliminar la deducción
 */
exports.deleteDeduction = async (req, res, next) => {
    try {
        await settlementDeductionService.delete(parseInt(req.params.id, 10));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}