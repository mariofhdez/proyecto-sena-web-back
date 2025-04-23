require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { validateUser } = require('./utils/validation');
const LoggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);

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

    // valida información
    if (!newUser || Object.keys(newUser).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con la conexión de datos' })
        }
        const users = JSON.parse(data);

        const validation = validateUser(newUser, users);

        if(!validation.isValid){
            return res.status(400).json({ error: validation.error });
        }

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar usuario' })
            }
            res.status(201).json(newUser);
        })
    });
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    if (!updatedUser || Object.keys(updatedUser).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }
        let users = JSON.parse(data);

        const validation = validateUser(updatedUser, users);

        if(!validation.isValid){
            return res.status(400).json({ error: validation.error });
        }
        
        users = users.map(user => (user.id === userId ? {...user, ...updatedUser}:user));

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err){
                return res.status(500).json({ error: 'Error al guardar usuario' })
            }
            res.json(updatedUser);
        })
    })
})

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }
        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId);
        
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err){
                return res.status(500).json({ error: 'Error al eliminar usuario' })
            }
            res.status(204).send();
        })
    })
});

app.get('/error', (req, res, next) => {
    next(new Error('Error intencional'));
});


app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`)
});