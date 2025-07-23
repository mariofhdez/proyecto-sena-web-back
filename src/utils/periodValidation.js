const { validateRequiredString, validateDateFormat, splitDate, fromTimestampToDate } = require('./typeofValidations');
const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('./appError');
const { formatDate, getMonthName } = require('./formatDate');
const { verifyId } = require('./verifyId');
const { validateSettlementCreation, calculateSettlement, closeSettlement } = require('./settlementValidation');
const settlementService = require('../services/settlementService');

async function validatePeriodCreation(data) {
    let errors = [];
    let period = {
        period: null,
        startDate: null,
        endDate: null,
        status: 'OPEN'
    }
 
    // Valida que la fecha de inicio sea una fecha correcta
    validateRequiredString(data.startDate, "startDate", errors);
    validateDateFormat(data.startDate, "startDate", errors);
    period.startDate = new Date(data.startDate);
    
    const [year, month] = data.startDate.split('-').map(Number);
    period.period = year + ' ' + getMonthName(month);

    // Valida que la fecha de fin sea una fecha correcta
    validateRequiredString(data.endDate, "endDate", errors);
    validateDateFormat(data.endDate, "endDate", errors);
    period.endDate = new Date(data.endDate);

    // Valida que la fecha de inicio sea menor a la fecha de fin
    if (data.startDate > data.endDate) {
        errors.push('The start date must be before the end date');
    }

    // Valida que el periodo no exista
    await validateUniquePeriod(data.startDate, data.endDate, errors);

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return period;
}

async function validateUniquePeriod(startDate, endDate, errors) {
    const query = {
        startDate: {
            gte: formatDate(startDate),
            lte: formatDate(endDate)
        },
        endDate: {
            gte: formatDate(endDate),
            lte: formatDate(endDate)
        }
    }

    const period = await periodService.query(query);
    const lenght = period.length;
    if (lenght > 0) {
        return errors.push('The period already exists')
    }
}

async function loadEmployees(periodId, employees) {

    let settlements = [];
    const period = await periodService.getById(periodId);
    
    for (const employee of employees) {
        const isValidEmployee = await verifyId(parseInt(employee, 10), "employee");
        if (!isValidEmployee) {
            throw new NotFoundError('Employee with id \'' + employee + '\' was not found');
        }
        const settlementData = {
            employeeId: parseInt(employee, 10),
            startDate: fromTimestampToDate(period.startDate),
            endDate: fromTimestampToDate(period.endDate),
            periodId: periodId
        }
        const validateSettlement = await validateSettlementCreation(settlementData);
        if (validateSettlement.errors) {
            throw new ValidationError('Settlement was not created', validateSettlement.errors);
        }
        const settlement = await settlementService.create(validateSettlement);
        settlements.push(settlement);
    }

    const sumEmployees = await settlementService.count({
        periodId: periodId
    });
    const updatePeriod = await periodService.update(periodId, { 
        employeesQuantity: sumEmployees,
        earningsTotal: 0,
        deductionsTotal: 0,
        totalValue: 0
    });
    console.log(updatePeriod);
    return updatePeriod;
}

async function settlePeriod(periodId) {
    const period = await periodService.getById(periodId);
    // if(period.status !== "DRAFT") throw new Error('Period is not available to settle');
    const settlements = period.settlements;

    let earningsTotal = 0;
    let deductionsTotal = 0;
    let totalValue = 0;

    for(const settlement of settlements){
        const s = await calculateSettlement(settlement.id);
        earningsTotal += s.earningsValue;
        deductionsTotal += s.deductionsValue;
        totalValue += s.totalValue;
    }

    const updatedPeriod = await periodService.update(periodId, { 
        status: "OPEN", 
        earningsTotal: earningsTotal, 
        deductionsTotal: deductionsTotal, 
        totalValue: totalValue 
    });
    return updatedPeriod;
}

async function closePeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status !== "OPEN") throw new Error('Period is not available to close');
    const settlements = period.settlements;
    for(const settlement of settlements){
        const s = await closeSettlement(settlement.id);
    }
    const updatedPeriod = await periodService.update(periodId, { status: "CLOSED" });
    return updatedPeriod;
}

async function deletePeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status === "DRAFT"){
        const deletedPeriod = await periodService.delete(periodId);
        return deletedPeriod;
    }
    throw new Error('Cannot delete a period with status: \'' + period.status + '\'');
}

async function draftPeriod(periodId) {
    //TODO: Implementar la lógica para revertir el periodo
    return null;
}

async function voidPeriod(periodId) {
    //TODO: Implementar la lógica para anular el periodo
    return null;
}

module.exports = {
    validatePeriodCreation,
    loadEmployees,
    settlePeriod,
    closePeriod,
    deletePeriod,
    draftPeriod,
    voidPeriod
}