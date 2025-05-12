const { PrismaClient } = require('../../generated/prisma');
const { NotFoundError } = require('../utils/appError');
const prisma = new PrismaClient();

exports.getUsersService = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });
    return users;

}

exports.getUserById = async (id) => {

    const user = await prisma.user.findFirst({
        where: { id: parseInt(id, 10) }, select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    return user;
}

exports.deactivateUser = async (userId) => {

    const user = await prisma.user.findFirst({
        where: { id: parseInt(userId, 10) }, select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    return prisma.user.update({
        where: { id: parseInt(user.id, 10) },
        data: { isActive: false }
    });
}

exports.deleteUser = async (userId) => {

    const user = await prisma.user.findFirst({
        where: { id: parseInt(userId, 10) }, select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
        }
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    return prisma.user.delete({ where: { id: parseInt(userId, 10) } });

}