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

app.post('/form', (req, res) => {
    const name = req.body.name || 'anónimo';
    const email = req.body.email || 'No proporcionado';
    res.json({
        message: 'Datos recibidos',
        data: {
            name,
            email
        }
    });
});

app.post('/api/data', (req, res) =>{
    const data = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({error: 'No se recibieron datos'});
    }

    res.status(200).json({
        message: 'Datos JSON recibidos',
        data
    });

})


app.listen(PORT, () =>{
console.log(`Servidor: http://localhost:${PORT}`)
});