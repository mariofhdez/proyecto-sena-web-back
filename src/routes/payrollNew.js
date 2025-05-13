const express = require('express');
const newRouter = express.Router();
const payrollNewController = require('../controllers/payrollNewController');

newRouter.get('/', payrollNewController.getNews);
newRouter.get('/:id', payrollNewController.getNew);
newRouter.post('/', payrollNewController.createNew);
newRouter.patch('/:id', payrollNewController.updateNew);
newRouter.delete('/:id', payrollNewController.deleteNew);

module.exports = newRouter;