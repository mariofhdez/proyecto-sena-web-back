const { validateRequiredString, validateDateFormat, splitDate } = require('./typeofValidations');
const periodService = require('../services/periodService');

async function validatePeriodCreation(data) {
    let errors = [];

    // Valida que la fecha de inicio sea una fecha correcta
    validateRequiredString(data.startDate, "startDate", errors);
    validateDateFormat(data.startDate, "startDate", errors);

    // Valida que la fecha de fin sea una fecha correcta
    validateRequiredString(data.endDate, "endDate", errors);
    validateDateFormat(data.endDate, "endDate", errors);

    // Valida que la fecha de inicio sea menor a la fecha de fin
    if(data.startDate > data.endDate) {
        errors.push('The start date must be before the end date');
    }

    // Valida que el periodo no exista
    await validateUniquePeriod(data.startDate, data.endDate, errors);

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
    if(lenght > 0) {
        return errors.push('The period already exists')
    }
}

module.exports = {
    validatePeriodCreation
}