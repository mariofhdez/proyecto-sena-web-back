const { validateRequiredString, validateDateFormat, splitDate, fromTimestampToDate } = require('./typeofValidations');
const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('./appError');
const { formatDate } = require('./formatDate');
const { verifyId } = require('./verifyId');
const { validateSettlementCreation } = require('./settlementValidation');
const payrollController = require('../controllers/payrollController');
const settlementService = require('../services/settlementService');

async function validatePeriodCreation(data) {
    let errors = [];

    // Valida que la fecha de inicio sea una fecha correcta
    validateRequiredString(data.startDate, "startDate", errors);
    validateDateFormat(data.startDate, "startDate", errors);

    // Valida que la fecha de fin sea una fecha correcta
    validateRequiredString(data.endDate, "endDate", errors);
    validateDateFormat(data.endDate, "endDate", errors);

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
    return {
        isValid: true
    }
}

async function validateUniquePeriod(startDate, endDate, errors) {
    const splitStartDate = splitDate(startDate);
    const splitEndDate = splitDate(endDate);
    const query = {
        startDate: {
            gte: new Date(splitStartDate.year, splitStartDate.month - 1, '00'),
            lte: new Date(splitStartDate.year, splitStartDate.month - 1, '32')
        },
        endDate: {
            gte: new Date(splitEndDate.year, splitEndDate.month - 1, '00'),
            lte: new Date(splitEndDate.year, splitEndDate.month - 1, '32')
        },
        status: {
            not: "VOID"
        }
    }

    const period = await periodService.query(query);
    const lenght = period.length;
    if (lenght > 0) {
        return errors.push('The period already exists')
    }
}

async function createPeriod(data) {
    const periodData = {
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        status: 'DRAFT'
    }
    const period = await periodService.create(periodData);
    return period;
}

async function loadEmployees(periodId, employees) {

    let settlements = [];

    for (const employee of employees) {
        const isValidEmployee = await verifyId(parseInt(employee, 10), "employee");
        if (!isValidEmployee) {
            throw new NotFoundError('Employee with id \'' + employee + '\' was not found');
        }
    }

    const period = await periodService.getById(periodId);
    if(period.status !== "DRAFT") throw new Error('Period is not available to load employees');

    for (const employee of employees) {
        const data = {
            employeeId: parseInt(employee, 10),
            startDate: fromTimestampToDate(period.startDate),
            endDate: fromTimestampToDate(period.endDate),
            periodId: periodId
        }
        const validateSettlement = await validateSettlementCreation(data);
        if (!validateSettlement.isValid) {
            throw new ValidationError('Settlement was not created', validateSettlement.errors);
        }

        const settlement = await payrollController.createSettlement(data);
        const regularNews = await payrollController.createRegularNews(data.employeeId, data.endDate);
        settlements.push(settlement);
    }

    const sumEmployees = await settlementService.count({
        periodId: periodId
    });
    const updatePeriod = await periodService.update(periodId, { employeesQuantity: sumEmployees });
    console.log(updatePeriod);
    return settlements;

}

async function settlePeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status !== "DRAFT") throw new Error('Period is not available to settle');
    const settlements = period.settlements;

    for(const settlement of settlements){
        const s = await payrollController.settlePayroll(settlement.id);
    }

    const updatedPeriod = await periodService.update(periodId, { status: "OPEN" });
    // TODO: Implementar la lógica para liquidar el periodo
    return updatedPeriod;
}

async function closePeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status !== "OPEN") throw new Error('Period is not available to close');
    const settlements = period.settlements;
    for(const settlement of settlements){
        const s = await payrollController.closePayroll(settlement.id);
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

async function openPeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status !== "CLOSED") throw new Error('Period is not available to open');
    const settlements = period.settlements;
    for(const settlement of settlements){
        const s = await payrollController.openPayroll(settlement.id);
    }
    const updatedPeriod = await periodService.update(periodId, { status: "OPEN" });
    return updatedPeriod;
}

async function draftPeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status !== "OPEN") throw new Error('Period is not available to draft');
    const settlements = period.settlements;
    for(const settlement of settlements){
        const s = await payrollController.draftPayroll(settlement.id);
    }
    const updatedPeriod = await periodService.update(periodId, { status: "DRAFT" });
    return updatedPeriod;
}

async function voidPeriod(periodId) {
    const period = await periodService.getById(periodId);
    if(period.status !== "DRAFT") throw new Error('Period is not available to void');
    const settlements = period.settlements;
    for(const settlement of settlements){
        const s = await payrollController.voidPayroll(settlement.id);
    }
    const updatedPeriod = await periodService.update(periodId, { status: "VOID" });
    return updatedPeriod;
}

module.exports = {
    validatePeriodCreation,
    createPeriod,
    loadEmployees,
    settlePeriod,
    closePeriod,
    deletePeriod,
    openPeriod,
    draftPeriod,
    voidPeriod
}