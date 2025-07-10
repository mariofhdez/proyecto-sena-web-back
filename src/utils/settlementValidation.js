const { validateRequiredNumber, validateRequiredString, validateDateFormat } = require("./typeofValidations");
const settlementService = require("../services/settlementService");
const { ValidationError, NotFoundError } = require("./appError");

/**
 * Valida parámetros de consulta de liquidaciones
 */
function validateSettlementQuery(query) {
    let errors = [];

    if (query.employee_id) {
        const employeeId = parseInt(query.employee_id, 10);
        validateRequiredNumber(employeeId, "employee_id", errors);
    }

    if (query.start_date || query.end_date) {
        if (query.start_date) {
            validateRequiredString(query.start_date, "start_date", errors);
            validateDateFormat(query.start_date, "start_date", errors);
        }
        
        if (query.end_date) {
            validateRequiredString(query.end_date, "end_date", errors);
            validateDateFormat(query.end_date, "end_date", errors);
        }
    }

    if (query.period_id) {
        const periodId = parseInt(query.period_id, 10);
        validateRequiredNumber(periodId, "period_id", errors);
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
 * Valida la creación de una liquidación
 */
async function validateSettlementCreation(data) {
    let errors = [];

    // Validar empleado
    validateRequiredNumber(data.employee_id, "employee_id", errors);

    // Validar fechas
    validateRequiredString(data.start_date, "start_date", errors);
    validateDateFormat(data.start_date, "start_date", errors);

    validateRequiredString(data.end_date, "end_date", errors);
    validateDateFormat(data.end_date, "end_date", errors);

    // Validar que la fecha de fin sea mayor que la fecha de inicio
    if (data.start_date && data.end_date && new Date(data.end_date) <= new Date(data.start_date)) {
        errors.push("The end date must be greater than the start date");
    }

    // Validar período si se proporciona
    if (data.period_id) {
        validateRequiredNumber(data.period_id, "period_id", errors);
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
 * Valida que no haya liquidación duplicada para el mismo empleado y período
 */
async function validateUniqueSettlement(employeeId, startDate, endDate, errors) {
    const query = {
        employee_id: employeeId,
        start_date: {
            gte: new Date(startDate)
        },
        end_date: {
            lte: new Date(endDate)
        },
        status: {
            not: "VOID"
        }
    };

    const settlements = await settlementService.query(query);
    
    if (settlements.length > 0) {
        errors.push("A settlement already exists for this employee and period");
    }
}

/**
 * Verifica que una liquidación existe
 */
async function verifySettlement(settlementId) {
    const settlement = await settlementService.getById(settlementId);
    return settlement;
}

/**
 * Valida la actualización de una liquidación
 */
async function validateSettlementUpdate(data) {
    let errors = [];

    // Validar fechas si se están actualizando
    if (data.start_date) {
        validateRequiredString(data.start_date, "start_date", errors);
        validateDateFormat(data.start_date, "start_date", errors);
    }

    if (data.end_date) {
        validateRequiredString(data.end_date, "end_date", errors);
        validateDateFormat(data.end_date, "end_date", errors);
    }

    // Validar que las fechas sean coherentes
    if (data.start_date && data.end_date && new Date(data.end_date) <= new Date(data.start_date)) {
        errors.push("The end date must be greater than the start date");
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
 * Valida el cambio de estado de una liquidación
 */
function validateStatusTransition(currentStatus, newStatus) {
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

module.exports = {
    validateSettlementQuery,
    validateSettlementCreation,
    validateSettlementUpdate,
    validateUniqueSettlement,
    validateStatusTransition,
    verifySettlement
};
