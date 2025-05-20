const settlementService = require('../services/settlementService');
const {formatDate} = require('../utils/formatDate')
const payrollController = require('./payrollController');

exports.retriveSettlements = async (req, res, next) => {
    try {
        const settlements = await settlementService.getAll();
        res.json(settlements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getSettlementById = async (req, res, next) => {
    try {
        const settlement = await settlementService.getById(parseInt(req.params.id, 10));
        res.json(settlement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createSettlement = async(req, res, next) => {
    try {

        const { startDate, endDate, employeeId } = req.body;
        // 1. Crear nómina
        const settlement = await payrollController.createSettlement(employeeId, startDate, endDate);
        await payrollController.createRegularNews(employeeId, endDate);
        res.json(settlement);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateSettlement = async(req, res, next) => {
    //TODO
    res.status(403).json({ error: "Servicio no disponible"});
}

exports.deleteSettlement = async(req, res, next) => {
    //TODO
    res.status(403).json({ error: "Servicio no disponible"});
}

exports.settlePayroll = async(req, res, next) => {
    try{
        const { startDate, endDate, settlementId } = req.body;
        const settlement = await payrollController.settlePayroll(settlementId, startDate, endDate);
        if(!settlement) throw new Error('Error al liquidar nómina');
        res.json(settlement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}