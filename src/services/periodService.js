const prisma = require('../config/database');

const { ValidationError } = require('../utils/appError');
const { verifyId } = require('../utils/verifyId');

exports.getAll = async (query) => {
    let where = {
        // status: { not: 'VOID'},
        ...query
    }
    const periods = await prisma.period.findMany({
        where: where
    });
    if (!periods) throw new Error('Periods not found');
    return periods;
};

exports.getById = async (id) => {
    const period = await prisma.period.findUnique({
        where: { id: id },
        include: {
            settlements: {include: {
            employee: true}}
        }
    });
    if (!period) throw new Error('Period not found');
    return period;
};

exports.create = async (data) => {
    data.createdAt = new Date();
    const newPeriod = await prisma.period.create({
        data,
        include: {
            settlements: false
        }
    });
    if (!newPeriod) throw new Error('Period was not created');
    return newPeriod;
};

exports.delete = async (id) => {
    const isValidId = await verifyId(id, 'period');
    if (!isValidId) throw new ValidationError('The period does not exist in the database');
    const period = await prisma.period.delete({
        where: { id: id }
    });
    if (!period) throw new Error('Period was not deleted');
    return period;
}

exports.query = async (query) => {
    const periods = await prisma.period.findMany({
        where: query
    });
    return periods;
}

exports.update = async (id, data) => {
    const updatedPeriod = await prisma.period.update({
        where: { id: id },
        data: data,
        include: {
            settlements: true
        }
    });
    if (!updatedPeriod) throw new Error('Period was not updated');
    return updatedPeriod;
}

// TODO: Actualizar, eliminar, y otros metodos