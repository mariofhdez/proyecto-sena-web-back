/**
 * @fileoverview Configuración de las rutas de empleados de la aplicación
 * @requires express
 * @requires ../controllers/employeeController
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - position
 *         - salary
 *         - startDate
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del empleado
 *         firstName:
 *           type: string
 *           description: Nombre del empleado
 *         lastName:
 *           type: string
 *           description: Apellido del empleado
 *         email:
 *           type: string
 *           format: email
 *           description: Email del empleado
 *         position:
 *           type: string
 *           description: Cargo del empleado
 *         salary:
 *           type: number
 *           description: Salario base del empleado
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del empleado
 *         isActive:
 *           type: boolean
 *           description: Estado activo del empleado
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
const employeeRouter = express.Router();
const employeeController = require('../controllers/employeeController');

/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Obtener todos los empleados
 *     description: Retorna una lista de todos los empleados del sistema
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Error interno del servidor
*/
employeeRouter.get('/', employeeController.getEmployees);

employeeRouter.get('/active', employeeController.getActiveEmployees);

/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     description: Retorna un empleado específico basado en su ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
employeeRouter.get('/:id', employeeController.getEmployee);

/**
 * @swagger
 * /api/employee:
 *   post:
 *     summary: Crear un nuevo empleado
 *     description: Crea un nuevo empleado en el sistema
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - position
 *               - salary
 *               - startDate
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nombre del empleado
 *               lastName:
 *                 type: string
 *                 description: Apellido del empleado
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del empleado
 *               position:
 *                 type: string
 *                 description: Cargo del empleado
 *               salary:
 *                 type: number
 *                 description: Salario base del empleado
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del empleado
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El email ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
employeeRouter.post('/', employeeController.createEmployee);

/**
 * @swagger
 * /api/employee/{id}:
 *   patch:
 *     summary: Actualizar un empleado
 *     description: Actualiza un empleado específico
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nombre del empleado
 *               lastName:
 *                 type: string
 *                 description: Apellido del empleado
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del empleado
 *               position:
 *                 type: string
 *                 description: Cargo del empleado
 *               salary:
 *                 type: number
 *                 description: Salario base del empleado
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del empleado
 *               isActive:
 *                 type: boolean
 *                 description: Estado activo del empleado
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
employeeRouter.patch('/:id', employeeController.updateEmployee);

/**
 * @swagger
 * /api/employee/{id}:
 *   delete:
 *     summary: Eliminar un empleado
 *     description: Elimina un empleado específico del sistema
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado a eliminar
 *     responses:
 *       200:
 *         description: Empleado eliminado exitosamente
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
employeeRouter.delete('/:id', employeeController.deleteEmployee);

employeeRouter.post('/status/:id', employeeController.toggleEmployee);


module.exports = employeeRouter;
