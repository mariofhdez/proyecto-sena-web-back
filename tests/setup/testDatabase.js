require('dotenv').config();

const { PrismaClient } = require('../../generated/prisma');

class TestDatabase {
    constructor() {
        this.prisma = null;
    }

    /**
     * Inicializa la conexión a la base de datos de test
     */
    async initialize() {
        // Verificar entorno
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('TestDatabase solo debe usarse en entorno de test');
        }

        // Inicializar Prisma con la base de datos de test
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.TEST_DATABASE_URL
                }
            }
        });

        return this.prisma;
    }

    /**
     * Limpia todas las tablas de la base de datos de test
     */
    async cleanDatabase() {
        if (!this.prisma) return;

        try {
            // Desactivar foreign key checks temporalmente
            await this.prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;

            // Obtener todas las tablas
            const tables = await this.prisma.$queryRaw`
                SELECT TABLE_NAME 
                FROM information_schema.TABLES 
                WHERE TABLE_SCHEMA = DATABASE()
            `;

            // Truncar todas las tablas
            for (const table of tables) {
                const tableName = table.TABLE_NAME;
                if (tableName !== 'migrations') {
                    await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName}`);
                }
            }

            // Reactivar foreign key checks
            await this.prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
        } catch (error) {
            console.log('⚠️  Error limpiando BD:', error.message);
        }
    }

    /**
     * Cierra la conexión a la base de datos
     */
    async close() {
        if (this.prisma) {
            await this.prisma.$disconnect();
        }
    }

    /**
     * Obtiene la instancia de Prisma
     */
    getPrisma() {
        if (!this.prisma) {
            throw new Error('TestDatabase no ha sido inicializada');
        }
        return this.prisma;
    }
}

module.exports = TestDatabase; 