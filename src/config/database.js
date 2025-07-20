const { PrismaClient } = require('../../generated/prisma');

/**
 * Cliente Prisma configurado según el entorno
 * En testing usa TEST_DATABASE_URL, en otros entornos usa DATABASE_URL
 */
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.NODE_ENV === 'test' 
                ? process.env.TEST_DATABASE_URL 
                : process.env.DATABASE_URL
        }
    }
});

module.exports = prisma; 