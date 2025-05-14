/**
 * @fileoverview Configuración de las rutas de empleados de la aplicación
 * @requires express
 * @requires ../controllers/employeeController
 */

const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../controllers/employeeController');

/**
 * Ruta para obtener todos los empleados
 * @name get/employees
 * @function
 * @memberof module:routes/employee~employeeRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para obtener empleados
 */
employeeRouter.get('/', employeeController.getEmployees);

/**
 * Ruta para obtener un empleado por ID
 * @name get/employees/:id
 * @function
 * @memberof module:routes/employee~employeeRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del empleado
 * @param {function} controller - Controlador que maneja la lógica para obtener un empleado por ID
 */
employeeRouter.get('/:id', employeeController.getEmployee);

/**
 * Ruta para crear un nuevo empleado
 * @name post/employees
 * @function
 * @memberof module:routes/employee~employeeRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} controller - Controlador que maneja la lógica para crear un nuevo empleado
 */
employeeRouter.post('/', employeeController.createEmployee);

/**
 * Ruta para actualizar un empleado por ID
 * @name patch/employees/:id
 * @function
 * @memberof module:routes/employee~employeeRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del empleado
 * @param {function} controller - Controlador que maneja la lógica para actualizar un empleado
 */
employeeRouter.patch('/:id', employeeController.updateEmployee);

/**
 * Ruta para eliminar un empleado por ID
 * @name delete/employees/:id
 * @function
 * @memberof module:routes/employee~employeeRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del empleado
 * @param {function} controller - Controlador que maneja la lógica para eliminar un empleado
 */
employeeRouter.delete('/:id', employeeController.deleteEmployee);

module.exports = employeeRouter;
