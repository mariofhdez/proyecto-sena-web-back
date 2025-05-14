require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3005;

// Este fichero controla temas específicos del servidor como el puerto

app.listen(PORT, () => {
    console.log(`Servidor: http://localhost/${PORT}`);
});