const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

async function verifyId(id, model){
  const isVerified = await prisma[model].findUnique({ where: {id: id}});
  return isVerified? true: false;
}

async function verifyIdentification(identification, model){
  const isVerified = await prisma[model].findUnique({ where: {identification: identification}});
  return isVerified? true: false;
}

module.exports = { verifyId, verifyIdentification }