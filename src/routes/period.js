/**
 * @swagger
 * components:
 *   schemas:
 *     Period:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del período
 *         name:
 *           type: string
 *           description: Nombre del período
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del período
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de fin del período
 *         status:
 *           type: string
 *           enum: [OPEN, CLOSED, SETTLED, VOID]
 *           description: Estado del período
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
const periodRouter = express.Router();
const periodController = require('../controllers/periodController');

/**
 * @swagger
 * /api/period:
 *   get:
 *     summary: Obtener todos los períodos
 *     description: Retorna una lista de todos los períodos del sistema
 *     tags: [Periods]
 *     responses:
 *       200:
 *         description: Lista de períodos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Period'
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.get('/', periodController.retrievePeriods);

/**
 * @swagger
 * /api/period/{id}:
 *   get:
 *     summary: Obtener un período por ID
 *     description: Retorna un período específico basado en su ID
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período
 *     responses:
 *       200:
 *         description: Período encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Period'
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.get('/:id', periodController.getPeriodById);

/**
 * @swagger
 * /api/period:
 *   post:
 *     summary: Crear un nuevo período
 *     description: Crea un nuevo período en el sistema
 *     tags: [Periods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del período
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del período
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del período
 *     responses:
 *       201:
 *         description: Período creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Period'
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.post('/', periodController.createPeriod);

/**
 * @swagger
 * /api/period/{id}/settle:
 *   post:
 *     summary: Liquidar un período
 *     description: Realiza la liquidación de un período específico
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período a liquidar
 *     responses:
 *       200:
 *         description: Período liquidado exitosamente
 *       404:
 *         description: Período no encontrado
 *       400:
 *         description: El período no puede ser liquidado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.post('/:id/settle', periodController.settlePeriod);

/**
 * @swagger
 * /api/period/{id}/close:
 *   post:
 *     summary: Cerrar un período
 *     description: Cierra un período específico
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período a cerrar
 *     responses:
 *       200:
 *         description: Período cerrado exitosamente
 *       404:
 *         description: Período no encontrado
 *       400:
 *         description: El período no puede ser cerrado
 *       500:
 *         description: Error interno del servidor
 */
// periodRouter.post('/:id/close', periodController.closePeriod);

/**
 * @swagger
 * /api/period/{id}:
 *   delete:
 *     summary: Eliminar un período
 *     description: Elimina un período específico del sistema
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período a eliminar
 *     responses:
 *       200:
 *         description: Período eliminado exitosamente
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.delete('/:id', periodController.deletePeriod);

/**
 * @swagger
 * /api/period/{id}/loadEmployees:
 *   post:
 *     summary: Cargar empleados a un período
 *     description: Carga empleados al período especificado
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período
 *     responses:
 *       200:
 *         description: Empleados cargados exitosamente
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
// periodRouter.post('/:id/loadEmployees', periodController.loadEmployees);

/**
 * @swagger
 * /api/period/{id}/open:
 *   post:
 *     summary: Abrir un período
 *     description: Abre un período específico
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período a abrir
 *     responses:
 *       200:
 *         description: Período abierto exitosamente
 *       404:
 *         description: Período no encontrado
 *       400:
 *         description: El período no puede ser abierto
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.post('/:id/open', periodController.openPeriod);

/**
 * @swagger
 * /api/period/{id}/reverse-settlement:
 *   post:
 *     summary: Revertir liquidación de un período
 *     description: Revierte la liquidación de un período específico
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período
 *     responses:
 *       200:
 *         description: Liquidación revertida exitosamente
 *       404:
 *         description: Período no encontrado
 *       400:
 *         description: No se puede revertir la liquidación
 *       500:
 *         description: Error interno del servidor
 */
// periodRouter.post('/:id/reverse-settlement', periodController.reversePeriodSettle);

/**
 * @swagger
 * /api/period/{id}/void:
 *   post:
 *     summary: Anular un período
 *     description: Anula un período específico
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del período a anular
 *     responses:
 *       200:
 *         description: Período anulado exitosamente
 *       404:
 *         description: Período no encontrado
 *       400:
 *         description: El período no puede ser anulado
 *       500:
 *         description: Error interno del servidor
 */
// periodRouter.post('/:id/void', periodController.voidPeriod);

module.exports = periodRouter;