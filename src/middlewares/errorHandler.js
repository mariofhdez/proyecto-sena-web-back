/**
 * @fileoverview Middleware para el manejo centralizado de errores en la aplicación
 * @module middlewares/errorHandler
 */

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

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}}`);

    if(err.stack){
        console.error(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // ...err(process.env.NODE_ENV === 'develpoment' && { stack: err.stack })
    });
}

module.exports = errorHandler;