// "use strict";

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
}

function isValidName(name) {
    return typeof name === 'string' && name.length > 2;
}

function isUniqueId(id, users) {
    return typeof id === 'number' && !users.some(user => user.id === id);
}

function validateUser(user, users) {
    const { name, email, id } = user;
    if(!isValidName(name)) {
        return {
            isValid: false,
            error: 'El campo \'name\' debe ser igual o mayor a 3 caracteres',
        }
    }
    if(!isValidEmail(email)) {
        return {
            isValid: false,
            error: 'El campo \'email\' no cumple con la estructura esperada de un correo',
        }
    }
    if(!isUniqueId(id, users)) {
        return {
            isValid: false,
            error: 'El campo \'id\' debe ser numérico y único.'
        }
    }
    return { isValid: true };
}

module.exports = {
    validateUser,
}