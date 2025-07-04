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
 *         - name
 *         - type
 *         - value
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del concepto
 *         name:
 *           type: string
 *           description: Nombre del concepto
 *         type:
 *           type: string
 *           enum: [EARNING, DEDUCTION]
 *           description: Tipo de concepto (devengo o deducción)
 *         value:
 *           type: number
 *           description: Valor del concepto
 *         isActive:
 *           type: boolean
 *           description: Estado activo del concepto
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
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

module.exports = conceptRouter;