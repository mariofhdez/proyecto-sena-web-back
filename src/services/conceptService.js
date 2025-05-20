const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');

exports.getAll = async () => {
    const settlementNews = await prisma.payrollConcept.findMany({});
    if(!settlementNews) throw new Error('Error al consultar las Novedades');
    return settlementNews;
};


exports.getById = async (id) => {
    const news = await prisma.payrollConcept.findUnique({
        where: { id: id }
    });
    if (!news) throw new NotFoundError('Novedad de nómina no encontrada');
    return news;
};