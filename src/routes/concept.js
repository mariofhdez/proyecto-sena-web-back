/**
 * @fileoverview Rutas para la gestión de conceptos de nómina
 * @module routes/concept
 * @requires express
 * @requires ../controllers/conceptController
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Concept:
 *       type: object
 *       required:
 *         - id
 *         - code
 *         - name
 *         - type
 *         - base
 *         - factor
 *         - isIncome
 *         - isVacation
 *         - isIBC
 *         - isRegularConcept
 *         - calculationType
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del concepto
 *           example: "1"
 *         code:
 *           type: string
 *           description: Código único del concepto
 *           example: "101"
 *         name:
 *           type: string
 *           description: Nombre del concepto
 *           example: "Salario Básico"
 *         type:
 *           type: string
 *           enum: [DEVENGADO, DEDUCCION]
 *           description: Tipo de concepto. 
 *           example: "DEVENGADO"
 *         base:
 *           type: string
 *           enum: [SALARY, HOURLY, ALLOWANCE, INCOME, VACATION, ZERO, IBC]
 *           description: Base sobre la cual se calcula el valor del concepto.
 *         factor:
 *           type: number
 *           description: Factor de cálculo del concepto.
 *         isIncome:
 *           type: boolean
 *           description: Indica si el concepto es considerado base para el cálculo de los conceptos prestacionales
 *         isVacation:
 *           type: boolean
 *           description: Indica si el concepto es considerado base para el cálculo de los conceptos de vacaciones
 *         isIBC:
 *           type: boolean
 *           description: Indica si el concepto es considerado base para el cálculo de los conceptos de seguridad social como salud, pensión y riesgos laborales
 *         isRegularConcept:
 *           type: boolean
 *           description: Indica si el concepto es un concepto regular, es decir, que se aplica de forma recurrente en la nómina del empleado
 *         calculationType:
 *           type: string
 *           enum: [LINEAL, FACTORIAL, NOMINAL]
 *           description: Tipo de cálculo del concepto.
 */



const express = require('express');
const conceptRouter = express.Router();
const conceptController = require('../controllers/conceptController');

/**
 * @swagger
 * /api/concept:
 *   get:
 *     summary: Obtener todos los conceptos
 *     description: Retorna una lista de todos los conceptos de nómina del sistema
 *     tags: [Concepts]
 *     responses:
 *       200:
 *         description: Lista de conceptos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Concept'
 *       500:
 *         description: Error interno del servidor
 */
conceptRouter.get('/', conceptController.getAllConcepts);

conceptRouter.get('/:id', conceptController.getConceptById);
conceptRouter.get('/code/:code', conceptController.getConceptByCode);


module.exports = conceptRouter;