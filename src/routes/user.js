const { Router } = require('express');
const userRouter = Router();

const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');

userRouter.patch('/edit', authenticateToken, userController.updateUser);

module.exports = userRouter;