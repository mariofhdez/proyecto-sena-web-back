const express = require('express');
const settlementRouter = express.Router();
const settlementController = require('../controllers/settlementController');

settlementRouter.get('/', settlementController.retriveSettlements);
settlementRouter.get('/:id', settlementController.getSettlementById);
settlementRouter.post('/', settlementController.createSettlement);
settlementRouter.patch('/:id', settlementController.updateSettlement);
settlementRouter.delete('/:id', settlementController.deleteSettlement);
settlementRouter.post('/settle', settlementController.settlePayroll);
settlementRouter.post('/close', settlementController.closePayroll);

module.exports = settlementRouter;