const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

async function createNovelty(data) {
  return prisma.novelty.create({ data });
}

async function getNovelties(filter = {}) {
  return prisma.novelty.findMany({ where: filter });
}

async function getNoveltyById(id) {
  return prisma.novelty.findUnique({ where: { id: Number(id) } });
}

async function updateNovelty(id, data) {
  return prisma.novelty.update({ where: { id: Number(id) }, data });
}

async function deleteNovelty(id) {
  return prisma.novelty.delete({ where: { id: Number(id) } });
}

module.exports = {
  createNovelty,
  getNovelties,
  getNoveltyById,
  updateNovelty,
  deleteNovelty,
}; 