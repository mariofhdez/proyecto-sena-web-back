/**
 * @fileoverview Configuración de las rutas de autenticación de la aplicación
 * @requires express
 * @requires ../controllers/authController
 */

const { Router } = require('express');
const authRouter = Router();

const { register, login } = require('../controllers/authController');

/**
 * Ruta para el registro de nuevos usuarios
 * @name post/register
 * @function
 * @memberof module:routes/auth~authRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} middleware - Controlador que maneja la lógica de registro
 */
authRouter.post('/register', register);

/**
 * Ruta para el inicio de sesión de usuarios
 * @name post/login
 * @function
 * @memberof module:routes/auth~authRouter
 * @inner
 * @param {string} path - Ruta de la API
 * @param {function} middleware - Controlador que maneja la lógica de inicio de sesión
 */
authRouter.post('/login', login);

module.exports = authRouter;