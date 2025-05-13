const express = require('express');
const payrollNewRouter = express.Router();
const payrollNewController = require('../controllers/payrollNewController');

payrollNewRouter.get('/', payrollNewController.getNews);
payrollNewRouter.get('/:id', payrollNewController.getNew);
payrollNewRouter.post('/', payrollNewController.createNew);
payrollNewRouter.patch('/:id', payrollNewController.updateNew);
payrollNewRouter.delete('/:id', payrollNewController.deleteNew);

module.exports = payrollNewRouter;