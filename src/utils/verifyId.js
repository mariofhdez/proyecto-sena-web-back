const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

async function verifyId(id, model){
  const isVerified = await prisma[model].findUnique({ where: {id: id}});
  return isVerified? true: false;
}

module.exports = { verifyId }