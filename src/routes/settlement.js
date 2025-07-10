/**
 * @swagger
 * components:
 *   schemas:
 *     Settlement:
 *       type: object
 *       required:
 *         - employee_id
 *         - start_date
 *         - end_date
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la liquidación
 *         employee_id:
 *           type: integer
 *           description: ID del empleado
 *         period_id:
 *           type: integer
 *           description: ID del período asociado (opcional)
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio del período
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de fin del período
 *         status:
 *           type: string
 *           enum: [DRAFT, OPEN, CLOSED, VOID]
 *           description: Estado de la liquidación
 *         earnings_value:
 *           type: number
 *           description: Total de devengados
 *         deductions_value:
 *           type: number
 *           description: Total de deducciones
 *         total_value:
 *           type: number
 *           description: Valor total de la liquidación
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
const settlementRouter = express.Router();
const settlementController = require('../controllers/settlementController');

/**
 * @swagger
 * /api/settlement:
 *   get:
 *     summary: Obtener todas las liquidaciones
 *     description: Retorna una lista de todas las liquidaciones del sistema
 *     tags: [Settlements]
 *     parameters:
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: integer
 *         description: Filtrar por empleado
 *       - in: query
 *         name: period_id
 *         schema:
 *           type: integer
 *         description: Filtrar por período
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar
 *     responses:
 *       200:
 *         description: Lista de liquidaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settlement'
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.get('/', settlementController.retrieveSettlements);

/**
 * @swagger
 * /api/settlement/employee/{employeeId}:
 *   get:
 *     summary: Obtener liquidaciones por empleado
 *     description: Retorna todas las liquidaciones de un empleado específico
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Liquidaciones del empleado obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settlement'
 *       400:
 *         description: ID de empleado inválido
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.get('/employee/:employeeId', settlementController.getSettlementsByEmployee);

/**
 * @swagger
 * /api/settlement/period/{periodId}:
 *   get:
 *     summary: Obtener liquidaciones por período
 *     description: Retorna todas las liquidaciones de un período específico
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: periodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del período
 *     responses:
 *       200:
 *         description: Liquidaciones del período obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settlement'
 *       400:
 *         description: ID de período inválido
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.get('/period/:periodId', settlementController.getSettlementsByPeriod);

/**
 * @swagger
 * /api/settlement/{id}:
 *   get:
 *     summary: Obtener una liquidación por ID
 *     description: Retorna una liquidación específica basada en su ID
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     responses:
 *       200:
 *         description: Liquidación encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.get('/:id', settlementController.getSettlementById);

/**
 * @swagger
 * /api/settlement:
 *   post:
 *     summary: Crear una nueva liquidación
 *     description: Crea una nueva liquidación en el sistema
 *     tags: [Settlements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - start_date
 *               - end_date
 *             properties:
 *               employee_id:
 *                 type: integer
 *                 description: ID del empleado
 *               period_id:
 *                 type: integer
 *                 description: ID del período (opcional)
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de inicio del período
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de fin del período
 *               status:
 *                 type: string
 *                 enum: [DRAFT, OPEN, CLOSED, VOID]
 *                 description: Estado de la liquidación
 *     responses:
 *       201:
 *         description: Liquidación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.post('/', settlementController.createSettlement);

/**
 * @swagger
 * /api/settlement/{id}:
 *   put:
 *     summary: Actualizar una liquidación
 *     description: Actualiza una liquidación específica
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de inicio del período
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de fin del período
 *               period_id:
 *                 type: integer
 *                 description: ID del período
 *               status:
 *                 type: string
 *                 enum: [DRAFT, OPEN, CLOSED, VOID]
 *                 description: Estado de la liquidación
 *     responses:
 *       200:
 *         description: Liquidación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.put('/:id', settlementController.updateSettlement);

/**
 * @swagger
 * /api/settlement/{id}/calculate:
 *   post:
 *     summary: Calcular una liquidación
 *     description: Calcula una liquidación usando el motor de cálculo de conceptos
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación a calcular
 *     responses:
 *       200:
 *         description: Liquidación calculada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       400:
 *         description: La liquidación no puede ser calculada
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.post('/:id/calculate', settlementController.calculateSettlement);

/**
 * @swagger
 * /api/settlement/{id}/status:
 *   post:
 *     summary: Cambiar estado de una liquidación
 *     description: Cambia el estado de una liquidación específica
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, OPEN, CLOSED, VOID]
 *                 description: Nuevo estado de la liquidación
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       400:
 *         description: Transición de estado inválida
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.post('/:id/status', settlementController.changeStatus);

/**
 * @swagger
 * /api/settlement/{id}/totals:
 *   post:
 *     summary: Calcular totales de una liquidación
 *     description: Calcula y actualiza los totales de una liquidación
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     responses:
 *       200:
 *         description: Totales calculados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.post('/:id/totals', settlementController.calculateTotals);

/**
 * @swagger
 * /api/settlement/{id}:
 *   delete:
 *     summary: Eliminar una liquidación
 *     description: Elimina una liquidación específica del sistema (solo si está en DRAFT)
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación a eliminar
 *     responses:
 *       200:
 *         description: Liquidación eliminada exitosamente
 *       400:
 *         description: La liquidación no puede ser eliminada
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.delete('/:id', settlementController.deleteSettlement);

module.exports = settlementRouter;