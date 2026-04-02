const { PrismaClient } = require('../../generated/prisma');
/**
 * Cliente Prisma configurado según el entorno
 * En testing usa TEST_DATABASE_URL, en otros entornos usa DATABASE_URL
 */

let prisma;

if( !global.prisma ) {
    prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.NODE_ENV === 'test' 
                    ? process.env.TEST_DATABASE_URL 
                    : process.env.DATABASE_URL
            }
        }
    });
    globalThis.prisma = prisma;
} else {
    prisma = global.prisma;
}


module.exports = prisma; 