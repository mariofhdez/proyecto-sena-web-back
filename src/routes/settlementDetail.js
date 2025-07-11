const express = require('express');
const settlementDetailRouter = express.Router();
const settlementDetailController = require('../controllers/settlementDetailController');

settlementDetailRouter.get('/', settlementDetailController.retrieveSettlementDetails);
settlementDetailRouter.get('/:id', settlementDetailController.getSettlementDetailById);
settlementDetailRouter.post('/', settlementDetailController.createSettlementDetail);
settlementDetailRouter.patch('/:id', settlementDetailController.updateSettlementDetail);
settlementDetailRouter.delete('/:id', settlementDetailController.deleteSettlementDetail);
settlementDetailRouter.get('/settlement/:settlementId', settlementDetailController.getSettlementDetailsBySettlement);

module.exports = settlementDetailRouter;