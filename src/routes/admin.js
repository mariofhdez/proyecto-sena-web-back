/**
 * @fileoverview Configuración de las rutas de administración de la aplicación
 * @requires express
 * @requires ../controllers/adminController
 * @requires ../middlewares/auth
 */

const { Router } = require('express');
const adminRouter = Router();

const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * Ruta para obtener todos los usuarios
 * @name get/users
 * @function
 * @memberof module:routes/admin~adminRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} middleware - Middleware para autenticar el token
 * @param {function} controller - Controlador que maneja la lógica para obtener usuarios
 */
adminRouter.get('/users', authenticateToken, adminController.users);

/**
 * Ruta para obtener un usuario por ID
 * @name get/users/:id
 * @function
 * @memberof module:routes/admin~adminRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del usuario
 * @param {function} middleware - Middleware para autenticar el token
 * @param {function} controller - Controlador que maneja la lógica para obtener un usuario por ID
 */
adminRouter.get('/users/:id', authenticateToken, adminController.getUser);

/**
 * Ruta para desactivar un usuario por ID
 * @name patch/deactivate-user/:id
 * @function
 * @memberof module:routes/admin~adminRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del usuario
 * @param {function} middleware - Middleware para autenticar el token
 * @param {function} controller - Controlador que maneja la lógica para desactivar un usuario
 */
adminRouter.patch('/deactivate-user/:id', authenticateToken, adminController.deactivateUser);

/**
 * Ruta para eliminar un usuario por ID
 * @name delete/delete/:id
 * @function
 * @memberof module:routes/admin~adminRouter
 * @inner
 * @param {string} path - Ruta de la API con el ID del usuario
 * @param {function} middleware - Middleware para autenticar el token
 * @param {function} controller - Controlador que maneja la lógica para eliminar un usuario
 */
adminRouter.delete('/delete/:id', authenticateToken, adminController.deleteUser);

module.exports = adminRouter;