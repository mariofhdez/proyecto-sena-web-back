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
const { authenticateToken } = require('../middlewares/auth');

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

module.exports = userRouter;