/**
 * @fileoverview Controlador para la gestión de detalles de liquidación
 * @module controllers/settlementDetailController
 */

const settlementDetailService = require('../services/settlementDetailService');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/typeofValidations');
const { 
    validateSettlementDetailQuery, 
    validateSettlementDetailCreation, 
    validateSettlementDetailUpdate,
    validateSettlementDetailCalculation,
    validateSettlementDetailStatusTransition,
    validateUniqueConceptInSettlement
} = require('../utils/settlementDetailValidation');

/**
 * Obtiene todos los detalles de liquidación o filtra por parámetros
 */
exports.retrieveSettlementDetails = async (req, res, next) => {
    try {
        const queryParams = req.query;
        if (Object.keys(queryParams).length > 0) {
            const validation = validateSettlementDetailQuery(queryParams);
            if (!validation.isValid) {
                throw new ValidationError('Invalid query parameters', validation.errors);
            }
            const details = await settlementDetailService.query(queryParams);
            res.json(details);
        } else {
            const details = await settlementDetailService.getAll();
            res.json(details);
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene un detalle de liquidación específico por su ID
 */
exports.getSettlementDetailById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const detail = await settlementDetailService.getById(id);
        res.json(detail);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene detalles por liquidación
 */
exports.getSettlementDetailsBySettlement = async (req, res, next) => {
    try {
        const settlementId = parseInt(req.params.settlementId, 10);
        if (!isValidNumericType(settlementId)) {
            throw new ValidationError('The field settlementId must be a numeric value.');
        }

        const details = await settlementDetailService.getBySettlement(settlementId);
        res.json(details);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene detalles por empleado
 */
exports.getSettlementDetailsByEmployee = async (req, res, next) => {
    try {
        const employeeId = parseInt(req.params.employeeId, 10);
        if (!isValidNumericType(employeeId)) {
            throw new ValidationError('The field employeeId must be a numeric value.');
        }

        const details = await settlementDetailService.getByEmployee(employeeId);
        res.json(details);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene detalles por concepto
 */
exports.getSettlementDetailsByConcept = async (req, res, next) => {
    try {
        const conceptId = parseInt(req.params.conceptId, 10);
        if (!isValidNumericType(conceptId)) {
            throw new ValidationError('The field conceptId must be a numeric value.');
        }

        const details = await settlementDetailService.getByConcept(conceptId);
        res.json(details);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea un nuevo detalle de liquidación
 */
exports.createSettlementDetail = async (req, res, next) => {
    try {
        const validation = await validateSettlementDetailCreation(req.body);
        if (!validation.isValid) {
            throw new ValidationError('Settlement detail was not created', validation.errors);
        }

        // Validar que no haya duplicados de concepto en la misma liquidación
        await validateUniqueConceptInSettlement(
            req.body.settlement_id, 
            req.body.concept_id
        );

        const detail = await settlementDetailService.create(req.body);
        res.status(201).json(detail);
    } catch (error) {
        next(error);
    }
}

/**
 * Actualiza un detalle de liquidación existente
 */
exports.updateSettlementDetail = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        const validation = await validateSettlementDetailUpdate(req.body);
        if (!validation.isValid) {
            throw new ValidationError('Settlement detail was not updated', validation.errors);
        }

        const detail = await settlementDetailService.update(id, req.body);
        res.json(detail);
    } catch (error) {
        next(error);
    }
}

/**
 * Elimina un detalle de liquidación
 */
exports.deleteSettlementDetail = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        await settlementDetailService.delete(id);
        res.json({ message: 'Settlement detail deleted successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Calcula el valor de un detalle
 */
exports.calculateSettlementDetail = async (req, res, next) => {
    try {
        const validation = await validateSettlementDetailCalculation(req.body);
        if (!validation.isValid) {
            throw new ValidationError('Settlement detail calculation failed', validation.errors);
        }

        const { concept_id, quantity, employee_id, settlement_id } = req.body;
        const calculatedValue = await settlementDetailService.calculateValue(
            concept_id, 
            quantity, 
            employee_id, 
            settlement_id
        );

        res.json({ 
            concept_id, 
            quantity, 
            employee_id, 
            settlement_id, 
            calculated_value: calculatedValue 
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Cambia el estado de un detalle de liquidación
 */
exports.changeSettlementDetailStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (!isValidNumericType(id)) {
            throw new ValidationError('The field id must be a numeric value.');
        }

        if (!status) {
            throw new ValidationError('Status is required');
        }

        const detail = await settlementDetailService.getById(id);
        validateSettlementDetailStatusTransition(detail.status, status);

        const updatedDetail = await settlementDetailService.changeStatus(id, status);
        res.json(updatedDetail);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene estadísticas de detalles por liquidación
 */
exports.getSettlementDetailStats = async (req, res, next) => {
    try {
        const settlementId = parseInt(req.params.settlementId, 10);
        if (!isValidNumericType(settlementId)) {
            throw new ValidationError('The field settlementId must be a numeric value.');
        }

        const stats = await settlementDetailService.getSettlementStats(settlementId);
        res.json(stats);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea múltiples detalles de liquidación
 */
exports.createMultipleSettlementDetails = async (req, res, next) => {
    try {
        const { details } = req.body;
        
        if (!Array.isArray(details) || details.length === 0) {
            throw new ValidationError('Details array is required and cannot be empty');
        }

        const createdDetails = [];
        const errors = [];

        for (let i = 0; i < details.length; i++) {
            try {
                const detail = details[i];
                const validation = await validateSettlementDetailCreation(detail);
                
                if (!validation.isValid) {
                    errors.push({
                        index: i,
                        errors: validation.errors
                    });
                    continue;
                }

                // Validar que no haya duplicados
                await validateUniqueConceptInSettlement(
                    detail.settlement_id, 
                    detail.concept_id
                );

                const createdDetail = await settlementDetailService.create(detail);
                createdDetails.push(createdDetail);
            } catch (error) {
                errors.push({
                    index: i,
                    error: error.message
                });
            }
        }

        res.status(201).json({
            created: createdDetails,
            errors: errors,
            summary: {
                total: details.length,
                created: createdDetails.length,
                failed: errors.length
            }
        });
    } catch (error) {
        next(error);
    }
} 