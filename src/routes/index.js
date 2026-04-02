/**
 * @fileoverview Configuración de las rutas principales de la aplicación
 * @module routes/index
 * @requires express
 * @requires ./auth
 * @requires ./user
 * @requires ./employee
 * @requires ./settlement
 * @requires ./period
 * @requires ./concept
 */

const { Router } = require('express');
const router = Router();

// Importación de los routers específicos de cada módulo
const authRouter = require('./auth');
const userRouter = require('./user');
const employeesRouter = require('./employee');
const conceptRouter = require('./concept');
const noveltyRouter = require('./novelty');
const settlementDetailRouter = require('./settlementDetail');
const settlementRouter = require('./settlement');
const periodRouter = require('./period');

/**
 * Configuración de las rutas de autenticación
 * @type {Router}
 */
router.use('/auth', authRouter);

/**
 * Configuración de las rutas de usuarios
 * @type {Router}
 */
router.use('/users', userRouter);

/**
 * Configuración de las rutas de empleados
 * @type {Router}
 */
router.use('/employees', employeesRouter);

/**
 * Configuración de las rutas de novedades de liquidación
 * @type {Router}
 */
router.use('/novelties', noveltyRouter);

/**
 * Configuración de las rutas de liquidaciones
 * @type {Router}
 */
router.use('/settlements', settlementRouter);

/**
 * Configuración de las rutas de períodos
 * @type {Router}
 */
router.use('/periods', periodRouter);

/**
 * Configuración de las rutas de conceptos
 * @type {Router}
 */
router.use('/concepts', conceptRouter);

/**
 *  Configuración de las rutas de detalles de liquidaciones
 * @type {Router}
 */
router.use('/settlement-details', settlementDetailRouter);

module.exports = router;