/**
 * @fileoverview Rutas para la gestión de detalles de liquidación
 * @module routes/settlementDetail
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SettlementDetail:
 *       type: object
 *       required:
 *         - settlement_id
 *         - concept_id
 *         - employee_id
 *         - value
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del detalle de liquidación
 *         settlement_id:
 *           type: integer
 *           description: ID de la liquidación
 *         concept_id:
 *           type: integer
 *           description: ID del concepto
 *         employee_id:
 *           type: integer
 *           description: ID del empleado
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha del detalle
 *         quantity:
 *           type: number
 *           description: Cantidad (opcional para conceptos NOMINAL)
 *         value:
 *           type: number
 *           description: Valor calculado
 *         status:
 *           type: string
 *           enum: [DRAFT, OPEN, CLOSED, VOID]
 *           description: Estado del detalle
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
const settlementDetailRouter = express.Router();
const settlementDetailController = require('../controllers/settlementDetailController');

// ============================================================================
// RUTAS ESPECÍFICAS (antes que las genéricas con parámetros)
// ============================================================================

/**
 * @swagger
 * /api/settlement-detail/settlement/{settlementId}:
 *   get:
 *     summary: Obtener detalles por liquidación
 *     description: Retorna todos los detalles de una liquidación específica
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: path
 *         name: settlementId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     responses:
 *       200:
 *         description: Detalles de la liquidación obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SettlementDetail'
 *       400:
 *         description: ID de liquidación inválido
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.get('/settlement/:settlementId', settlementDetailController.getSettlementDetailsBySettlement);

/**
 * @swagger
 * /api/settlement-detail/settlement/{settlementId}/stats:
 *   get:
 *     summary: Obtener estadísticas de detalles por liquidación
 *     description: Retorna estadísticas de los detalles de una liquidación específica
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: path
 *         name: settlementId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDetails:
 *                   type: integer
 *                 earningsCount:
 *                   type: integer
 *                 deductionsCount:
 *                   type: integer
 *                 totalEarnings:
 *                   type: number
 *                 totalDeductions:
 *                   type: number
 *                 byStatus:
 *                   type: object
 *                   properties:
 *                     DRAFT:
 *                       type: integer
 *                     OPEN:
 *                       type: integer
 *                     CLOSED:
 *                       type: integer
 *                     VOID:
 *                       type: integer
 *       400:
 *         description: ID de liquidación inválido
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.get('/settlement/:settlementId/stats', settlementDetailController.getSettlementDetailStats);

/**
 * @swagger
 * /api/settlement-detail/employee/{employeeId}:
 *   get:
 *     summary: Obtener detalles por empleado
 *     description: Retorna todos los detalles de un empleado específico
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Detalles del empleado obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SettlementDetail'
 *       400:
 *         description: ID de empleado inválido
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.get('/employee/:employeeId', settlementDetailController.getSettlementDetailsByEmployee);

/**
 * @swagger
 * /api/settlement-detail/concept/{conceptId}:
 *   get:
 *     summary: Obtener detalles por concepto
 *     description: Retorna todos los detalles de un concepto específico
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: path
 *         name: conceptId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del concepto
 *     responses:
 *       200:
 *         description: Detalles del concepto obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SettlementDetail'
 *       400:
 *         description: ID de concepto inválido
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.get('/concept/:conceptId', settlementDetailController.getSettlementDetailsByConcept);

// ============================================================================
// RUTAS DE OPERACIONES ESPECIALES
// ============================================================================

/**
 * @swagger
 * /api/settlement-detail/calculate:
 *   post:
 *     summary: Calcular valor de un detalle
 *     description: Calcula el valor de un detalle según el tipo de concepto
 *     tags: [SettlementDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concept_id
 *               - employee_id
 *               - settlement_id
 *             properties:
 *               concept_id:
 *                 type: integer
 *                 description: ID del concepto
 *               quantity:
 *                 type: number
 *                 description: Cantidad (opcional para conceptos NOMINAL)
 *               employee_id:
 *                 type: integer
 *                 description: ID del empleado
 *               settlement_id:
 *                 type: integer
 *                 description: ID de la liquidación
 *     responses:
 *       200:
 *         description: Valor calculado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 concept_id:
 *                   type: integer
 *                 quantity:
 *                   type: number
 *                 employee_id:
 *                   type: integer
 *                 settlement_id:
 *                   type: integer
 *                 calculated_value:
 *                   type: number
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.post('/calculate', settlementDetailController.calculateSettlementDetail);

/**
 * @swagger
 * /api/settlement-detail/multiple:
 *   post:
 *     summary: Crear múltiples detalles de liquidación
 *     description: Crea múltiples detalles de liquidación en una sola operación
 *     tags: [SettlementDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - details
 *             properties:
 *               details:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SettlementDetail'
 *                 description: Array de detalles a crear
 *     responses:
 *       201:
 *         description: Detalles creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SettlementDetail'
 *                 errors:
 *                   type: array
 *                   description: Errores encontrados durante la creación
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     created:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.post('/multiple', settlementDetailController.createMultipleSettlementDetails);

// ============================================================================
// RUTAS CRUD PRINCIPALES
// ============================================================================

/**
 * @swagger
 * /api/settlement-detail:
 *   get:
 *     summary: Obtener todos los detalles de liquidación
 *     description: Retorna una lista de todos los detalles de liquidación del sistema
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: query
 *         name: settlement_id
 *         schema:
 *           type: integer
 *         description: Filtrar por liquidación
 *       - in: query
 *         name: concept_id
 *         schema:
 *           type: integer
 *         description: Filtrar por concepto
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: integer
 *         description: Filtrar por empleado
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, OPEN, CLOSED, VOID]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de detalles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SettlementDetail'
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Crear un nuevo detalle de liquidación
 *     description: Crea un nuevo detalle de liquidación en el sistema
 *     tags: [SettlementDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - settlement_id
 *               - concept_id
 *               - employee_id
 *               - value
 *             properties:
 *               settlement_id:
 *                 type: integer
 *                 description: ID de la liquidación
 *               concept_id:
 *                 type: integer
 *                 description: ID del concepto
 *               employee_id:
 *                 type: integer
 *                 description: ID del empleado
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del detalle
 *               quantity:
 *                 type: number
 *                 description: Cantidad (opcional para conceptos NOMINAL)
 *               value:
 *                 type: number
 *                 description: Valor calculado
 *               status:
 *                 type: string
 *                 enum: [DRAFT, OPEN, CLOSED, VOID]
 *                 description: Estado del detalle
 *     responses:
 *       201:
 *         description: Detalle creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementDetail'
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.get('/', settlementDetailController.retrieveSettlementDetails);
settlementDetailRouter.post('/', settlementDetailController.createSettlementDetail);

// ============================================================================
// RUTAS CON PARÁMETROS GENÉRICOS (al final para evitar conflictos)
// ============================================================================

/**
 * @swagger
 * /api/settlement-detail/{id}/status:
 *   post:
 *     summary: Cambiar estado de un detalle
 *     description: Cambia el estado de un detalle específico
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle
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
 *                 description: Nuevo estado del detalle
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementDetail'
 *       400:
 *         description: Transición de estado inválida
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.post('/:id/status', settlementDetailController.changeSettlementDetailStatus);

/**
 * @swagger
 * /api/settlement-detail/{id}:
 *   get:
 *     summary: Obtener un detalle por ID
 *     description: Retorna un detalle específico basado en su ID
 *     tags: [SettlementDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementDetail'
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un detalle de liquidación
 *     description: Actualiza un detalle específico
 *     tags: [SettlementDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del detalle
 *               quantity:
 *                 type: number
 *                 description: Cantidad
 *               value:
 *                 type: number
 *                 description: Valor calculado
 *               status:
 *                 type: string
 *                 enum: [DRAFT, OPEN, CLOSED, VOID]
 *                 description: Estado del detalle
 *     responses:
 *       200:
 *         description: Detalle actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SettlementDetail'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un detalle de liquidación
 *     description: Elimina un detalle específico del sistema
 *     tags: [SettlementDetails]
 *     responses:
 *       200:
 *         description: Detalle eliminado exitosamente
 *       400:
 *         description: El detalle no puede ser eliminado
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error interno del servidor
 */
settlementDetailRouter.get('/:id', settlementDetailController.getSettlementDetailById);
settlementDetailRouter.put('/:id', settlementDetailController.updateSettlementDetail);
settlementDetailRouter.delete('/:id', settlementDetailController.deleteSettlementDetail);

module.exports = settlementDetailRouter; 