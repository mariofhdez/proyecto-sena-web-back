require('dotenv').config();

/**
 * Setup global simple para tests
 */
async function globalSetup() {
    console.log('🚀 Configurando entorno de testing...');
    
    // Verificar entorno
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Los tests solo deben ejecutarse con NODE_ENV=test');
    }

    // Verificar configuración de BD de test
    if (!process.env.TEST_DATABASE_URL) {
        throw new Error('TEST_DATABASE_URL no está configurada en .env');
    }

    console.log('✅ Entorno de testing configurado');
}

module.exports = globalSetup; 