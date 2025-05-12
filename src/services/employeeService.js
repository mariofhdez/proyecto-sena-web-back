const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.trabajador.findMany();
};

exports.getById = async (id) => {
  const user = await prisma.trabajador.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new NotFoundError('Usuario no encontrado');
  return user;
};

exports.create = async (data) => {
  return await prisma.trabajador.create({ 
    data:{
        //TODO: crear la lógica que crea el empleado + direccion
    } 
});
};

exports.update = async (id, data) => {
  return await prisma.trabajador.update({
    where: { id: parseInt(id) },
    data
  });
};

exports.remove = async (id) => {
  return await prisma.trabajador.delete({ where: { id: parseInt(id) } });
};
