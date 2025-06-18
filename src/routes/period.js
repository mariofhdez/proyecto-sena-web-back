const express = require('express');
const periodRouter = express.Router();
const periodController = require('../controllers/periodController');

periodRouter.get('/', periodController.retrievePeriods);
periodRouter.get('/:id', periodController.getPeriodById);
periodRouter.post('/', periodController.createPeriod);
periodRouter.post('/:id/settle', periodController.settlePeriod);
periodRouter.post('/:id/close', periodController.closePeriod);
periodRouter.delete('/:id', periodController.deletePeriod);

module.exports = periodRouter;