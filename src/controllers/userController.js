/**
 * @fileoverview Controlador para la gestión de usuarios
 * @module controllers/userController
 */

const userService = require ('../services/userService');
const { ValidationError, NotFoundError } = require('../utils/appError');
const userValidation = require('../utils/userValidation');
const { isValidNumericType } = require('../utils/typeofValidations');
const { verifyId } = require('../utils/verifyId');

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
        const id = parseInt(req.user.id);
        console.log(id);
        if (!isValidNumericType(id, 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');
        if(!req.body) throw new ValidationError('La información a editar es requerida');

        const verifiedUser = await verifyId(id, "user");
        if(!verifiedUser) throw new NotFoundError('El usuario no existe o no tienes permisos para editarlo');

        const validation = userValidation.validateUpdate(req.body);
        if (!validation.isValid) throw new ValidationError("Error al actualizar el usuario",validation.errors);

        const data = userValidation.updateData(req.body);
        await userService.updateUser(req.user.id, data);

        return res.status(200).json({ message: 'Usuario actualizado con éxito!' });
    } catch(error){
        next(error);
    }
}