const { validateRequiredString, validateDateFormat } = require('./typeofValidations');
const periodService = require('../services/periodService');
const { NotFoundError, ValidationError } = require('./appError');
const { verifyId } = require('./verifyId');

/**
 * Valida la creación de un período
 */
async function validatePeriodCreation(data) {
    let errors = [];

    // Validar campo period
    if (!data.period || typeof data.period !== 'string') {
        errors.push('The field period is required and must be a string');
    }

    // Validar fecha de inicio
    validateRequiredString(data.startDate, "startDate", errors);
    validateDateFormat(data.startDate, "startDate", errors);

    // Validar fecha de fin
    validateRequiredString(data.endDate, "endDate", errors);
    validateDateFormat(data.endDate, "endDate", errors);

    // Validar que la fecha de inicio sea menor a la fecha de fin
    if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
        errors.push('The start date must be before the end date');
    }

    // Validar que no haya solapamiento con otros períodos
    if (data.startDate && data.endDate) {
        await validateNoOverlap(data.startDate, data.endDate, errors);
    }

    // Validar estado (solo OPEN o CLOSED)
    if (data.status && !['OPEN', 'CLOSED'].includes(data.status)) {
        errors.push('Status must be either OPEN or CLOSED');
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

/**
 * Valida que no haya solapamiento con otros períodos
 */
async function validateNoOverlap(startDate, endDate, errors) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const overlappingPeriods = await periodService.query({
        OR: [
            {
                AND: [
                    { startDate: { lte: start } },
                    { endDate: { gte: start } }
                ]
            },
            {
                AND: [
                    { startDate: { lte: end } },
                    { endDate: { gte: end } }
                ]
            },
            {
                AND: [
                    { startDate: { gte: start } },
                    { endDate: { lte: end } }
                ]
            }
        ]
    });

    if (overlappingPeriods.length > 0) {
        errors.push('Period dates overlap with existing periods');
    }
}

/**
 * Crea un nuevo período
 */
async function createPeriod(data) {
    const periodData = {
        period: data.period,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentDate: data.paymentDate || null,
        status: data.status || 'OPEN'
    };
    
    const period = await periodService.create(periodData);
    return period;
}

/**
 * Actualiza un período
 */
async function updatePeriod(id, data) {
    const period = await periodService.getById(id);
    if (!period) {
        throw new NotFoundError('Period not found');
    }

    // Validar fechas si se están actualizando
    if (data.start_date || data.end_date) {
        const startDate = data.start_date || period.start_date;
        const endDate = data.end_date || period.end_date;
        
        if (new Date(startDate) >= new Date(endDate)) {
            throw new ValidationError('The start date must be before the end date');
        }
    }

    const updatedPeriod = await periodService.update(id, data);
    return updatedPeriod;
}

/**
 * Cierra un período
 */
async function closePeriod(periodId) {
    const period = await periodService.getById(periodId);
    if (!period) {
        throw new NotFoundError('Period not found');
    }
    
    if (period.status !== 'OPEN') {
        throw new ValidationError('Only open periods can be closed');
    }

    const closedPeriod = await periodService.closePeriod(periodId);
    return closedPeriod;
}

/**
 * Abre un período
 */
async function openPeriod(periodId) {
    const period = await periodService.getById(periodId);
    if (!period) {
        throw new NotFoundError('Period not found');
    }
    
    if (period.status !== 'CLOSED') {
        throw new ValidationError('Only closed periods can be opened');
    }

    const openedPeriod = await periodService.openPeriod(periodId);
    return openedPeriod;
}

/**
 * Elimina un período
 */
async function deletePeriod(periodId) {
    const period = await periodService.getById(periodId);
    if (!period) {
        throw new NotFoundError('Period not found');
    }
    
    if (period.status !== 'OPEN') {
        throw new ValidationError('Only open periods can be deleted');
    }

    const deletedPeriod = await periodService.delete(periodId);
    return deletedPeriod;
}

/**
 * Obtiene el período abierto actual
 */
async function getOpenPeriod() {
    const openPeriod = await periodService.getOpenPeriod();
    return openPeriod;
}

module.exports = {
    validatePeriodCreation,
    createPeriod,
    updatePeriod,
    closePeriod,
    openPeriod,
    deletePeriod,
    getOpenPeriod
}