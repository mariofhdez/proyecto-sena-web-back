const { validateRequiredString, validateRequiredNumber, validateDateFormat, splitDate } = require("./typeofValidations");
const settlementNewService = require('../services/settlementNewService');
const employeeService = require('../services/employeeService');
const { verifyId } = require('./verifyId');
const { NotFoundError, ValidationError } = require('./appError');
const { formatDate } = require('./formatDate');

const { getCalculationType, getBaseType, getConceptFactor } = require('../utils/payrollConcepts');

async function validateSettlementNewCreation(settlement) {
    console.log(settlement);
    let errors = [];
    let data = {
        date: null,
        employee:{connect: {id: null}},
        concept: {connect:{id: null}},
        quantity: null,
        value: null,
        status: 'NONE'
    };

    // Validar fecha
    validateRequiredString(settlement.date, "date", errors);
    validateDateFormat(settlement.date, "date", errors);
    data.date = formatDate(settlement.date);

    // ******* Empleado *******
    // Validar que el campo empleado se incluya
    validateRequiredNumber(settlement.employeeId, "employeeId", errors);
    // Valida que el empleado exista
    const isValidEmployee = await verifyId(parseInt(settlement.employeeId, 10), "employee");
    if (!isValidEmployee) throw new NotFoundError('Employee with id \'' + settlement.employeeId + '\' was not found');
    data.employee.connect.id = settlement.employeeId;

    // ******* Concepto *******
    // Validar concepto
    validateRequiredNumber(settlement.conceptId, "conceptId", errors);
    // Valida que el concepto exista
    const isValidConcept = await verifyId(parseInt(settlement.conceptId, 10,), 'payrollConcept');
    if (!isValidConcept) throw new NotFoundError('Concept with id \'' + settlement.conceptId + '\' was not found');
    data.concept.connect.id = settlement.conceptId;

    // En caso de ser concepto nominal, validar valor
    if (getCalculationType(settlement.conceptId) === 'NOMINAL') {
        // Validar valor
        validateRequiredNumber(settlement.value, "value", errors);
        data.value = settlement.value;
    }
    // En caso de ser concepto lineal o factorial, validar cantidad
    if (getCalculationType(settlement.conceptId) === "LINEAL" || getCalculationType(settlement.conceptId) === "FACTORIAL") {
        // Validar cantidad
        validateRequiredNumber(settlement.quantity, "quantity", errors);
        data.quantity = settlement.quantity;

        // Calcular valor según la novedad
        // ******* Concepto lineal *******
        if (getCalculationType(settlement.conceptId) === "LINEAL") {
            // Calcular valor según la novedad
            data.value = await calculateLinealValue(settlement.conceptId, settlement.quantity, settlement.employeeId);
        }

        // ******* Concepto factorial *******
        if (getCalculationType(settlement.conceptId) === "FACTORIAL") {
            data.value = await calculateFactorialValue(settlement.conceptId, settlement.quantity, settlement.employeeId, settlement.date);
        }
    }
    // Valida que la novedad no exista en el periodo
    if(errors.length === 0) {
        const isUniqueSettlementNew = await validateUniqueSettlementNew(settlement.employeeId, settlement.conceptId, settlement.date);
        if (!isUniqueSettlementNew) throw new ValidationError('Settlement new was not created', "The settlement new with the concept id \'" + settlement.conceptId + "\' and the employee id \'" + settlement.employeeId + "\' already exists on period");
    }

    console.log(data);
    if(errors.length > 0) return {errors: errors};
    return data;
}

async function validateSettlementNewPreload(settlement) {
    console.log(settlement);
    let errors = [];
    let data = {
        employee:{connect: {id: null}},
        concept: {connect:{id: null}},
        quantity: null,
        value: null
    };

    // ******* Empleado *******
    // Validar que el campo empleado se incluya
    validateRequiredNumber(settlement.employeeId, "employeeId", errors);
    // Valida que el empleado exista
    const isValidEmployee = await verifyId(parseInt(settlement.employeeId, 10), "employee");
    if (!isValidEmployee) throw new NotFoundError('Employee with id \'' + settlement.employeeId + '\' was not found');
    data.employee.connect.id = settlement.employeeId;

    // ******* Concepto *******
    // Validar concepto
    validateRequiredNumber(settlement.conceptId, "conceptId", errors);
    // Valida que el concepto exista
    const isValidConcept = await verifyId(parseInt(settlement.conceptId, 10,), 'payrollConcept');
    if (!isValidConcept) throw new NotFoundError('Concept with id \'' + settlement.conceptId + '\' was not found');
    data.concept.connect.id = settlement.conceptId;

    // En caso de ser concepto nominal, validar valor
    if (getCalculationType(settlement.conceptId) === 'NOMINAL') {
        // Validar valor
        validateRequiredNumber(settlement.value, "value", errors);
        data.value = settlement.value;
    }
    // En caso de ser concepto lineal o factorial, validar cantidad
    if (getCalculationType(settlement.conceptId) === "LINEAL" || getCalculationType(settlement.conceptId) === "FACTORIAL") {
        // Validar cantidad
        validateRequiredNumber(settlement.quantity, "quantity", errors);
        data.quantity = settlement.quantity;

        // Calcular valor según la novedad
        // ******* Concepto lineal *******
        if (getCalculationType(settlement.conceptId) === "LINEAL") {
            // Calcular valor según la novedad
            data.value = await calculateLinealValue(settlement.conceptId, settlement.quantity, settlement.employeeId);
        }

        // ******* Concepto factorial *******
        if (getCalculationType(settlement.conceptId) === "FACTORIAL") {
            data.value = await calculateFactorialValue(settlement.conceptId, settlement.quantity, settlement.employeeId, settlement.date);
        }
    }

    if(errors.length > 0) return {errors: errors};
    return data;
}

async function calculateLinealValue(conceptId, quantity, employeeId) {
    const base = await getBase(conceptId, employeeId);
    const value = base * quantity;
    return Math.round(value * 100) / 100;
}

async function calculateFactorialValue(conceptId, quantity, employeeId, date) {
    const base = await getBase(conceptId, employeeId, date);
    const factor = getConceptFactor(conceptId);
    const value = base * quantity * factor;

    return Math.round(value * 100) / 100;
}

async function getBase(conceptId, employeeId, date) {
    const baseType = getBaseType(conceptId);
    const employee = await employeeService.getById(employeeId);

    switch (baseType) {
        case "ALLOWANCE":
            return 200000 / 30;
            break
        case "HOURLY":
            return employee.salary / 198;
            break
        case "SALARY":
            return employee.salary / 30;
            break
        case "INCOME":
            return await getPeriodBase(employeeId, date, "INCOME");
            break
        case "VACATION":
            return await getPeriodBase(employeeId, date, "VACATION");
            break
        case "IBC":
            return await getPeriodBase(employeeId, date, "IBC");
            break
        case "ZERO":
            return 0;
            break
    }
}

async function getPeriodBase(employeeId, date, type) {
    let periodNews = [];
    const [year, month, day] = date.split('-').map(Number);
    let query = {
        employeeId: employeeId,
        date: {
            gte: new Date(year, month - 1, '00'),
            lte: new Date(year, month - 1, '32')
        }
    }

    if (type === "INCOME") {
        query.concept = {
            isIncome: true
        }
    }
    if (type === "VACATION") {
        query.concept = {
            isVacation: true
        }
    }
    if (type === "IBC") {
        query.concept = {
            isIBC: true
        }
    }

    periodNews = await settlementNewService.query(query);
    const base = periodNews.reduce((sum, item) => sum + item.value, 0) / 30;
    return Math.round(base * 100) / 100;
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

function validateAvailableConcept(conceptId) {

    const unavailableConcepts = [1, 17, 41, 42, 43, 44]

    if (unavailableConcepts.includes(conceptId)) {
        return {
            isValid: false,
            errors: ["The concept is not available for settlements new"]
        };
    }
    return {
        isValid: true
    };
}

function validateSettlementNewUpdate(settlement) {
    let errors = [];

    if (settlement.date) {
        validateRequiredString(settlement.date, "date", errors);
        validateDateFormat(settlement.date, "date", errors);
    }

    if (settlement.quantity) validateRequiredNumber(settlement.quantity, "quantity", errors);

    if (settlement.value) validateRequiredNumber(settlement.value, "value", errors);

    if (settlement.conceptId) validateRequiredNumber(settlement.conceptId, "conceptId", errors);

    if (settlement.employeeId) validateRequiredNumber(settlement.employeeId, "employeeId", errors);

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

function settlementNewData(data) {
    let settlementNew = {};
    if (data.date) settlementNew.date = formatDate(data.date);
    if (data.quantity) settlementNew.quantity = data.quantity;
    if (data.value) settlementNew.value = data.value;
    if (data.conceptId) settlementNew.conceptId = data.conceptId;

    return settlementNew;
}

function validateSettlementNewQuery(query) {
    let errors = [];

    if (query.employeeId) {
        const employeeId = parseInt(query.employeeId, 10);
        validateRequiredNumber(employeeId, "employeeId", errors)
    };

    validateRequiredString(query.startDate, "startDate", errors);
    validateDateFormat(query.startDate, "startDate", errors);

    validateRequiredString(query.endDate, "endDate", errors);
    validateDateFormat(query.endDate, "endDate", errors);

    if (query.conceptType) {
        validateRequiredString(query.conceptType, "conceptType", errors);
        if (query.conceptType !== "DEVENGADO" && query.conceptType !== "DEDUCCION") {
            errors.push("The field conceptType must be \'DEVENGADO\' or \'DEDUCCION\'");
        }
    }

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

module.exports = {
    validateSettlementNewCreation,
    validateSettlementNewPreload,
    validateUniqueSettlementNew,
    validateSettlementNewUpdate,
    settlementNewData,
    validateSettlementNewQuery,
    validateAvailableConcept
}
