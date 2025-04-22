require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res)=>{
    res.send(`
        <h1>Aplicación Versión 2</h1>
        `)
});

app.get('/users/:id', (req, res)=>{
    const userId = req.params.id;
    res.send(`Mostrar información del usuario con ID: ${userId}`)
});

app.get('/search', (req, res) =>{
    const terms = req.query.termino || 'No especificado';
    const category = req.query.category || 'Todas';

    res.send(`
        <h2> Resultados de búsqueda:</h2>
        <p>Término: ${terms}</p>
        <p>Categoría: ${category}</p>
        `);
});


app.listen(PORT, () =>{
console.log(`Servidor: http://localhost:${PORT}`)
});