const express = require('express');
const routes = require('./routes');

// Este fichero contiene lo básico de la aplicación: rutas y la librería principal

const app = express();

app.use(express.json());

app.use('/api', routes);

app.get('/{any}', (req, res) => {
    res.status(404)
        // .json({ error: 'Page not found' })
        .send(`
        <h1>Error 404</h1>
        <h3>Página no encontrada</h3>
        `);
});

module.exports = app;