const { Router } = require('express');
const router = Router();

const authRouter = require('./auth');
const adminRouter = require('./admin');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

module.exports = router;