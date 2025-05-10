const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/logger')

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(cors());

app.use('/api', routes);

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
app.use(errorHandler);
    
module.exports = app;