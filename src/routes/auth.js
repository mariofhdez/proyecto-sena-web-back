const { Router } = require('express');
const authRouter = Router();

/**
 * #####     Router Auth     #####
 * El rol principal de este fichero es enrutar las peticiones del usuario
 * al respectivo controlador
 * 
 * Este código usa una librería de express que permite gestionar facilmente este funcionamiento
 */

const { register, login } = require('../controllers/authController');

authRouter.post('/register', register);
authRouter.post('/login', login);

module.exports = authRouter;