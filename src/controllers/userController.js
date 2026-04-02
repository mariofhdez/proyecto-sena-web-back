/**
 * @fileoverview Controlador para la gestión de usuarios
 * @module controllers/userController
*/

const { getUsersService, toggleUserStatus, deleteUser, getUserById, updateUser } = require('../services/userService');
const { ForbiddenError, NotFoundError, ValidationError } = require('../utils/appError');
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
        await updateUser(req.user.id, data);

        return res.status(200).json({ message: 'Usuario actualizado con éxito!' });
    } catch(error){
        next(error);
    }
}

/**
 * Obtiene todos los usuarios del sistema
 * 
 * @async
 * @function users
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.user - Información del usuario autenticado
 * @param {string} req.user.role - Rol del usuario autenticado
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con la lista de usuarios
 * @throws {ForbiddenError} Si el usuario no tiene rol de administrador
 * @throws {NotFoundError} Si ocurre un error al consultar los datos
 */
exports.users = async (req, res, next) => {
    try {

        const users = await getUsersService();
        if (!users) throw new NotFoundError('Error consultando datos');

        return res.json(users);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene un usuario específico por su ID
 * 
 * @async
 * @function getUser
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.user - Información del usuario autenticado
 * @param {string} req.user.role - Rol del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del usuario a consultar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con los datos del usuario
 * @throws {ForbiddenError} Si el usuario no tiene rol de administrador
 * @throws {ValidationError} Si el ID no es válido o está ausente
 */
exports.getUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') throw new ForbiddenError("Acceso denegado");

        if (!req.params.id || req.params.id === null) throw new ValidationError('Falta el \'id\' en el path.');
        if (!isValidNumericType(parseInt(req.params.id), 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');

        const user = await getUserById(req.params.id);

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

/**
 * Desactiva un usuario en el sistema
 * 
 * @async
 * @function deactivateUser
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.user - Información del usuario autenticado
 * @param {string} req.user.role - Rol del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del usuario a desactivar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de éxito
 * @throws {ForbiddenError} Si el usuario no tiene rol de administrador
 * @throws {ValidationError} Si el ID no es válido o está ausente
 */
exports.toggleUserStatus = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') throw new ForbiddenError("Acceso denegado");

        if (!req.params.id || req.params.id === null) throw new ValidationError('Falta el \'id\' en el path.');
        if (!isValidNumericType(parseInt(req.params.id), 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');
        
        const updatedUser = await toggleUserStatus(req.params.id);
        
        return res.status(201).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

/**
 * Elimina un usuario del sistema
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.user - Información del usuario autenticado
 * @param {string} req.user.role - Rol del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del usuario a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con mensaje de éxito
 * @throws {ForbiddenError} Si el usuario no tiene rol de administrador
 * @throws {ValidationError} Si el ID no es válido o está ausente
 */
exports.deleteUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') throw new ForbiddenError("Acceso denegado");
        
        if (!req.params.id) throw new ValidationError('Falta el \'id\' en el path.');
        if (!isValidNumericType(parseInt(req.params.id,10), 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');

        await deleteUser(req.params.id);

        return res.status(201).json({ message: 'Usuario eliminado con éxito!' });
    } catch (error) {
        next(error);
    }
}