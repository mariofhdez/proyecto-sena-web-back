const { Router } = require('express');
const router = Router();

/**
 * #####    Router Index     #####
 * Este fichero es el enrutador base del servidor, permite dirigir al usuario 
 * a los diferentes módulos dependiendo de la ruta que indiquen en el path
 */

const authRouter = require('./auth');
const adminRouter = require('./admin');
const userRouter = require('./user');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);

module.exports = router;