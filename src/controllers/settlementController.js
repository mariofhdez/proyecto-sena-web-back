/**
 * @fileoverview Controlador para la gestión de liquidaciones de nómina
 * @module controllers/settlementController
 */

const settlementService = require('../services/settlementService');
const { validateSettlementQuery, validateSettlementCreation } = require('../utils/settlementValidation');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { validateRequiredNumber, isValidNumericType } = require('../utils/typeofValidations');
const settlementDetailService = require('../services/settlementDetailService');
const { calculateSettlement } = require('../utils/settlementValidation');

/**
 * Obtiene todas las liquidaciones del sistema o filtra por parámetros
 * 
 * @async
 * @function retriveSettlements
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.query - Parámetros de consulta (opcional)
 * @param {string} req.query.startDate - Fecha de inicio para filtrar
 * @param {string} req.query.endDate - Fecha de fin para filtrar
 * @param {string} req.query.employeeId - ID del empleado para filtrar
 * @param {string} req.query.periodId - ID del período para filtrar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de liquidaciones
 * @throws {ValidationError} Si los parámetros de consulta no son válidos
 */
exports.retriveSettlements = async (req, res, next) => {
    try {
        const queryParams = req.query;
        if (Object.keys(queryParams).length > 0) {
            const settlements = await settlementService.getAll(validateSettlementQuery(queryParams));
            res.json(settlements);
        } else {
            const settlements = await settlementService.getAll();
            res.json(settlements);
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene una liquidación específica por su ID
 * 
 * @async
 * @function getSettlementById
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la liquidación a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos de la liquidación
 * @throws {ValidationError} Si el ID no es válido
 */
exports.getSettlementById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const settlement = await settlementService.getById(id);
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea una nueva liquidación de nómina
 * 
 * @async
 * @function createSettlement
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la liquidación a crear
 * @param {number} req.body.employeeId - ID del empleado
 * @param {string} req.body.startDate - Fecha de inicio del período
 * @param {string} req.body.endDate - Fecha de fin del período
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos de la liquidación creada
 * @throws {ValidationError} Si los datos de la liquidación no son válidos
 * @throws {NotFoundError} Si el empleado no existe
 * @throws {Error} Si ocurre un error al crear los conceptos recurrentes
 */
exports.createSettlement = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate } = req.body;

        const data = await validateSettlementCreation(req.body);
        if (data.errors) throw new ValidationError('Settlement was not created', data.errors);
        
        const settlement = await settlementService.create(data);
        if(!settlement) throw new Error('Error al crear nómina');
        
        res.status(201).json(settlement);

    } catch (error) {
        next(error);
    }
}

/**
 * Actualiza una liquidación existente (servicio no disponible)
 * 
 * @async
 * @function updateSettlement
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta JSON con error de servicio no disponible
 */
exports.updateSettlement = async (req, res, next) => {
    //TODO
    res.status(403).json({ error: "Servicio no disponible" });
}

/**
 * Elimina una liquidación del sistema
 * 
 * @async
 * @function deleteSettlement
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la liquidación a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de confirmación
 * @throws {ValidationError} Si el ID no es válido
 * @throws {NotFoundError} Si la liquidación no existe
 * @throws {Error} Si ocurre un error al eliminar la liquidación
 */
exports.deleteSettlement = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        await removeSettlement(id);

        res.json({ message: 'Settlement was deleted' });

    } catch (error) {
        next(error);
    }
    //TODO

}

/**
 * Liquida una nómina específica
 * 
 * @async
 * @function settlePayroll
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la solicitud
 * @param {string} req.body.settlementId - ID de la liquidación a liquidar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la liquidación procesada
 * @throws {ValidationError} Si el ID no es válido o la liquidación ya está liquidada
 * @throws {NotFoundError} Si la liquidación no existe
 * @throws {Error} Si ocurre un error durante la liquidación
 */
exports.settlePayroll = async (req, res, next) => {
    try {
        const settlementId = parseInt(req.body.settlementId, 10);
        const settlement = await settlementService.getById(settlementId);
        if (settlement.status === 'CLOSED') throw new ValidationError('Payroll was not settled', 'Payroll with id \'' + settlementId + '\' is closed');
        const updatedSettlement = await calculateSettlement(settlementId);
        res.json(updatedSettlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Cierra una liquidación de nómina
 * 
 * @async
 * @function closePayroll
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la solicitud
 * @param {string} req.body.settlementId - ID de la liquidación a cerrar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la liquidación cerrada
 * @throws {ValidationError} Si el ID no es válido o la liquidación no puede cerrarse
 * @throws {NotFoundError} Si la liquidación no existe
 * @throws {Error} Si ocurre un error al cerrar la liquidación
 */
exports.closePayroll = async (req, res, next) => {
    try {
        const settlementId = parseInt(req.body.settlementId, 10);
        let errors = [];

        validateRequiredNumber(req.body.settlementId, "settlementId", errors);
        if (errors.length > 0) throw new ValidationError('Payroll was not closed', errors);
        // Validar que el id sea un número
        if (!isValidNumericType(settlementId)) throw new ValidationError('The field settlementId must be a numeric value.');

        // Validar que la liquidación exista
        let settlement = await settlementService.getById(settlementId);
        if (!settlement) throw new NotFoundError('Settlement with id \'' + settlementId + '\' was not found');

        // Validar que la liquidación no esté ya cerrada
        switch (settlement.status) {
            case 'DRAFT':
                throw new ValidationError('Payroll was not closed', 'Payroll with id \'' + settlementId + '\' is not calculated');
                break;
            case 'CLOSED':
                throw new ValidationError('Payroll was not closed', 'Payroll with id \'' + settlementId + '\' is already closed');
                break;
            case 'VOID':
                throw new ValidationError('Payroll was not closed', 'Payroll with id \'' + settlementId + '\' is void');
                break;
            default:
                break;
        }
        
        settlement = await closeSettlement(settlementId);
        if (!settlement) throw new Error('Error al cerrar nómina');
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

async function closeSettlement(settlementId){
    try {
        const settlement = await settlementService.getById(settlementId);
        
        for(const detail of settlement.details){
            await settlementDetailService.update(detail.id, {status: 'CLOSED'});
        }

        const updatedSettlement = await settlementService.update(settlementId, {status: 'CLOSED'});
        if (!updatedSettlement) throw new Error('Error al cerrar nómina');
        return updatedSettlement;
    } catch (error) {
        console.error(error);
    }
}

exports.getSettlementsByEmployeeId = async (req, res, next) => {
    try {
        const employeeId = parseInt(req.params.employeeId, 10);
        if (!isValidNumericType(employeeId)) throw new ValidationError('The field employeeId must be a numeric value.');

        const settlements = await settlementService.getAll({employeeId: employeeId});
        res.json(settlements);
    } catch (error) {
        next(error);
    }
}
