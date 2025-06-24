/**
 * @fileoverview Configuración de las rutas para la gestión de novedades de nómina
 * @requires express
 * @requires ../controllers/payrollNewController
 */

const express = require('express');
const settlementNewRouter = express.Router();
const payrollNewController = require('../controllers/settlementNewController');

/**
 * Ruta para obtener todas las novedades de nómina
 * @name get/payroll-new
 * @function
 * @memberof module:routes/payrollNew~settlementNewRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para obtener todas las novedades
 */
settlementNewRouter.get('/', payrollNewController.retrieveNews);

/**
 * Ruta para obtener una novedad de nómina por ID
 * @name get/payroll-new/:id
 * @function
 * @memberof module:routes/payrollNew~settlementNewRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID de la novedad
 * @param {function} controller - Controlador que maneja la lógica para obtener una novedad por ID
 */
settlementNewRouter.get('/:id', payrollNewController.getNewById);

/**
 * Ruta para crear una nueva novedad de nómina
 * @name post/payroll-new
 * @function
 * @memberof module:routes/payrollNew~settlementNewRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para crear una nueva novedad
 */
settlementNewRouter.post('/', payrollNewController.createNew);

/**
 * Ruta para actualizar una novedad de nómina por ID
 * @name patch/payroll-new/:id
 * @function
 * @memberof module:routes/payrollNew~settlementNewRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID de la novedad
 * @param {function} controller - Controlador que maneja la lógica para actualizar una novedad
 */
settlementNewRouter.patch('/:id', payrollNewController.updateNew);

/**
 * Ruta para eliminar una novedad de nómina por ID
 * @name delete/payroll-new/:id
 * @function
 * @memberof module:routes/payrollNew~settlementNewRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID de la novedad
 * @param {function} controller - Controlador que maneja la lógica para eliminar una novedad
 */
settlementNewRouter.delete('/:id', payrollNewController.deleteNew);

settlementNewRouter.post('/:id/draft', payrollNewController.draftNew);

module.exports = settlementNewRouter;