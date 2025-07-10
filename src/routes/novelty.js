/**
 * @fileoverview Rutas para la gestión de novedades de nómina
 * @module routes/novelty
 * @requires express
 * @requires ../controllers/noveltyController
 * @requires ../middlewares/auth
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Novelty:
 *       type: object
 *       required:
 *         - employeeId
 *         - conceptId
 *         - date
 *         - value
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la novedad
 *           example: 1
 *         employeeId:
 *           type: integer
 *           description: ID del empleado
 *           example: 1
 *         conceptId:
 *           type: integer
 *           description: ID del concepto de nómina
 *           example: 101
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha de la novedad (YYYY-MM-DD)
 *           example: "2025-01-15"
 *         value:
 *           type: number
 *           description: Valor de la novedad
 *           example: 50000
 *         status:
 *           type: string
 *           enum: [PENDING, APPLIED, CANCELLED]
 *           description: Estado de la novedad
 *           example: "PENDING"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         employee:
 *           $ref: '#/components/schemas/Employee'
 *         concept:
 *           $ref: '#/components/schemas/Concept'
 */

const express = require('express');
const router = express.Router();
const noveltyController = require('../controllers/noveltyController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @swagger
 * /api/novelty:
 *   post:
 *     summary: Crear una nueva novedad
 *     description: Crea una nueva novedad de nómina para un empleado
 *     tags: [Novelties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - conceptId
 *               - date
 *               - value
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: ID del empleado
 *                 example: 1
 *               conceptId:
 *                 type: integer
 *                 description: ID del concepto de nómina
 *                 example: 101
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la novedad (YYYY-MM-DD)
 *                 example: "2025-01-15"
 *               value:
 *                 type: number
 *                 description: Valor de la novedad
 *                 example: 50000
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPLIED, CANCELLED]
 *                 description: Estado de la novedad (opcional, por defecto PENDING)
 *                 example: "PENDING"
 *     responses:
 *       201:
 *         description: Novedad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Novelty'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authenticateToken, noveltyController.createNovelty);

/**
 * @swagger
 * /api/novelty:
 *   get:
 *     summary: Obtener todas las novedades
 *     description: Retorna una lista de todas las novedades de nómina
 *     tags: [Novelties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de empleado
 *       - in: query
 *         name: conceptId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de concepto
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPLIED, CANCELLED]
 *         description: Filtrar por estado
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de novedades obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Novelty'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateToken, noveltyController.getNovelties);

/**
 * @swagger
 * /api/novelty/{id}:
 *   get:
 *     summary: Obtener una novedad por ID
 *     description: Retorna los detalles de una novedad específica
 *     tags: [Novelties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la novedad
 *     responses:
 *       200:
 *         description: Novedad encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Novelty'
 *       404:
 *         description: Novedad no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', authenticateToken, noveltyController.getNoveltyById);

/**
 * @swagger
 * /api/novelty/{id}:
 *   put:
 *     summary: Actualizar una novedad
 *     description: Actualiza los datos de una novedad existente
 *     tags: [Novelties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la novedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: ID del empleado
 *                 example: 1
 *               conceptId:
 *                 type: integer
 *                 description: ID del concepto de nómina
 *                 example: 101
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la novedad (YYYY-MM-DD)
 *                 example: "2025-01-15"
 *               value:
 *                 type: number
 *                 description: Valor de la novedad
 *                 example: 60000
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPLIED, CANCELLED]
 *                 description: Estado de la novedad
 *                 example: "PENDING"
 *     responses:
 *       200:
 *         description: Novedad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Novelty'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Novedad no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', authenticateToken, noveltyController.updateNovelty);

/**
 * @swagger
 * /api/novelty/{id}:
 *   delete:
 *     summary: Eliminar una novedad
 *     description: Elimina una novedad de nómina
 *     tags: [Novelties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la novedad
 *     responses:
 *       200:
 *         description: Novedad eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Novedad eliminada exitosamente"
 *       404:
 *         description: Novedad no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', authenticateToken, noveltyController.deleteNovelty);

module.exports = router; 