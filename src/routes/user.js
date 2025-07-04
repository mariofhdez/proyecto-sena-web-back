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
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nuevo nombre del usuario
 *               lastName:
 *                 type: string
 *                 description: Nuevo apellido del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo email del usuario
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Nueva contraseña del usuario (mínimo 6 caracteres)
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El email ya está en uso
 *       500:
 *         description: Error interno del servidor
 */
userRouter.patch('/edit', authenticateToken, userController.updateUser);

module.exports = userRouter;