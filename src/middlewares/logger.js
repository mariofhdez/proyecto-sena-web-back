/**
 * @fileoverview Middleware para el registro de solicitudes y respuestas HTTP
 * @module middlewares/logger
 */

/**
 * Middleware que registra información sobre las solicitudes entrantes y sus respuestas
 * 
 * @function LoggerMiddleware
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @description Este middleware registra la marca de tiempo, método HTTP, URL e IP 
 * para cada solicitud entrante. También mide y registra el tiempo de respuesta y 
 * el código de estado HTTP cuando la respuesta se completa.
 */
const LoggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] Response: ${res.statusCode} - ${duration} ms`)
    });

    next();
}

module.exports = LoggerMiddleware;