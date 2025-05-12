const userService = require ('../services/userService');
const { ValidationError } = require('../utils/appError');
const { isValidNumericType } = require('../utils/userValidation');

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