const { validateRequiredNumber, validateRequiredString, validateDateFormat, isValidNumericType } = require("./typeofValidations");
const settlementService = require("../services/settlementService");
const { splitDate, fromTimestampToDate } = require("./typeofValidations");
const { NotFoundError } = require("./appError");
const { verifyId } = require("./verifyId");
const { formatDate } = require("./formatDate");
const settlementDetailService = require("../services/settlementDetailService");
const { ValidationError } = require("./appError");
const settlementCalculationEngine = require("../services/settlementCalculationEngine");
const employeeService = require("../services/employeeService");

function validateSettlementQuery(params) {
    let errors = [];
    let query = {
        employeeId: null,
        startDate: null,
        endDate: null,
        periodId: null
    }

    if (params.employeeId) {
        const employeeId = parseInt(params.employeeId, 10);
        validateRequiredNumber(employeeId, "employeeId", errors)
        query.employeeId = employeeId;
    } else {
        delete query.employeeId;
    }

    if(params.startDate || params.endDate) {
        validateRequiredString(params.startDate, "startDate", errors);
        validateDateFormat(params.startDate, "startDate", errors);
    
        validateRequiredString(params.endDate, "endDate", errors);
        validateDateFormat(params.endDate, "endDate", errors);
        query.startDate = formatDate(params.startDate);
        query.endDate = formatDate(params.endDate);
    } else {
        delete query.startDate;
        delete query.endDate;
    }

    if(params.periodId) {
        const periodId = parseInt(params.periodId, 10);
        validateRequiredNumber(periodId, "periodId", errors);
        query.periodId = periodId;
    } else {
        delete query.periodId;
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return query;
}

async function validateSettlementCreation(settlement) {
    let errors = [];
    console.log(settlement);
    let data = {
        employee: {connect: {id: null}},
        startDate: null,
        endDate: null,
        status: 'DRAFT',
        earningsValue: 0,
        deductionsValue: 0,
        totalValue: 0,
        period: {connect: {id: null}}
    }

    // Valida que el id del empleado sea un numero
    validateRequiredNumber(settlement.employeeId, "employeeId", errors);
    const employee = await employeeService.getById(settlement.employeeId);
    if (!employee) throw new NotFoundError('Employee with id \'' + settlement.employeeId + '\' was not found');
    if (!employee.isActive) throw new ValidationError('The employee is inactive');
    data.employee.connect.id = settlement.employeeId;

    // Valida que la fecha de inicio sea una fecha
    validateRequiredString(settlement.startDate, "startDate", errors);
    validateDateFormat(settlement.startDate, "startDate", errors);
    data.startDate = formatDate(settlement.startDate);

    // Valida que la fecha de fin sea una fecha
    validateRequiredString(settlement.endDate, "endDate", errors);
    validateDateFormat(settlement.endDate, "endDate", errors);
    data.endDate = formatDate(settlement.endDate);

    // Valida que la fecha de fin sea mayor que la fecha de inicio
    if (settlement.endDate <= settlement.startDate) {
        errors.push("The end date must be greater than the start date");
    }
    validateSettlementPeriod(settlement.startDate, settlement.endDate, errors);

    if(settlement.periodId) {
        const isValidPeriod = await verifyId(parseInt(settlement.periodId, 10), "period");
        if(!isValidPeriod) throw new NotFoundError('Period with id \'' + settlement.periodId + '\' was not found');
        data.period.connect.id = settlement.periodId;
    } else {
        delete data.period;
    }

    await validateUniqueSettlement(settlement.employeeId, settlement.startDate, settlement.endDate, errors);

    console.log(errors);
    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return data;
}

function validateSettlementPeriod(startDate, endDate, errors) {
    const splitStartDate = splitDate(startDate);
    const splitEndDate = splitDate(endDate);
    if (splitStartDate.year !== splitEndDate.year || splitStartDate.month !== splitEndDate.month) {
        errors.push("The start date and end date must be in the same period");
    }
}

async function validateUniqueSettlement(employee, startDate, endDate, errors) {
    const employeeId = parseInt(employee, 10);

    const query = {
        employeeId: employeeId,
        startDate: {
            gte: formatDate(startDate),
            lte: formatDate(endDate)
        },
        endDate: {
            gte: formatDate(endDate),
            lte: formatDate(endDate)
        },
    }
    const settlement = await settlementService.getAll(query);
    const lenght = settlement.length;
    if (lenght > 0) {
        return errors.push("The settlement for the period already exists")
    }
    console.log('unique: ',settlement)
}

async function verifySettlement(settlementId) {
    const settlement = await settlementService.getById(settlementId);
    return settlement;
}

async function calculateSettlement(settlementId) {
    let errors = [];
        let data ={
            details: {create: []}
        }

        const validationResult = validateRequiredNumber(settlementId, "settlementId", errors);
        if (errors.length > 0) throw new ValidationError('Payroll was not settled', errors);
        // Validar que el id sea un número
        if (!isValidNumericType(settlementId)) throw new ValidationError('The field settlementId must be a numeric value.');


        let settlement = await settlementService.getById(settlementId);
        // Validar que la liquidación exista
        if (!settlement) throw new NotFoundError('Settlement with id \'' + settlementId + '\' was not found');

        // Validar que la liquidación no esté ya liquidada
        if (settlement.status === 'OPEN') throw new ValidationError('Payroll was not settled', 'Payroll with id \'' + settlementId + '\' is already settled');

        const settlementCalculated = await settlementCalculationEngine.generateSettlement(settlement.employeeId, settlement.periodId, fromTimestampToDate(settlement.startDate), fromTimestampToDate(settlement.endDate));
        if (!settlementCalculated) throw new Error('Error al liquidar nómina');

        data.employeeId = settlementCalculated.employeeId;
        data.periodId = settlementCalculated.periodId;
        data.startDate = settlementCalculated.startDate;
        data.endDate = settlementCalculated.endDate;
        data.status = settlementCalculated.status;
        data.earningsValue = settlementCalculated.earningsValue;
        data.deductionsValue = settlementCalculated.deductionsValue;
        data.totalValue = settlementCalculated.totalValue;
        data.details.create = settlementCalculated.details;

        const updatedSettlement = await settlementService.update(settlement.id, data);
        if (!updatedSettlement) throw new Error('Error al crear nómina');
        return updatedSettlement;
}

async function removeSettlement(id) {
    if (!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');
    const settlement = await settlementService.getById(id);
    if (!settlement) throw new NotFoundError('Settlement with id \'' + id + '\' was not found');
    
    if (settlement.details.length > 0) {
        for (const detail of settlement.details) {
            console.log('eliminando detalle');
            const deletedDetail = await settlementDetailService.remove(detail.id);
            if (!deletedDetail) throw new Error('Error al eliminar detalle');
        }
    }
    console.log('settlementValidation: remove settlement', settlement);
    
    const deletedSettlement = await settlementService.remove(settlement.id);
    if (!deletedSettlement) throw new Error('Error al eliminar nómina');
    return deletedSettlement;
}

async function closeSettlement(settlementId) {
    const settlement = await settlementService.getById(settlementId);
    if (!settlement) throw new NotFoundError('Settlement with id \'' + settlementId + '\' was not found');
    const updatedSettlement = await settlementService.update(settlementId, {status: 'CLOSED'});
    if (!updatedSettlement) throw new Error('Error al cerrar nómina');
    return updatedSettlement;
}

module.exports = {
    validateSettlementQuery,
    validateSettlementCreation,
    validateUniqueSettlement,
    verifySettlement,
    removeSettlement,
    calculateSettlement,
    closeSettlement
}
