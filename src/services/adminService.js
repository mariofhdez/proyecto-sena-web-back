const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.getUsersService = async () => {
    try{
        const users = await prisma.user.findMany();
        return users;
    } catch (error){
        throw new Error( 'Error conectando a la Base de Datos' );
    }
}

exports.deactivateUser = async (userId) => {
    try {
        return  prisma.user.update({
            where: { id: parseInt(userId, 10)},
            data: { isActive: 'FALSE'}
        });
    } catch (error) {
        throw new Error( error )
    }
}

exports.deleteUser = async (userId) => {
    try {
        return prisma.user.delete({ where: { id: parseInt(userId, 10) }});
    } catch (error) {
        throw new Error('Error al eliminar usuario de la base de datos.');
    }
}