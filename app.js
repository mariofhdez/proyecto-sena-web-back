require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>Aplicación Versión 2</h1>
        `)
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Mostrar información del usuario con ID: ${userId}`)
});

app.get('/search', (req, res) => {
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

app.post('/api/data', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    res.status(200).json({
        message: 'Datos JSON recibidos',
        data
    });

});

app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con la conexión de datos' })
        }
        const users = JSON.parse(data);
        res.json(users);
    })
})

app.post('/users', (req, res) => {
    const newUser = req.body;
    const id = newUser.id;
    const name = newUser.name;
    const email = newUser.email;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // let users = [];

    if (!newUser || Object.keys(newUser).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    if (name.length < 3) {
        return res.status(400).json({ error: 'El campo \'name\' debe ser igual o mayor a 3 caracteres' })
    }

    if (!regex.test(email)) {
        return res.status(400).json({ error: 'El campo \'email\' no cumple con la estructura esperada de un correo' })
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(400).json({ error: 'Error con la conexión de datos' })
        }

        const users = JSON.parse(data);

        const isRegistered = users.find(user => user.id == id);

        if(!isRegistered){
            users.push(newUser);
        }else{
            return res.status(400).json({ error: 'El \'id\' ya se encuentra registrado en nuestra base de datos' })
        }


        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar usuario' })
            }
            res.status(201).json(newUser);
        })
    });

    // console.log(users.length);


});


app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`)
});