const { Router } = require('express');
const adminRouter = Router();

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/auth');

adminRouter.get('/users', authenticateToken, adminController.users);

module.exports = adminRouter;