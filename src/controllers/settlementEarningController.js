const settlementEarningService = require('../services/settlementEarningService');

exports.retrieve = async (req, res, next) => {
    try {
        const settlementEarnings = await settlementEarningService.retrieve();
        res.json(settlementEarnings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getEarningsById = async (req, res, next) => {
    try {
        const earning = await settlementEarningService.getById(parseInt(req.params.id, 10));
        res.json(earning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createEarning = async (req, res, next) => {
    try {
        const data = {
            value: req.body.value,
            settlement: {
                connect: {
                    id: req.body.settlementId
                }
            }
        }
        const earning = await settlementEarningService.create(data);
        res.json(earning)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateEarning = async (req, res, next) => {
    try {
        const updatedSettlementEarning = await settlementEarningService.update(parseInt(req.params.id, 10), req.body);
        res.json(updatedSettlementEarning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteEarning = async (req, res, next) => {
    try {
        await settlementEarningService.delete(parseInt(req.params.id, 10));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}