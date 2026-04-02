require('dotenv').config();

const { PrismaClient } = require('../../generated/prisma');

async function cleanDatabase() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.TEST_DATABASE_URL
            }
        }
    });

    try {
        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
        
        const tables = await prisma.$queryRaw`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE()
        `;

        for (const table of tables) {
            const tableName = table.TABLE_NAME;
            if (tableName !== 'migrations') {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName}`);
            }
        }

        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
        console.log('✅ Base de datos de test limpiada');
    } catch (error) {
        console.error('❌ Error limpiando BD:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

cleanDatabase(); 