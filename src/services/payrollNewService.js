const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');

exports.getAll = async () => {
    return await prisma.payrollNews.findMany({
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
        }
    });
};

exports.getById = async (id) => {
    const news = await prisma.payrollNews.findUnique({
        where: { id: parseInt(id) },
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
        }
    });
    if (!news) throw new NotFoundError('Novedad de nómina no encontrada');
    return news;
};

exports.create = async (data) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toISOString();
    };

    return await prisma.payrollNews.create({
        data: {
            newsDate: formatDate(data.newsDate),
            newsQuantity: data.newsQuantity,
            newsValue: data.newsValue,
            payrollConcept: {
                connect: {
                    id: data.payrollConceptId
                }
            },
            employee: {
                connect: {
                    id: data.employeeId
                }
            }
        },
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
        }
    });
};

exports.update = async (id, data) => {
    return await prisma.payrollNews.update({
        where: { id: parseInt(id) },
        data: {
            newsDate: data.newsDate ? new Date(data.newsDate) : undefined,
            newsQuantity: data.newsQuantity,
            newsValue: data.newsValue,
            payrollConceptId: data.payrollConceptId,
            employeeId: data.employeeId,
            employeeSettlementId: data.employeeSettlementId
        },
        include: {
            payrollConcept: true,
            employee: true,
            employeeSettlement: true
        }
    });
};

exports.remove = async (id) => {
    return await prisma.payrollNews.delete({
        where: { id: parseInt(id) }
    });
};