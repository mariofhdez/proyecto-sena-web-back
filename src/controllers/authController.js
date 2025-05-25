/**
 * @fileoverview Controlador para la autenticación de usuarios
 * @module controllers/authController
 */

const { registerService, loginService } = require('../services/authService');
const { ValidationError } = require('../utils/appError');
const { validateRegister, validateUser } = require('../utils/userValidation');

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
        if(!email || !name || !password || !role){
            throw new ValidationError('Falta información en un campo', 400);
        }
        const validation = validateRegister({ email, name, password, role });
        if (!validation.isValid){
            throw new ValidationError(validation.error);
        }
        await registerService(email, name, password, role);
        return res.status(201).json({ message: `User: ${name} was created succesfully!`});
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
            throw new ValidationError('Falta información en un campo', 400);
        }
        const token = await loginService(email, password);
        return res.status(200).json({ token: token });
    } catch (error) {
        next(error);
    }
}