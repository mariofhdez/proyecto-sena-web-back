const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../controllers/employeeController');

employeeRouter.get('/', employeeController.getEmployees);
employeeRouter.get('/:id', employeeController.getEmployee);
employeeRouter.post('/', employeeController.createEmployee);
employeeRouter.put('/:id', employeeController.updateEmployee);
employeeRouter.delete('/:id', employeeController.deleteEmployee);

module.exports = employeeRouter;
