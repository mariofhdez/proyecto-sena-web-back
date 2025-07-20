// "use strict";

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
}

function isValidName(name) {
    return typeof name === 'string' && name.length > 2;
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return typeof password === 'string' && passwordRegex.test(password);
}

function isValidRole(role){
    const allowedRoles = [ 'ADMIN', 'USER'];
    return typeof role === 'string' && allowedRoles.includes(role.toUpperCase())
}

function validateRegister(user){

    if(!isValidName(user.name)) {
        return {
            isValid: false,
            error: 'The field \'name\' must be greater than 2 characters',
        }
    }

    if(!isValidPassword(user.password)) {
        return {
            isValid: false,
            error: 'The password must be at least 8 characters, one letter and one number',
        }
    }

    if(!isValidEmail(user.email)) {
        return {
            isValid: false,
            error: 'The field \'email\' does not meet the expected structure of an email',
        }
    }

    if(!isValidRole(user.role)){
        return {
            isValid: false,
            error: 'Invalid role'
        }
    }

    return { isValid: true };
}

function isValidStatus(isActive) {
    return typeof isActive === 'string' && (isActive === 'TRUE' || isActive === 'FALSE');
}


function validateUser(user) {

    const register = validateRegister(user); 
    if(!register.isValid){
        return {
            isValid: register.isValid,
            error: register.error
        }
    }

    if(!isValidRole(user.role)) {
        return {
            isValid: false,
            error: 'El campo \'role\' no es alguno de los valores esperados: \'ADMIN\' o \'USER\''
        }
    }

    if(!isValidStatus(user.isActive)){
        return {
            isValid: false,
            error: 'El campo \'isActive\' no es alguno de los valores esperados.'
        } 
    }
    
    return { isValid: true };
}

function validateUpdate(user){
    let errors = [];

    if(user.name) {
        if(!isValidName(user.name)) {
            errors.push('El campo \'name\' debe ser igual o mayor a 3 caracteres');
        }
    }

    if(user.email) {
        if(!isValidEmail(user.email)) {
            errors.push('El campo \'email\' no cumple con la estructura esperada de un correo');
        }
    }

    if(user.password) {
        if(!isValidPassword(user.password)) {
            errors.push('La contraseña debe tener al menos 8 caracteres, una letra y un número');
        }
    }

    if(user.role) {
        errors.push('Debes contactar al administrador del sistema para actualizar tu \'role\'');
    }

    if(user.isActive) {
        if(!isValidStatus(user.isActive)) {
            errors.push('Debes contactar al administrador del sistema para actualizar el estado \'isActive\' de tu usuario');
        }
    }

    return { isValid: errors.length === 0, errors };
}

function updateData(data){
    let user = {};
    if(data.name) user.name = data.name;
    if(data.email) user.email = data.email;
    if(data.password) user.password = data.password;

    return user;
}

module.exports = {
    validateUser, validateRegister, validateUpdate, updateData
}