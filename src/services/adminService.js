const { PrismaClient } = require('../../generated/prisma');
const { NotFoundError } = require('../utils/appError');
const prisma = new PrismaClient();

exports.getUsersService = async () => {
    const users = await prisma.user.findMany();
    return users;

}

exports.getUserById = async (id) => {

    const user = await prisma.user.findFirst({ where: { id: parseInt(id, 10) } });
    if (!user) throw new NotFoundError('Usuario no encontrado')

    return user;
}

exports.deactivateUser = async (userId) => {

    if (!this.getUserById(userId)) {
        throw new NotFoundError('Usuario no encontrado')
    }

    return prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { isActive: 'FALSE' }
    });

}

exports.deleteUser = async (userId) => {

    return prisma.user.delete({ where: { id: parseInt(userId, 10) } });

}