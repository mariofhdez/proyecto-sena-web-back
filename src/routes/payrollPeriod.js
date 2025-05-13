const { Router } = require('express');
const payrollPeriodRouter = Router();
const payrollPeriodController = require('../controllers/payrollPeriodController');

// Obtener todos los períodos
payrollPeriodRouter.get('/', payrollPeriodController.getPeriods);

// Obtener un período específico
payrollPeriodRouter.get('/:id', payrollPeriodController.getPeriod);

// Crear un nuevo período
payrollPeriodRouter.post('/', payrollPeriodController.createPeriod);

// Actualizar un período
payrollPeriodRouter.put('/:id', payrollPeriodController.updatePeriod);

// Eliminar un período
payrollPeriodRouter.delete('/:id', payrollPeriodController.deletePeriod);

module.exports = payrollPeriodRouter;
