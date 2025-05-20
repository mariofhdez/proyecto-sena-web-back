const settlementDeductionService = require('../services/settlementDeductionService');

exports.retrieve = async (req, res, next) => {
    try {
        const settlementDeductions = await settlementDeductionService.retrieve();
        res.json(settlementDeductions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getDeductionsById = async (req, res, next) => {
    try {
        const deduction = await settlementDeductionService.getById(parseInt(req.params.id, 10));
        res.json(deduction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createDeduction = async (req, res, next) => {
    try {
        const data = {
            value: req.body.value,
            settlement: {
                connect: {
                    id: req.body.settlementId
                }
            }
        }
        const deduction = await settlementDeductionService.create(data);
        res.json(deduction)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateDeduction = async (req, res, next) => {
    try {
        const updatedSettlementDeduction = await settlementDeductionService.update(parseInt(req.params.id, 10), req.body);
        res.json(updatedSettlementDeduction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteDeduction = async (req, res, next) => {
    try {
        await settlementDeductionService.delete(parseInt(req.params.id, 10));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}