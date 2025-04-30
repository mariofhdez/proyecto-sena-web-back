const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.updateUser = async (userId, data) => {

    return prisma.user.update({
        where: { id: parseInt(userId) },
        data
    });
} 