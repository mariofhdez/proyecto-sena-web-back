/**
 * @fileoverview Configuración de las rutas de usuario de la aplicación
 * @requires express
 * @requires ../controllers/userController
 * @requires ../middlewares/auth
 */

const { Router } = require('express');
const userRouter = Router();

const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * Ruta para editar un usuario
 * @name patch/edit
 * @function
 * @memberof module:routes/user~userRouter
 * @inner
 * @param {string} path - Ruta de la API para editar un usuario
 * @param {function} middleware - Middleware para autenticar el token
 * @param {function} controller - Controlador que maneja la lógica para actualizar un usuario
 */
userRouter.patch('/edit', authenticateToken, userController.updateUser);

module.exports = userRouter;