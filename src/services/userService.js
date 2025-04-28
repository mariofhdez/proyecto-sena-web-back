const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.updateUser = async (userId, data) =>{
    try{
        return prisma.user.update({
            where: { id: parseInt(userId)},
            data
        });
    } catch (error){
        throw new Error( error );
    }
}