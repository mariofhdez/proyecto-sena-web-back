/**
 * @fileoverview Configuración de las rutas principales de la aplicación
 * @requires express
 * @requires ./auth
 * @requires ./admin
 * @requires ./user
 * @requires ./employee
 * @requires ./payrollNew
 * @requires ./payrollPeriod
 */

const { Router } = require('express');
const router = Router();

// Importación de los routers específicos de cada módulo
const authRouter = require('./auth');
const adminRouter = require('./admin');
const userRouter = require('./user');
const employeesRouter = require('./employee');
const payrollNewRouter = require('./payrollNew');
const payrollPeriodRouter = require('./payrollPeriod');

/**
 * Montaje de los routers en sus respectivos caminos
 * @param {string} path - Ruta base para el router
 * @param {Router} router - Instancia del router a montar
 */
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/employee', employeesRouter);
router.use('/payroll-new', payrollNewRouter);
router.use('/payroll-period', payrollPeriodRouter);

module.exports = router;