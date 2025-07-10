/**
 * @fileoverview Rutas para el motor de cálculo de liquidaciones
 * @module routes/settlementCalculation
 */

const express = require('express');
const settlementCalculationRouter = express.Router();
const settlementCalculationController = require('../controllers/settlementCalculationController');

/**
 * @swagger
 * /api/settlement-calculation/process:
 *   post:
 *     summary: Procesar liquidación completa
 *     description: Procesa una liquidación completa con orden topológico de dependencias
 *     tags: [Settlement Calculation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - startDate
 *               - endDate
 *               - concepts
 *             properties:
 *               employeeId:
 *                 type: number
 *                 description: ID del empleado
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio (YYYY-MM-DD)
 *                 example: "2025-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin (YYYY-MM-DD)
 *                 example: "2025-01-31"
 *               concepts:
 *                 type: array
 *                 description: Lista de conceptos a procesar
 *                 items:
 *                   type: object
 *                   required:
 *                     - conceptCode
 *                   properties:
 *                     conceptCode:
 *                       type: string
 *                       description: Código del concepto (3 caracteres)
 *                       example: "101"
 *                     quantity:
 *                       type: number
 *                       description: Cantidad (opcional, default 1)
 *                       example: 30
 *     responses:
 *       200:
 *         description: Liquidación procesada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liquidación procesada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: number
 *                     startDate:
 *                       type: string
 *                     endDate:
 *                       type: string
 *                     concepts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           conceptId:
 *                             type: number
 *                           conceptCode:
 *                             type: string
 *                           conceptName:
 *                             type: string
 *                           type:
 *                             type: string
 *                           calculationType:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           value:
 *                             type: number
 *                     totals:
 *                       type: object
 *                       properties:
 *                         earnings:
 *                           type: number
 *                         deductions:
 *                           type: number
 *                         netPayment:
 *                           type: number
 *                     calculationOrder:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Empleado o concepto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
settlementCalculationRouter.post('/process', settlementCalculationController.processCompleteSettlement);

/**
 * @swagger
 * /api/settlement-calculation/validate:
 *   post:
 *     summary: Validar conceptos de liquidación
 *     description: Valida conceptos para una liquidación sin procesarla
 *     tags: [Settlement Calculation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concepts
 *             properties:
 *               concepts:
 *                 type: array
 *                 description: Lista de conceptos a validar
 *                 items:
 *                   type: object
 *                   required:
 *                     - conceptCode
 *                   properties:
 *                     conceptCode:
 *                       type: string
 *                       description: Código del concepto (3 caracteres)
 *                       example: "101"
 *     responses:
 *       200:
 *         description: Conceptos validados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conceptos validados exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalConcepts:
 *                       type: number
 *                     calculationOrder:
 *                       type: array
 *                       items:
 *                         type: string
 *                     concepts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           code:
 *                             type: string
 *                           name:
 *                             type: string
 *                           type:
 *                             type: string
 *                           calculationType:
 *                             type: string
 *                           base:
 *                             type: string
 *                           factor:
 *                             type: number
 *                           divisor:
 *                             type: number
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementCalculationRouter.post('/validate', settlementCalculationController.validateSettlementConcepts);

module.exports = settlementCalculationRouter; 