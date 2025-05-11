const { registerService, loginService } = require('../services/authService');
const { ValidationError } = require('../utils/appError');
const { validateRegister, validateUser } = require('../utils/userValidation');

exports.register = async(req, res, next) => {
    try {
        const { email, name, password, role } = req.body;
        if(!email || !name || !password || !role){
            throw new ValidationError('Falta información en un campo', 400);
        }
        const validation = validateRegister({ email, name, password, role });
        if (!validation.isValid){
            console.log(validation.error);
            throw new ValidationError(validation.error);
        }
        await registerService(email, name, password, role);
        return res.status(201).json({ message: `User: ${name} was created succesfully!`});
    } catch (error) {
        next(error);
    }
}

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