const { Router } = require('express');
const router = Router();

const authRouter = require('./auth');
const adminRouter = require('./admin');
const userRouter = require('./user');
const employeesRouter = require('./employee');
const payrollNewRouter = require('./payrollNew');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/employee', employeesRouter);
router.use('/payroll-new', payrollNewRouter);

module.exports = router;