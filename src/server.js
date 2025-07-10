/**
 * @fileoverview Archivo principal del servidor que configura e inicia la aplicación
 * @requires dotenv
 * @requires ./app
 */

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa la aplicación Express configurada
const app = require('./app');

// Importa la función para cargar conceptos de nómina
const { loadPayrollConcepts } = require('./config/payrollConcepts');

// Define el puerto del servidor, usando el valor de la variable de entorno PORT o 3005 como fallback
const PORT = process.env.PORT || 3005;

/**
 * Inicia el servidor en el puerto especificado
 * @listens {number} PORT - Puerto en el que se ejecutará el servidor
 */
async function main() {
    try {
        // Inicializa conceptos de nómina antes de arrancar el servidor
        await loadPayrollConcepts();
        console.log('✅ Conceptos de nómina inicializados correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al inicializar conceptos de nómina o al iniciar el servidor:', error);
        process.exit(1);
    }
}

main();