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
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de nómina',
            version: '1.0.0',
            description: 'API para la gestión de nómina'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ],
        components: {}
    },
    apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);


/**
 * @type {express.Application}
 * Instancia principal de la aplicación Express
*/
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
});

// Middleware para manejo global de errores
app.use(errorHandler);

module.exports = app;