const { validateRequiredString, validateRequiredNumber, isValidDateFormat, validateDateFormat } = require("./typeofValidations");
const settlementNewService = require('../services/settlementNewService');

function validateSettlementNewCreation(settlement) {
    let errors = [];

    // Validar fecha
    validateRequiredString(settlement.date, "date", errors);
    validateDateFormat(settlement.date, "date", errors);
    // Validar cantidad
    validateRequiredNumber(settlement.quantity, "quantity", errors);
    // Validar valor
    validateRequiredNumber(settlement.value, "value", errors);
    // Validar concepto
    validateRequiredNumber(settlement.conceptId, "conceptId", errors);
    // Validar empleado
    validateRequiredNumber(settlement.employeeId, "employeeId", errors);

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return {
        isValid: true
    }
}

async function validateUniqueSettlementNew(employee, concept, date) {
    const employeeId = parseInt(employee, 10);
    const conceptId = parseInt(concept, 10);

    const [year, month, day] = date.split('-').map(Number);
    
    let query = {
        employeeId: employeeId,
        conceptId: conceptId,
        date: {
            gte: new Date(year, month - 1, '00'),
            lte: new Date(year, month - 1, '32')
        }    
    }

    const settlementNew = await settlementNewService.query(query);
    const lenght = settlementNew.length;
    if (lenght > 0) {

        return false;
    }
    return true;
}

function validateSettlementNewUpdate(settlement) {
    let errors = [];

    if(settlement.date) {
        validateRequiredString(settlement.date, "date", errors);
        validateDateFormat(settlement.date, "date", errors);
    }

    if(settlement.quantity) validateRequiredNumber(settlement.quantity, "quantity", errors);

    if(settlement.value) validateRequiredNumber(settlement.value, "value", errors);

    if(settlement.conceptId) validateRequiredNumber(settlement.conceptId, "conceptId", errors);
    
    if(settlement.employeeId) validateRequiredNumber(settlement.employeeId, "employeeId", errors);

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

function settlementNewData(data) {
    let settlementNew = {};
    if(data.date) settlementNew.date = data.date;
    if(data.quantity) settlementNew.quantity = data.quantity;
    if(data.value) settlementNew.value = data.value;
    if(data.conceptId) settlementNew.conceptId = data.conceptId;

    return settlementNew;
}

function validateSettlementQuery(query) {
    let errors = [];

    if(query.employeeId) {
        const employeeId = parseInt(query.employeeId, 10);
        validateRequiredNumber(employeeId, "employeeId", errors)
    };
    
    validateRequiredString(query.startDate, "startDate", errors);
    validateDateFormat(query.startDate, "startDate", errors);

    validateRequiredString(query.endDate, "endDate", errors);
    validateDateFormat(query.endDate, "endDate", errors);

    if(query.conceptType) {
        validateRequiredString(query.conceptType, "conceptType", errors);
        if(query.conceptType !== "DEVENGADO" && query.conceptType !== "DEDUCCION") {
            errors.push("The field conceptType must be \'DEVENGADO\' or \'DEDUCCION\'");
        }
    }

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

module.exports = {
    validateSettlementNewCreation,
    validateUniqueSettlementNew,
    validateSettlementNewUpdate,
    settlementNewData,
    validateSettlementQuery
}
