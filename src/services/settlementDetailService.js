const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const { NotFoundError } = require("../utils/appError");

exports.getAllSettlementDetails = async(query) => {
    const settlementDetails = await prisma.settlementDetail.findMany(query);
    if(!settlementDetails) throw new NotFoundError('Settlement details were not found');
    return settlementDetails;
}

exports.getById = async(id) => {
    const settlementDetail = await prisma.settlementDetail.findUnique({
        where: {
            id: id
        }
    });
    if(!settlementDetail) throw new NotFoundError('Settlement detail with id \'' + id + '\' was not found');
    return settlementDetail;
}

exports.create = async(data) => {
    const settlementDetail = await prisma.settlementDetail.create({
        data: data
    });
    if(!settlementDetail) throw new Error('Settlement detail was not created');
    return settlementDetail;
}

exports.update = async(id, data) => {

}

exports.remove = async(id) => {
    const settlementDetail = await prisma.settlementDetail.delete({
        where: {
            id: id
        }
    });
    if(!settlementDetail) throw new NotFoundError('Settlement detail with id \'' + id + '\' was not found');
    return settlementDetail;
}