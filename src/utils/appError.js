/**
 * @fileoverview Clases de error personalizadas para el manejo de errores en la aplicación
 * @module utils/appError
 */

/**
 * Clase base para errores de la aplicación
 * 
 * @class AppError
 * @extends Error
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error para recursos no encontrados (404)
 * 
 * @class NotFoundError
 * @extends AppError
 * @param {string} message - Mensaje de error (opcional)
 */
class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado'){
        super(message, 404);
    }
}

/**
 * Error para datos de validación inválidos (400)
 * 
 * @class ValidationError
 * @extends AppError
 * @param {string} message - Mensaje de error (opcional)
 * @param {Array|string} errors - Lista de errores de validación (opcional)
 */
class ValidationError extends AppError {
    constructor(message = 'Datos inválidos', errors = []){
        super(message, 400);
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}

/**
 * Error para acceso no autorizado (401)
 * 
 * @class UnauthorizedError
 * @extends AppError
 * @param {string} message - Mensaje de error (opcional)
 */
class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado'){
        super(message, 401);
    }
}

/**
 * Error para acceso prohibido (403)
 * 
 * @class ForbiddenError
 * @extends AppError
 * @param {string} message - Mensaje de error (opcional)
 */
class ForbiddenError extends AppError {
    constructor(message = 'Acceso no permitido'){
        super(message, 403)
    }
}

module.exports = {AppError,ForbiddenError,NotFoundError,UnauthorizedError, ValidationError};