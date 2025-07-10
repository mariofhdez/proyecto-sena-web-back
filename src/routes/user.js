/**
 * @fileoverview Configuración de las rutas de usuario de la aplicación
 * @requires express
 * @requires ../controllers/userController
 * @requires ../middlewares/auth
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT de autenticación
 */

const { Router } = require('express');
const userRouter = Router();

const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/user/edit:
 *   patch:
 *     summary: Editar perfil de usuario
 *     description: Permite a un usuario autenticado actualizar su información de perfil
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: string
 *                  example: Usuario actualizado con éxito!
*       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error interno del servidor
 */
userRouter.patch('/edit', authenticateToken, userController.updateUser);

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
userRouter.get('/', authenticateToken, authorizeRole(['ADMIN']), userController.users);

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
userRouter.get('/:id', authenticateToken, authorizeRole(['ADMIN']), userController.getUser);

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
userRouter.patch('/status/:id', authenticateToken, authorizeRole(['ADMIN']), userController.toggleUserStatus);

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
userRouter.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), userController.deleteUser);

module.exports = userRouter;