/**
 * @fileoverview Controlador para la gestión de usuarios
 * @module controllers/userController
 */

const userService = require ('../services/userService');
const { ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

/**
 * Actualiza la información de un usuario
 * 
 * @async
 * @function updateUser
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.user - Información del usuario autenticado
 * @param {number} req.user.id - ID del usuario a actualizar
 * @param {Object} req.body - Datos a actualizar del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de éxito
 * @throws {ValidationError} Si el ID no es válido o falta información en el cuerpo
 */
exports.updateUser = async (req, res, next) => {
    try{
        if (!isValidNumericType(req.user.id, 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');
        if(!req.body) throw new ValidationError('La información a editar es requerida')
        await userService.updateUser(req.user.id, req.body);

        return res.status(200).json({ message: 'Usuario actualizado con éxito!' });
    } catch(error){
        next(error);
    }
}