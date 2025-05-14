/**
 * @fileoverview Configuración de las rutas para la gestión de períodos de nómina
 * @requires express
 * @requires ../controllers/payrollPeriodController
 */

const { Router } = require('express');
const payrollPeriodRouter = Router();
const payrollPeriodController = require('../controllers/payrollPeriodController');

/**
 * Ruta para obtener todos los períodos de nómina
 * @name get/payroll-periods
 * @function
 * @memberof module:routes/payrollPeriod~payrollPeriodRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para obtener todos los períodos
 */
payrollPeriodRouter.get('/', payrollPeriodController.getPeriods);

/**
 * Ruta para obtener un período de nómina específico por ID
 * @name get/payroll-periods/:id
 * @function
 * @memberof module:routes/payrollPeriod~payrollPeriodRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del período
 * @param {function} controller - Controlador que maneja la lógica para obtener un período por ID
 */
payrollPeriodRouter.get('/:id', payrollPeriodController.getPeriod);

/**
 * Ruta para crear un nuevo período de nómina
 * @name post/payroll-periods
 * @function
 * @memberof module:routes/payrollPeriod~payrollPeriodRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para crear un nuevo período
 */
payrollPeriodRouter.post('/', payrollPeriodController.createPeriod);

/**
 * Ruta para actualizar un período de nómina por ID
 * @name put/payroll-periods/:id
 * @function
 * @memberof module:routes/payrollPeriod~payrollPeriodRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del período
 * @param {function} controller - Controlador que maneja la lógica para actualizar un período
 */
payrollPeriodRouter.put('/:id', payrollPeriodController.updatePeriod);

/**
 * Ruta para eliminar un período de nómina por ID
 * @name delete/payroll-periods/:id
 * @function
 * @memberof module:routes/payrollPeriod~payrollPeriodRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del período
 * @param {function} controller - Controlador que maneja la lógica para eliminar un período
 */
payrollPeriodRouter.delete('/:id', payrollPeriodController.deletePeriod);

module.exports = payrollPeriodRouter;
