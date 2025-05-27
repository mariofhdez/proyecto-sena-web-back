/**
 * @fileoverview Middleware para el manejo centralizado de errores en la aplicación
 * @module middlewares/errorHandler
 */

const { isNull } = require('../utils/typeofValidations');

/**
 * Middleware que captura y procesa todos los errores de la aplicación
 * 
 * @function errorHandler
 * @param {Object} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con información del error
 * 
 * @description Este middleware captura cualquier error lanzado en la aplicación,
 * registra los detalles en la consola y envía una respuesta JSON estructurada al cliente.
 * El código de estado y el mensaje se toman del error si están disponibles, o se usan valores predeterminados.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocurrió un error inesperado';
    const errors = err.errors || null;

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}}`);

    if(err.stack){
        console.error(err.stack);
    }

    let errorResponse = {}
    errorResponse.message = message;
    if(!isNull(errors)) {
        errorResponse.errors= errors || []
    }

    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;