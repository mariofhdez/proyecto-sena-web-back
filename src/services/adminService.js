const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.getUsers = async () => {
    try{
        const users = await prisma.user.findMany();
        return users;
    } catch (error){
        throw new Error( 'Error conectando a la Base de Datos' );
    }
}

exports.getUser = async (id) => {
    try{
        const user = await prisma.user.findFirst({ where: { id: parseInt(id,10) }});
        return user;
    } catch (error){
        console.error(error);
        throw new Error( 'Error conectando a la Base de Datos', error );
    }
}

exports.deactivateUser = async (userId) => {
    try {
        return  prisma.user.update({
            where: { id: parseInt(userId, 10)},
            data: { isActive: false}
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