const { Router } = require('express');
const router = Router();

const authRouter = require('./auth');
const adminRouter = require('./admin');
const userRouter = require('./user');
const employeesRouter = require('./employee');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/employee', employeesRouter);

module.exports = router;