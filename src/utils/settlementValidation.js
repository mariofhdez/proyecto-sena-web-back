const { validateRequiredNumber, validateRequiredString, validateDateFormat } = require("./typeofValidations");
const settlementService = require("../services/settlementService");
const { splitDate } = require("./typeofValidations");

function validateSettlementQuery(query) {
    let errors = [];

    if(query.employeeId) {
        const employeeId = parseInt(query.employeeId, 10);
        validateRequiredNumber(employeeId, "employeeId", errors)
    }

    validateRequiredString(query.startDate, "startDate", errors);
    validateDateFormat(query.startDate, "startDate", errors);

    validateRequiredString(query.endDate, "endDate", errors);
    validateDateFormat(query.endDate, "endDate", errors);

    if(errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return {
        isValid: true
    }
}

function validateSettlementCreation(settlement) {
    let errors = [];

    // Valida que el id del empleado sea un numero
    validateRequiredNumber(settlement.employeeId, "employeeId", errors);

    // Valida que la fecha de inicio sea una fecha
    validateRequiredString(settlement.startDate, "startDate", errors);
    validateDateFormat(settlement.startDate, "startDate", errors);

    // Valida que la fecha de fin sea una fecha
    validateRequiredString(settlement.endDate, "endDate", errors);
    validateDateFormat(settlement.endDate, "endDate", errors);
    
    // Valida que la fecha de fin sea mayor que la fecha de inicio
    if(settlement.endDate <= settlement.startDate) {
        errors.push("The end date must be greater than the start date");
    }
    validateSettlementPeriod(settlement.startDate, settlement.endDate, errors);

    if(errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }   
    }
    return {
        isValid: true
    }
}

function validateSettlementPeriod(startDate, endDate, errors) {
    const splitStartDate = splitDate(startDate);
    const splitEndDate = splitDate(endDate);
    if(splitStartDate.year !== splitEndDate.year || splitStartDate.month !== splitEndDate.month) {
        errors.push("The start date and end date must be in the same period");
    }
}

async function validateUniqueSettlement(employee, startDate, endDate) {
    const employeeId = parseInt(employee, 10);
    const splitStartDate = splitDate(startDate);
    const splitEndDate = splitDate(endDate);

    const query = {
        employeeId: employeeId,
        startDate: {
            gte: new Date(splitStartDate.year, splitStartDate.month - 1, '00'),
            lte: new Date(splitStartDate.year, splitStartDate.month - 1, '32')
        },
        endDate: {
            gte: new Date(splitEndDate.year, splitEndDate.month - 1, '00'),
            lte: new Date(splitEndDate.year, splitEndDate.month - 1, '32')
        }
    }

    const settlement = await settlementService.query(query);
    const lenght = settlement.length;
    if (lenght > 0) {
        return {
            isValid: false,
            errors: ["The settlement for the period already exists"]
        }
    }
    return {
        isValid: true
    }
}

async function verifySettlement(settlementId) {
    const settlement = await settlementService.getById(settlementId);
    return settlement;
}

module.exports = {
    validateSettlementQuery,
    validateSettlementCreation,
    validateUniqueSettlement,
    verifySettlement
}
