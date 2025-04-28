const { Router } = require('express');
const adminRouter = Router();

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/auth');

adminRouter.get('/users', authenticateToken, adminController.users);
adminRouter.patch('/deactivate-user/:id', authenticateToken, adminController.deactivateUser);

module.exports = adminRouter;