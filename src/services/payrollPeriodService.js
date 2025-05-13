const { PrismaClient } = require('../../generated/prisma');
const { NotFoundError, ValidationError } = require('../utils/appError');
const prisma = new PrismaClient();

exports.getAll = async () => {
    return await prisma.payrollPeriod.findMany();
};

exports.getById = async (id) => {
    const period = await prisma.payrollPeriod.findUnique({
        where: { id: parseInt(id) }
    });
    
    if (!period) throw new NotFoundError('Período no encontrado');
    return period;
};

exports.create = async (data) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toISOString();
      };

    if (!data.startDate || !data.endDate) {
        throw new ValidationError('Las fechas de inicio y fin son requeridas');
    }

    return await prisma.payrollPeriod.create({
        data: {
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            employeesCount: data.employeesCount,
            totalEarned: data.totalEarned,
            totalDeduction: data.totalDeduction,
            totalPayment: data.totalPayment,
            settlementDate: formatDate(data.settlementDate)
        }
    });
};

exports.update = async (id, data) => {
    const period = await this.getById(id);

    return await prisma.payrollPeriod.update({
        where: { id: parseInt(id) },
        data: {
            startDate: data.startDate ? new Date(data.startDate) : period.startDate,
            endDate: data.endDate ? new Date(data.endDate) : period.endDate,
            status: data.status || period.status,
            description: data.description || period.description
        }
    });
};

exports.remove = async (id) => {
    await this.getById(id);
    
    return await prisma.payrollPeriod.delete({
        where: { id: parseInt(id) }
    });
};
