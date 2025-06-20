const { validateRequiredString, validateDateFormat, splitDate, fromTimestampToDate } = require('./typeofValidations');
const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('./appError');
const { formatDate } = require('./formatDate');
const { verifyId } = require('./verifyId');
const { validateSettlementCreation } = require('./settlementValidation');
const payrollController = require('../controllers/payrollController');

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
    return settlements;

}

async function settlePeriod(periodId) {
    // TODO: Implementar la lógica para liquidar el periodo
}

module.exports = {
    validatePeriodCreation,
    createPeriod,
    loadEmployees,
    settlePeriod
}