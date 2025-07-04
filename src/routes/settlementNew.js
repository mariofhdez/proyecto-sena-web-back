/**
 * @fileoverview Configuración de las rutas para la gestión de novedades de nómina
 * @requires express
 * @requires ../controllers/payrollNewController
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SettlementNew:
 *       type: object
 *       required:
 *         - periodId
 *         - employeeId
 *         - conceptId
 *         - value
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la novedad
 *         periodId:
 *           type: string
 *           description: ID del período asociado
 *         employeeId:
 *           type: string
 *           description: ID del empleado
 *         conceptId:
 *           type: string
 *           description: ID del concepto
 *         value:
 *           type: number
 *           description: Valor de la novedad
 *         type:
 *           type: string
 *           enum: [EARNING, DEDUCTION]
 *           description: Tipo de novedad (devengo o deducción)
 *         status:
 *           type: string
 *           enum: [DRAFT, APPLIED]
 *           description: Estado de la novedad
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
const settlementNewRouter = express.Router();
const payrollNewController = require('../controllers/settlementNewController');

/**
 * @swagger
 * /api/settlement-news:
 *   get:
 *     summary: Obtener todas las novedades
 *     description: Retorna una lista de todas las novedades de nómina del sistema
 *     tags: [Settlement News]
 *     responses:
 *       200:
 *         description: Lista de novedades obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SettlementNew'
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.get('/', payrollNewController.retrieveNews);

/**
 * @swagger
 * /api/settlement-news/{id}:
 *   get:
 *     summary: Obtener una novedad por ID
 *     description: Retorna una novedad específica basada en su ID
 *     tags: [Settlement News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la novedad
 *     responses:
 *       200:
 *         description: Novedad encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementNew'
 *       404:
 *         description: Novedad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.get('/:id', payrollNewController.getNewById);

/**
 * @swagger
 * /api/settlement-news:
 *   post:
 *     summary: Crear una nueva novedad
 *     description: Crea una nueva novedad de nómina en el sistema
 *     tags: [Settlement News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - periodId
 *               - employeeId
 *               - conceptId
 *               - value
 *               - type
 *             properties:
 *               periodId:
 *                 type: string
 *                 description: ID del período
 *               employeeId:
 *                 type: string
 *                 description: ID del empleado
 *               conceptId:
 *                 type: string
 *                 description: ID del concepto
 *               value:
 *                 type: number
 *                 description: Valor de la novedad
 *               type:
 *                 type: string
 *                 enum: [EARNING, DEDUCTION]
 *                 description: Tipo de novedad
 *     responses:
 *       201:
 *         description: Novedad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementNew'
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.post('/', payrollNewController.createNew);

/**
 * @swagger
 * /api/settlement-news/{id}:
 *   patch:
 *     summary: Actualizar una novedad
 *     description: Actualiza una novedad específica
 *     tags: [Settlement News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la novedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Nuevo valor de la novedad
 *               type:
 *                 type: string
 *                 enum: [EARNING, DEDUCTION]
 *                 description: Tipo de novedad
 *               status:
 *                 type: string
 *                 enum: [DRAFT, APPLIED]
 *                 description: Estado de la novedad
 *     responses:
 *       200:
 *         description: Novedad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementNew'
 *       404:
 *         description: Novedad no encontrada
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.patch('/:id', payrollNewController.updateNew);

/**
 * @swagger
 * /api/settlement-news/{id}:
 *   delete:
 *     summary: Eliminar una novedad
 *     description: Elimina una novedad específica del sistema
 *     tags: [Settlement News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la novedad a eliminar
 *     responses:
 *       200:
 *         description: Novedad eliminada exitosamente
 *       404:
 *         description: Novedad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.delete('/:id', payrollNewController.deleteNew);

/**
 * @swagger
 * /api/settlement-news/{id}/draft:
 *   post:
 *     summary: Guardar novedad como borrador
 *     description: Marca una novedad como borrador
 *     tags: [Settlement News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la novedad
 *     responses:
 *       200:
 *         description: Novedad guardada como borrador exitosamente
 *       404:
 *         description: Novedad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.post('/:id/draft', payrollNewController.draftNew);

/**
 * @swagger
 * /api/settlement-news/preload:
 *   post:
 *     summary: Precargar novedades
 *     description: Precarga novedades para un período específico
 *     tags: [Settlement News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - periodId
 *             properties:
 *               periodId:
 *                 type: string
 *                 description: ID del período
 *     responses:
 *       200:
 *         description: Novedades precargadas exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementNewRouter.post('/preload', payrollNewController.preload);

module.exports = settlementNewRouter;