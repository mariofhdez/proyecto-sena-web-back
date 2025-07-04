/**
 * @fileoverview Configuración de las rutas principales de la aplicación
 * @module routes/index
 * @requires express
 * @requires ./auth
 * @requires ./admin
 * @requires ./user
 * @requires ./employee
 * @requires ./settlementNew
 * @requires ./settlement
 * @requires ./period
 * @requires ./concept
 */

const { Router } = require('express');
const router = Router();

// Importación de los routers específicos de cada módulo
const authRouter = require('./auth');
const adminRouter = require('./admin');
const userRouter = require('./user');
const employeesRouter = require('./employee');
const settlementNewRouter = require('./settlementNew');
const settlementRouter = require('./settlement');
const periodRouter = require('./period');
const conceptRouter = require('./concept');

/**
 * Configuración de las rutas de autenticación
 * @type {Router}
 */
router.use('/auth', authRouter);

/**
 * Configuración de las rutas de administración
 * @type {Router}
 */
router.use('/admin', adminRouter);

/**
 * Configuración de las rutas de usuarios
 * @type {Router}
 */
router.use('/user', userRouter);

/**
 * Configuración de las rutas de empleados
 * @type {Router}
 */
router.use('/employee', employeesRouter);

/**
 * Configuración de las rutas de novedades de liquidación
 * @type {Router}
 */
router.use('/settlement-news', settlementNewRouter);

/**
 * Configuración de las rutas de liquidaciones
 * @type {Router}
 */
router.use('/settlement', settlementRouter);

/**
 * Configuración de las rutas de períodos
 * @type {Router}
 */
router.use('/period', periodRouter);

/**
 * Configuración de las rutas de conceptos
 * @type {Router}
 */
router.use('/concept', conceptRouter);

module.exports = router;