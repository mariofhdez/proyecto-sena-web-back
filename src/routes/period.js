/**
 * @swagger
 * components:
 *   schemas:
 *     Period:
 *       type: object
 *       required:
 *         - period
 *         - start_date
 *         - end_date
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del período
 *         period:
 *           type: string
 *           description: Nombre del período (ej 2025-Enero)
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio del período
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de fin del período
 *         payment_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de pago (opcional)
 *         status:
 *           type: string
 *           enum: [OPEN, CLOSED]
 *           description: Estado del período
 *         employees_quantity:
 *           type: integer
 *           description: Cantidad de empleados en el período
 *         earnings_total:
 *           type: number
 *           description: Total de devengados
 *         deductions_total:
 *           type: number
 *           description: Total de deducciones
 *         total_value:
 *           type: number
 *           description: Valor total del período
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
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
 * /api/period/open:
 *   get:
 *     summary: Obtener el período abierto actual
 *     description: Retorna el período que está actualmente abierto
 *     tags: [Periods]
 *     responses:
 *       200:
 *         description: Período abierto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Period'
 *       404:
 *         description: No hay período abierto
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.get('/open', periodController.getOpenPeriod);

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
 *           type: integer
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
 *               - period
 *               - start_date
 *               - end_date
 *             properties:
 *               period:
 *                 type: string
 *                 description: Nombre del período
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de inicio del período
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de fin del período
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de pago (opcional)
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED]
 *                 description: Estado del período
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
 * /api/period/{id}:
 *   put:
 *     summary: Actualizar un período
 *     description: Actualiza un período existente
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del período
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               period:
 *                 type: string
 *                 description: Nombre del período
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de inicio del período
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de fin del período
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de pago
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED]
 *                 description: Estado del período
 *     responses:
 *       200:
 *         description: Período actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Period'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.put('/:id', periodController.updatePeriod);

/**
 * @swagger
 * /api/period/{id}/close:
 *   post:
 *     summary: Cerrar un período
 *     description: Cierra un período específico y calcula totales
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del período a cerrar
 *     responses:
 *       200:
 *         description: Período cerrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Period'
 *       400:
 *         description: El período no puede ser cerrado
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.post('/:id/close', periodController.closePeriod);

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
 *           type: integer
 *         description: ID del período a abrir
 *     responses:
 *       200:
 *         description: Período abierto exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Period'
 *       400:
 *         description: El período no puede ser abierto
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.post('/:id/open', periodController.openPeriod);

/**
 * @swagger
 * /api/period/{id}:
 *   delete:
 *     summary: Eliminar un período
 *     description: Elimina un período específico del sistema (solo si está cerrado y no tiene liquidaciones)
 *     tags: [Periods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del período a eliminar
 *     responses:
 *       200:
 *         description: Período eliminado exitosamente
 *       400:
 *         description: El período no puede ser eliminado
 *       404:
 *         description: Período no encontrado
 *       500:
 *         description: Error interno del servidor
 */
periodRouter.delete('/:id', periodController.deletePeriod);

module.exports = periodRouter;