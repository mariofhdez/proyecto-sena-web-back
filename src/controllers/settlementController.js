/**
 * @fileoverview Controlador para la gestión de liquidaciones de nómina
 * @module controllers/settlementController
 */

const settlementService = require('../services/settlementService');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
const { 
    validateSettlementQuery, 
    validateSettlementCreation, 
    validateSettlementUpdate,
    validateUniqueSettlement,
    validateStatusTransition,
    verifySettlement 
} = require('../utils/settlementValidation');
const { calculateSettlement } = require('../services/settlementCalculationEngine');

/**
 * Obtiene todas las liquidaciones del sistema o filtra por parámetros
 */
exports.retrieveSettlements = async (req, res, next) => {
    try {
        const queryParams = req.query;
        if (Object.keys(queryParams).length > 0) {
            const validation = validateSettlementQuery(queryParams);
            if (!validation.isValid) {
                throw new ValidationError('Invalid query parameters', validation.errors);
            }
            const settlements = await settlementService.query(queryParams);
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
 */
exports.getSettlementById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const settlement = await settlementService.getById(id);
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene liquidaciones por empleado
 */
exports.getSettlementsByEmployee = async (req, res, next) => {
    try {
        const employeeId = parseInt(req.params.employeeId, 10);
        if (!isValidNumericType(employeeId)) {
            throw new ValidationError('The field employeeId must be a numeric value.');
        }

        const settlements = await settlementService.getByEmployee(employeeId);
        res.json(settlements);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene liquidaciones por período
 */
exports.getSettlementsByPeriod = async (req, res, next) => {
    try {
        const periodId = parseInt(req.params.periodId, 10);
        if (!isValidNumericType(periodId)) {
            throw new ValidationError('The field periodId must be a numeric value.');
        }

        const settlements = await settlementService.getByPeriod(periodId);
        res.json(settlements);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea una nueva liquidación de nómina
 */
exports.createSettlement = async (req, res, next) => {
    try {
        const validation = await validateSettlementCreation(req.body);
        if (!validation.isValid) {
            throw new ValidationError('Settlement was not created', validation.errors);
        }

        // Validar que no haya liquidación duplicada
        await validateUniqueSettlement(
            req.body.employee_id, 
            req.body.start_date, 
            req.body.end_date, 
            []
        );

        const settlement = await settlementService.create(req.body);
        res.status(201).json(settlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Actualiza una liquidación existente
 */
exports.updateSettlement = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const validation = await validateSettlementUpdate(req.body);
        if (!validation.isValid) {
            throw new ValidationError('Settlement was not updated', validation.errors);
        }

        const settlement = await settlementService.update(id, req.body);
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Elimina una liquidación del sistema
 */
exports.deleteSettlement = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        await settlementService.delete(id);
        res.json({ message: 'Settlement deleted successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Calcula una liquidación usando el motor de cálculo
 */
exports.calculateSettlement = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const settlement = await verifySettlement(id);
        if (!settlement) {
            throw new NotFoundError('Settlement not found');
        }

        if (settlement.status !== 'DRAFT') {
            throw new ValidationError('Only DRAFT settlements can be calculated');
        }

        const calculatedSettlement = await calculateSettlement(id);
        res.json(calculatedSettlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Cambia el estado de una liquidación
 */
exports.changeStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        if (!status) {
            throw new ValidationError('Status is required');
        }

        const settlement = await settlementService.getById(id);
        validateStatusTransition(settlement.status, status);

        const updatedSettlement = await settlementService.changeStatus(id, status);
        res.json(updatedSettlement);
    } catch (error) {
        next(error);
    }
}

/**
 * Calcula y actualiza los totales de una liquidación
 */
exports.calculateTotals = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const settlement = await settlementService.calculateTotals(id);
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}
