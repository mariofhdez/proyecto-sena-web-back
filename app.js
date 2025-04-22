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


app.listen(PORT, () =>{
console.log(`Servidor: http://localhost:${PORT}`)
});