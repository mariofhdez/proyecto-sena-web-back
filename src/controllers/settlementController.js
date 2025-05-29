const settlementService = require('../services/settlementService');
const { formatDate } = require('../utils/formatDate');
const payrollController = require('./payrollController');
const { validateSettlementQuery, validateSettlementCreation, validateUniqueSettlement, verifySettlement } = require('../utils/settlementValidation');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { verifyId } = require('../utils/verifyId');
const { validateRequiredNumber, isValidNumericType } = require('../utils/typeofValidations');

exports.retriveSettlements = async (req, res, next) => {
    try {
        const queryParams = req.query;
        if (Object.keys(queryParams).length > 0) {
            const settlements = await getSettlementByParams(queryParams);
            res.json(settlements);
            console.log('aqui tamo');
        } else {
            const settlements = await getAllSettlements();
            res.json(settlements);
        }
    } catch (error) {
        next(error);
    }
}

exports.getSettlementById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const settlement = await settlementService.getById(id);
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

exports.createSettlement = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate } = req.body;

        const validationResult = validateSettlementCreation(req.body);
        if (!validationResult.isValid) throw new ValidationError('Settlement was not created', validationResult.errors);

        const isUniqueSettlement = await validateUniqueSettlement(req.body.employeeId, req.body.startDate, req.body.endDate);
        if (!isUniqueSettlement.isValid) throw new ValidationError('Settlement was not created', isUniqueSettlement.errors);

        // Validar que el empleado exista
        const isValidEmployee = await verifyId(parseInt(req.body.employeeId, 10), "employee");
        if (!isValidEmployee) throw new NotFoundError('Employee with id \'' + req.body.employeeId + '\' was not found');

        // 1. Crear nómina
        const settlement = await payrollController.createSettlement(employeeId, startDate, endDate);
        await payrollController.createRegularNews(employeeId, endDate);
        res.json(settlement);

    } catch (error) {
        next(error);
    }
}

exports.updateSettlement = async (req, res, next) => {
    //TODO
    res.status(403).json({ error: "Servicio no disponible" });
}

exports.deleteSettlement = async (req, res, next) => {
    //TODO
    res.status(403).json({ error: "Servicio no disponible" });
}

exports.settlePayroll = async (req, res, next) => {
    try {
        const settlementId = parseInt(req.body.settlementId, 10);
        let errors = [];

        const validationResult = validateRequiredNumber(req.body.settlementId, "settlementId", errors);
        if (errors.length > 0) throw new ValidationError('Payroll was not settled', errors);
        // Validar que el id sea un número
        if (!isValidNumericType(settlementId)) throw new ValidationError('The field settlementId must be a numeric value.');


        // Validar que la liquidación exista
        const isValidSettlement = await verifySettlement(parseInt(settlementId, 10), "settlement");
        if (!isValidSettlement) throw new NotFoundError('Settlement with id \'' + settlementId + '\' was not found');

        // Validar que la liquidación no esté ya liquidada
        if (isValidSettlement.status === 'OPEN') throw new ValidationError('Payroll was not settled', 'Payroll with id \'' + settlementId + '\' is already settled');


        const settlement = await payrollController.settlePayroll(settlementId);
        if (!settlement) throw new Error('Error al liquidar nómina');
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

exports.closePayroll = async (req, res, next) => {
    try {
        const settlementId = parseInt(req.body.settlementId, 10);
        let errors = [];

        const validationResult = validateRequiredNumber(req.body.settlementId, "settlementId", errors);
        if (errors.length > 0) throw new ValidationError('Payroll was not closed', errors);
        // Validar que el id sea un número
        if (!isValidNumericType(settlementId)) throw new ValidationError('The field settlementId must be a numeric value.');

        // Validar que la liquidación exista
        const isValidSettlement = await verifySettlement(parseInt(settlementId, 10), "settlement");
        if (!isValidSettlement) throw new NotFoundError('Settlement with id \'' + settlementId + '\' was not found');

        // Validar que la liquidación no esté ya cerrada
        switch (isValidSettlement.status) {
            case 'DRAFT':
                throw new ValidationError('Payroll was not closed', 'Payroll with id \'' + settlementId + '\' is not calculated');
                break;
            case 'CLOSED':
                throw new ValidationError('Payroll was not closed', 'Payroll with id \'' + settlementId + '\' is already closed');
                break;
            case 'VOID':
                throw new ValidationError('Payroll was not closed', 'Payroll with id \'' + settlementId + '\' is void');
                break;
            default:
                break;
        }
        const settlement = await payrollController.closePayroll(settlementId);
        if (!settlement) throw new Error('Error al cerrar nómina');
        res.json(settlement);
    } catch (error) {
        next(error);
    }
}

getAllSettlements = async () => {
    const settlements = await settlementService.getAll();
    return settlements;
}

getSettlementByParams = async (params) => {
    const queryValidation = validateSettlementQuery(params);
    if (!queryValidation.isValid) throw new ValidationError('Settlement was not retrieved', queryValidation.errors);

    let query = {
        startDate: formatDate(params.startDate),
        endDate: formatDate(params.endDate)
    }
    if (params.employeeId) {
        query.employeeId = parseInt(params.employeeId, 10)
    }
    const settlement = await settlementService.query(query);
    return settlement;
}
