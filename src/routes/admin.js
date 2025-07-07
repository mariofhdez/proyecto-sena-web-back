/**
 * @fileoverview Configuración de las rutas de administración de la aplicación
 * @requires express
 * @requires ../controllers/adminController
 * @requires ../middlewares/auth
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 *           example: "La cabecera Authorization no ha sido proporcionada"
 *      ForbiddenError:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: Mensaje de error
 *            example: "No tienes permisos para acceder a esta ruta"
 *      NotFoundError:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: Mensaje de error
 *            example: "Usuario no encontrado"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT de autenticación
 */

const { Router } = require('express');
const adminRouter = Router();

const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de todos los usuarios del sistema (solo administradores)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Prohibido - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForbiddenError'
 *       500:
 *         description: Error interno del servidor
 */
adminRouter.get('/users', authenticateToken, adminController.users);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna un usuario específico basado en su ID (solo administradores)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Prohibido - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error interno del servidor
*/
adminRouter.get('/users/:id', authenticateToken, adminController.getUser);

/**
 * @swagger
 * /api/admin/deactivate-user/{id}:
 *   patch:
 *     summary: Desactivar un usuario
 *     description: Desactiva un usuario específico del sistema (solo administradores)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "Usuario desactivado exitosamente"
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Prohibido - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error interno del servidor
*/
adminRouter.patch('/deactivate-user/:id', authenticateToken, adminController.deactivateUser);

/**
 * @swagger
 * /api/admin/delete/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario específico del sistema (solo administradores)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "Usuario eliminado exitosamente"
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Prohibido - Se requieren permisos de administrador
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error interno del servidor
 */
adminRouter.delete('/delete/:id', authenticateToken, adminController.deleteUser);

module.exports = adminRouter;