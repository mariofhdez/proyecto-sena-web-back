/**
 * @fileoverview Controlador para la autenticación de usuarios
 * @module controllers/authController
 */

const { validateToken } = require('../middlewares/auth');
const { registerService, loginService, getMeService } = require('../services/authService');
const { ValidationError } = require('../utils/appError');
const { validateRegister } = require('../utils/userValidation');

/**
 * Registra un nuevo usuario en el sistema
 * 
 * @async
 * @function register
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del usuario a registrar
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.name - Nombre del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} req.body.role - Rol del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de éxito
 * @throws {ValidationError} Si faltan campos o la validación falla
 */
exports.register = async(req, res, next) => {
    try {
        const { email, name, password, role } = req.body;
        const validation = validateRegister({ email, name, password, role });
        if (!validation.isValid){
            console.log(validation.error);
            throw new ValidationError("User creation failed",validation.error);
        }
        await registerService(email, name, password, role);
        return res.status(201).json({ message: `User: ${name} was created successfully!`});
    } catch (error) {
        next(error);
    }
}

/**
 * Autentica a un usuario y genera un token JWT
 * 
 * @async
 * @function login
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Credenciales del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con el token de autenticación
 * @throws {ValidationError} Si faltan campos requeridos
 */
exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            throw new ValidationError('Access denied', 'The field ' + (email ? 'password' : 'email') + ' is required');
        }
        const token = await loginService(email, password);
        return res.status(200).json({ token: token });
    } catch (error) {
        next(error);
    }
}

exports.getMe = async (req, res, next) => {
    try {
        const id = parseInt(req.user.id, 10);
        const user = await getMeService(id);
        return res.status(200).json({ user: user });
    } catch (error) {
        next(error);
    }
}

exports.validateToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await validateToken(token);
        return res.status(200).json({ user: user });
    } catch (error) {
        next(error);
    }
}