/**
 * @swagger
 * components:
 *   schemas:
 *     Settlement:
 *       type: object
 *       required:
 *         - periodId
 *         - employeeId
 *         - totalEarnings
 *         - totalDeductions
 *         - netSalary
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la liquidación
 *         periodId:
 *           type: string
 *           description: ID del período asociado
 *         employeeId:
 *           type: string
 *           description: ID del empleado
 *         totalEarnings:
 *           type: number
 *           description: Total de devengados
 *         totalDeductions:
 *           type: number
 *           description: Total de deducciones
 *         netSalary:
 *           type: number
 *           description: Salario neto
 *         status:
 *           type: string
 *           enum: [DRAFT, SETTLED, CLOSED]
 *           description: Estado de la liquidación
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
const settlementRouter = express.Router();
const settlementController = require('../controllers/settlementController');

/**
 * @swagger
 * /api/settlement:
 *   get:
 *     summary: Obtener todas las liquidaciones
 *     description: Retorna una lista de todas las liquidaciones del sistema
 *     tags: [Settlements]
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
settlementRouter.get('/', settlementController.retriveSettlements);

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
 *           type: string
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
 *               - periodId
 *               - employeeId
 *             properties:
 *               periodId:
 *                 type: string
 *                 description: ID del período
 *               employeeId:
 *                 type: string
 *                 description: ID del empleado
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
 *   patch:
 *     summary: Actualizar una liquidación
 *     description: Actualiza una liquidación específica
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la liquidación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalEarnings:
 *                 type: number
 *                 description: Total de devengados
 *               totalDeductions:
 *                 type: number
 *                 description: Total de deducciones
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SETTLED, CLOSED]
 *                 description: Estado de la liquidación
 *     responses:
 *       200:
 *         description: Liquidación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       404:
 *         description: Liquidación no encontrada
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.patch('/:id', settlementController.updateSettlement);

/**
 * @swagger
 * /api/settlement/{id}:
 *   delete:
 *     summary: Eliminar una liquidación
 *     description: Elimina una liquidación específica del sistema
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la liquidación a eliminar
 *     responses:
 *       200:
 *         description: Liquidación eliminada exitosamente
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.delete('/:id', settlementController.deleteSettlement);

/**
 * @swagger
 * /api/settlement/settle:
 *   post:
 *     summary: Liquidar nómina
 *     description: Realiza la liquidación de la nómina
 *     tags: [Settlements]
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
 *                 description: ID del período a liquidar
 *     responses:
 *       200:
 *         description: Nómina liquidada exitosamente
 *       400:
 *         description: No se puede liquidar la nómina
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.post('/settle', settlementController.settlePayroll);

/**
 * @swagger
 * /api/settlement/close:
 *   post:
 *     summary: Cerrar nómina
 *     description: Cierra la nómina del período
 *     tags: [Settlements]
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
 *                 description: ID del período a cerrar
 *     responses:
 *       200:
 *         description: Nómina cerrada exitosamente
 *       400:
 *         description: No se puede cerrar la nómina
 *       500:
 *         description: Error interno del servidor
 */
settlementRouter.post('/close', settlementController.closePayroll);

settlementRouter.get('/employeeId/:employeeId', settlementController.getSettlementsByEmployeeId);

module.exports = settlementRouter;