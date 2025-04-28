const { Router } = require('express');
const authRouter = Router();

const { users, register, login } = require('../controllers/authController');

authRouter.post('/register', register);
authRouter.post('/login', login);

module.exports = authRouter;