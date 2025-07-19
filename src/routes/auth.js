/**
 * @fileoverview Configuración de las rutas de autenticación de la aplicación
 * @requires express
 * @requires ../controllers/authController
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *           example: "1"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "John Doe"
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: Rol del usuario
 *           example: "USER"
 *         isActive:
 *           type: boolean
 *           description: Estado activo del usuario
 *           example: true
 *     UserUpdate:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "John Doe"
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Nueva contraseña del usuario (mínimo 8 caracteres)
 *           example: "NewPassword123"
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Contraseña del usuario. Debe contener al menos 8 caracteres, una letra y un número.
 *           example: Password123
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: Rol del usuario
 *           example: USER
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: Password123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT de autenticación
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

const { Router } = require('express');
const authRouter = Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *               message:
 *                 type: string
 *                 description: Mensaje de confirmación de registro
 *                 example: "User: John Doe was created successfully!"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "No se pudo crear el usuario"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Mensaje de error específico
 *                     example: "La contraseña debe tener al menos 8 caracteres, una letra y un número"
 *       500:
 *         description: Error interno del servidor
 */
authRouter.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y retorna un token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Acceso denegado"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Mensaje de error específico
 *                     example: "Usuario o contraseña inválidos"
 *       500:
 *         description: Error interno del servidor
 */
authRouter.post('/login', authController.login);

authRouter.get('/me', authenticateToken, authController.getMe);

authRouter.post('/validate', authController.validateToken)

module.exports = authRouter;