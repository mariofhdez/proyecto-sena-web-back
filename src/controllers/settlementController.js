const settlementService = require('../services/settlementService');
const { formatDate } = require('../utils/formatDate');
const payrollController = require('./payrollController');
const { validateSettlementQuery, validateSettlementCreation, validateUniqueSettlement } = require('../utils/settlementValidation');
const { ValidationError } = require('../utils/appError');

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
        const { startDate, endDate, settlementId } = req.body;
        const settlement = await payrollController.settlePayroll(settlementId, startDate, endDate);
        if (!settlement) throw new Error('Error al liquidar nómina');
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
