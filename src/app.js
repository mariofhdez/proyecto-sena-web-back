/**
 * @fileoverview Configuración principal de la aplicación Express
 * @requires express
 * @requires cors
 * @requires ./routes
 * @requires ./middlewares/errorHandler
 * @requires ./middlewares/logger
 */

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/logger')

/**
 * @type {express.Application}
 * Instancia principal de la aplicación Express
 */
const app = express();

// Middleware para procesar JSON en las peticiones
app.use(express.json());

// Middleware para logging de peticiones
app.use(loggerMiddleware);

// Middleware para habilitar CORS
app.use(cors());

// Montaje de las rutas de la API bajo el prefijo '/api'
app.use('/api', routes);

/**
 * Manejador de rutas no encontradas (404)
 * @param {express.Request} req - Objeto de petición
 * @param {express.Response} res - Objeto de respuesta
 */
app.get('/{any}', (req, res) => {
    res.status(404)
    .json({ 
        error: 'Not Found',
        message: 'La ruta solicitada no existe',
        path: req.path
    })
    .send(`
        <h1>Error 404</h1>
        <h3>Página no encontrada</h3>
        `);
});

// Middleware para manejo global de errores
app.use(errorHandler);
    
module.exports = app;