const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.getUsersService = async () => {
    const users = await prisma.user.findMany();
    return users;
}