const { validateRequiredNumber, validateRequiredString, validateDateFormat } = require("./typeofValidations");
const settlementDetailService = require("../services/settlementDetailService");
const { ValidationError } = require("./appError");

/**
 * Valida parámetros de consulta de detalles de liquidación
 */
function validateSettlementDetailQuery(query) {
    let errors = [];

    if (query.settlement_id) {
        const settlementId = parseInt(query.settlement_id, 10);
        validateRequiredNumber(settlementId, "settlement_id", errors);
    }

    if (query.concept_id) {
        const conceptId = parseInt(query.concept_id, 10);
        validateRequiredNumber(conceptId, "concept_id", errors);
    }

    if (query.employee_id) {
        const employeeId = parseInt(query.employee_id, 10);
        validateRequiredNumber(employeeId, "employee_id", errors);
    }

    if (query.date) {
        validateRequiredString(query.date, "date", errors);
        validateDateFormat(query.date, "date", errors);
    }

    if (query.status && !['DRAFT', 'OPEN', 'CLOSED', 'VOID'].includes(query.status)) {
        errors.push("Status must be DRAFT, OPEN, CLOSED, or VOID");
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        };
    }
    return {
        isValid: true
    };
}

/**
 * Valida la creación de un detalle de liquidación
 */
async function validateSettlementDetailCreation(data) {
    let errors = [];

    // Validar campos requeridos
    validateRequiredNumber(data.settlement_id, "settlement_id", errors);
    validateRequiredNumber(data.concept_id, "concept_id", errors);
    validateRequiredNumber(data.employee_id, "employee_id", errors);

    // Validar valor
    if (!data.value || data.value < 0) {
        errors.push("Value must be greater than or equal to 0");
    }

    // Validar fecha si se proporciona
    if (data.date) {
        validateRequiredString(data.date, "date", errors);
        validateDateFormat(data.date, "date", errors);
    }

    // Validar cantidad si se proporciona
    if (data.quantity !== undefined && data.quantity <= 0) {
        errors.push("Quantity must be greater than 0");
    }

    // Validar estado si se proporciona
    if (data.status && !['DRAFT', 'OPEN', 'CLOSED', 'VOID'].includes(data.status)) {
        errors.push("Status must be DRAFT, OPEN, CLOSED, or VOID");
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        };
    }
    return {
        isValid: true
    };
}

/**
 * Valida la actualización de un detalle de liquidación
 */
async function validateSettlementDetailUpdate(data) {
    let errors = [];

    // Validar valor si se está actualizando
    if (data.value !== undefined && data.value < 0) {
        errors.push("Value must be greater than or equal to 0");
    }

    // Validar fecha si se está actualizando
    if (data.date) {
        validateRequiredString(data.date, "date", errors);
        validateDateFormat(data.date, "date", errors);
    }

    // Validar cantidad si se está actualizando
    if (data.quantity !== undefined && data.quantity <= 0) {
        errors.push("Quantity must be greater than 0");
    }

    // Validar estado si se está actualizando
    if (data.status && !['DRAFT', 'OPEN', 'CLOSED', 'VOID'].includes(data.status)) {
        errors.push("Status must be DRAFT, OPEN, CLOSED, or VOID");
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        };
    }
    return {
        isValid: true
    };
}

/**
 * Valida el cálculo de un detalle
 */
async function validateSettlementDetailCalculation(data) {
    let errors = [];

    // Validar campos requeridos
    validateRequiredNumber(data.concept_id, "concept_id", errors);
    validateRequiredNumber(data.employee_id, "employee_id", errors);
    validateRequiredNumber(data.settlement_id, "settlement_id", errors);

    // Validar cantidad si se proporciona
    if (data.quantity !== undefined && data.quantity <= 0) {
        errors.push("Quantity must be greater than 0");
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        };
    }
    return {
        isValid: true
    };
}

/**
 * Valida el cambio de estado de un detalle
 */
function validateSettlementDetailStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        'DRAFT': ['OPEN', 'VOID'],
        'OPEN': ['CLOSED', 'DRAFT'],
        'CLOSED': ['OPEN'],
        'VOID': []
    };

    if (!validTransitions[currentStatus]) {
        throw new ValidationError(`Invalid current status: ${currentStatus}`);
    }

    if (!validTransitions[currentStatus].includes(newStatus)) {
        throw new ValidationError(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }

    return true;
}

/**
 * Valida que no haya duplicados de concepto en la misma liquidación
 */
async function validateUniqueConceptInSettlement(settlementId, conceptId, excludeId = null) {
    const query = {
        settlement_id: settlementId,
        concept_id: conceptId,
        status: {
            not: "VOID"
        }
    };

    if (excludeId) {
        query.id = {
            not: excludeId
        };
    }

    const existingDetails = await settlementDetailService.query(query);
    
    if (existingDetails.length > 0) {
        throw new ValidationError("Concept already exists in this settlement");
    }
}

/**
 * Valida que la liquidación no esté cerrada
 */
async function validateSettlementNotClosed(settlementId) {
    const settlement = await settlementDetailService.getById(settlementId);
    
    if (settlement.settlement.status === 'CLOSED') {
        throw new ValidationError("Cannot modify details of closed settlement");
    }
}

module.exports = {
    validateSettlementDetailQuery,
    validateSettlementDetailCreation,
    validateSettlementDetailUpdate,
    validateSettlementDetailCalculation,
    validateSettlementDetailStatusTransition,
    validateUniqueConceptInSettlement,
    validateSettlementNotClosed
}; 