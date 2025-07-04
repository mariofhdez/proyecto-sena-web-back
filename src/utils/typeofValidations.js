/**
 * @fileoverview Utilidades para validación de tipos de datos
 * @module utils/typeofValidations
 */

/**
 * Valida si un valor es un número válido con hasta 2 decimales
 * 
 * @function isValidNumericType
 * @param {*} input - Valor a validar
 * @returns {boolean} true si es un número válido, false en caso contrario
 */
function isValidNumericType(input) {
    const numberRegex = /^(\d+(\.\d{1,2})?|\.\d{1,2})$/;
    return typeof input === 'number' && numberRegex.test(input);
}

/**
 * Verifica si un valor es null o undefined
 * 
 * @function isNull
 * @param {*} input - Valor a verificar
 * @returns {boolean} true si es null o undefined, false en caso contrario
 */
function isNull(input) {
    if (!input || input === null) {
        return true;
    }
    return false;
}

/**
 * Valida si un valor es de tipo string
 * 
 * @function isValidStringType
 * @param {*} input - Valor a validar
 * @returns {boolean} true si es un string, false en caso contrario
 */
function isValidStringType(input) {
    if (typeof input !== 'string') {
        return false;
    }
    return true;
}

/**
 * Verifica si un campo string no está en blanco
 * 
 * @function isBlankField
 * @param {string} input - String a verificar
 * @returns {boolean} true si no está en blanco, false en caso contrario
 */
function isBlankField(input) {
    if (input.trim().length === 0) {
        return false;
    }
    return true;
}

/**
 * Valida si un valor es de tipo boolean
 * 
 * @function isBooleanType
 * @param {*} input - Valor a validar
 * @returns {boolean} true si es un boolean, false en caso contrario
 */
function isBooleanType(input) {
    return typeof input === 'boolean';
}

/**
 * Valida si un string tiene formato de fecha válido (YYYY-MM-DD)
 * 
 * @function isValidDateFormat
 * @param {string} input - String de fecha a validar
 * @returns {boolean} true si es una fecha válida, false en caso contrario
 */
function isValidDateFormat(input) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // Check if input is a string and matches YYYY-MM-DD pattern
    if (typeof input !== 'string' || !dateRegex.test(input)) {
        return false;
    }

    // Parse the date parts
    const [year, month, day] = input.split('-').map(Number);

    // Create a date object and verify the date is valid
    const date = new Date(year, month - 1, day); // month is 0-based

    // Check if the date parts match what we passed in
    // This catches invalid dates like 2025-02-30
    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

/**
 * Valida que un campo string sea requerido y válido
 * 
 * @function validateRequiredString
 * @param {*} input - Valor a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @param {Array} errors - Array donde se agregarán los errores encontrados
 */
function validateRequiredString(input, name, errors) {
    if (isNull(input)) {
        return errors.push("The field " + name + " is required");
    } else {
        if (!isValidStringType(input)) {
            return errors.push("The field " + name + " must be a string");
        }
        else {
            if (!isBlankField(input)) {
                return errors.push("The field " + name + " cannot be empty");
            }
        }
    }
}

/**
 * Valida que un campo numérico sea requerido y válido
 * 
 * @function validateRequiredNumber
 * @param {*} input - Valor a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @param {Array} errors - Array donde se agregarán los errores encontrados
 */
function validateRequiredNumber(input, name, errors) {
    if (isNull(input)) {
        return errors.push("The field " + name + " is required");
    }
    else {
        if (!isValidNumericType(input)) {
            errors.push("The field " + name + " must be a number with up to 2 decimal places");
        }
    }
}

/**
 * Valida que un campo tenga formato de fecha válido
 * 
 * @function validateDateFormat
 * @param {string} input - Fecha a validar
 * @param {string} field - Nombre del campo para mensajes de error
 * @param {Array} errors - Array donde se agregarán los errores encontrados
 */
function validateDateFormat(input, field, errors) {
    if (!isValidDateFormat(input)) {
        errors.push("The field " + field + " must be a valid date");
    }
}

/**
 * Divide una fecha en sus componentes (año, mes, día)
 * 
 * @function splitDate
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {Object} Objeto con year, month y day
 */
function splitDate(date) {
    const [year, month, day] = date.split('-').map(Number);
    return {
        year: year,
        month: month,
        day: day
    }
}

/**
 * Convierte un timestamp a formato de fecha YYYY-MM-DD
 * 
 * @function fromTimestampToDate
 * @param {number} timestamp - Timestamp a convertir
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
function fromTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const newDate = date.toISOString().split('T')[0];
    return newDate;
}

module.exports = {
    isValidNumericType,
    isNull,
    isValidStringType,
    isBlankField,
    isBooleanType,
    validateRequiredString,
    validateRequiredNumber,
    isValidDateFormat,
    validateDateFormat,
    splitDate,
    fromTimestampToDate
};