const { getUsersService, deactivateUser, deleteUser, getUserById } = require('../services/adminService');
const { ForbiddenError, NotFoundError, ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

exports.users = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') throw new ForbiddenError("Acceso denegado");

        const users = await getUsersService();
        if (!users) throw new NotFoundError('Error consultando datos');

        return res.json(users);
    } catch (error) {
        next(error);
    }
}

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

exports.deactivateUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') throw new ForbiddenError("Acceso denegado");

        if (!req.params.id || req.params.id === null) throw new ValidationError('Falta el \'id\' en el path.');
        if (!isValidNumericType(parseInt(req.params.id), 'number')) throw new ValidationError('El \'id\' debe ser un valor numérico.');
        
        await deactivateUser(req.params.id);
        
        return res.status(201).json({ message: 'Usuario desactivado correctamente.' });
    } catch (error) {
        next(error);
    }
}

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