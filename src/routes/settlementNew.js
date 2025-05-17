/**
 * @fileoverview Configuración de las rutas para la gestión de novedades de nómina
 * @requires express
 * @requires ../controllers/payrollNewController
 */

const express = require('express');
const payrollNewRouter = express.Router();
const payrollNewController = require('../controllers/settlementNewController');

/**
 * Ruta para obtener todas las novedades de nómina
 * @name get/payroll-new
 * @function
 * @memberof module:routes/payrollNew~payrollNewRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para obtener todas las novedades
 */
payrollNewRouter.get('/', payrollNewController.getNews);

/**
 * Ruta para obtener una novedad de nómina por ID
 * @name get/payroll-new/:id
 * @function
 * @memberof module:routes/payrollNew~payrollNewRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID de la novedad
 * @param {function} controller - Controlador que maneja la lógica para obtener una novedad por ID
 */
payrollNewRouter.get('/:id', payrollNewController.getNew);

/**
 * Ruta para crear una nueva novedad de nómina
 * @name post/payroll-new
 * @function
 * @memberof module:routes/payrollNew~payrollNewRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para crear una nueva novedad
 */
payrollNewRouter.post('/', payrollNewController.createNew);

/**
 * Ruta para actualizar una novedad de nómina por ID
 * @name patch/payroll-new/:id
 * @function
 * @memberof module:routes/payrollNew~payrollNewRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID de la novedad
 * @param {function} controller - Controlador que maneja la lógica para actualizar una novedad
 */
payrollNewRouter.patch('/:id', payrollNewController.updateNew);

/**
 * Ruta para eliminar una novedad de nómina por ID
 * @name delete/payroll-new/:id
 * @function
 * @memberof module:routes/payrollNew~payrollNewRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID de la novedad
 * @param {function} controller - Controlador que maneja la lógica para eliminar una novedad
 */
payrollNewRouter.delete('/:id', payrollNewController.deleteNew);

module.exports = payrollNewRouter;