const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { verifyId } = require('../utils/verifyId');

exports.retrieve = async () => {
    const deductions = await prisma.settlementDeduction.findMany();
    if(!deductions) throw new Error('No se encontraron Deducciones');
    return deductions;
}

exports.getById = async (id) => {
    const deduction = await prisma.settlementDeduction.findUnique({ where: { id: id}});
    if (!deduction) throw new Error('Deducción no encontrada');
    return deduction;
}

exports.create = async (data) => {
    const newDeduction = await prisma.settlementDeduction.create({
        data
    });
    if (!newDeduction) throw new Error('No se pudo crear la Deducción');
    return newDeduction;
}

exports.update = async (id, data) => {
    const isValidId = await verifyId(id, 'settlementDeduction');
  if (!isValidId) throw new ValidationError('La Deducción no se encuentra registrada en base de datos');
    const updatedSettlementDeduction = await prisma.settlementDeduction.update({
        where: { id: id },
        data
    });
    if (!updatedSettlementDeduction) throw new Error('No se pudo realizar al actualización a la Deducción');
    return updatedSettlementDeduction;
}

exports.delete = async (id) => {
    const isValidId = await verifyId(id, 'settlementDeduction');
  if (!isValidId) throw new ValidationError('La Deducción no se encuentra registrada en base de datos');
    return await prisma.settlementDeduction.delete({ where: { id: id}});
}