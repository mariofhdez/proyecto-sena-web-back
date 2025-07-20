const prisma = require('../config/database');
const { NotFoundError } = require("../utils/appError");

exports.getAllNovelties = async (data) => {
    const novelties = await prisma.novelty.findMany(data);
    if (!novelties) throw new NotFoundError('Novelties were not found');
    return novelties;
}

exports.getById = async (id) => {
    const novelty = await prisma.novelty.findUnique({
        where: {
            id: id
        }
    });
    if (!novelty) throw new NotFoundError('Novelty with id \'' + id + '\' was not found');
    return novelty;
}

exports.create = async (data) => {
    const novelty = await prisma.novelty.create({
        data: data
    });
    if (!novelty) throw new NotFoundError('Novelty was not created');
    return novelty;
}

exports.update = async (id, data) => {
    const novelty = await prisma.novelty.update({
        where: {
            id: id
        },
        data: data
    });
    if (!novelty) throw new NotFoundError('Novelty was not updated');
    return novelty;
}

exports.remove = async (id) => {
    const novelty = await prisma.novelty.delete({
        where: {
            id: id
        }
    });
    if (!novelty) throw new NotFoundError('Novelty was not deleted');
    return novelty;
}

exports.query = async (data) => {
    const novelty = await prisma.novelty.findMany({where: data});
    if (!novelty) throw new NotFoundError('Novelty was not found');
    return novelty;
}