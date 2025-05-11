class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado'){
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Datos inválidos', errors = []){
        super(message, 400);
        this.erros = errors;
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado'){
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Acceso no permitido'){
        super(message, 403)
    }
}

module.exports = {AppError,ForbiddenError,NotFoundError,UnauthorizedError, ValidationError};