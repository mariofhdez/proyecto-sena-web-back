const { Router } = require('express');
const adminRouter = Router();

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/auth');

adminRouter.get('/users', authenticateToken, adminController.users);
adminRouter.get('/users/:id', authenticateToken, adminController.getUser);
adminRouter.patch('/deactivate-user/:id', authenticateToken, adminController.deactivateUser);
adminRouter.delete('/delete/:id', authenticateToken, adminController.deleteUser);

module.exports = adminRouter;