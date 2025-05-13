const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { NotFoundError } = require('../utils/appError');

exports.getAll = async () => {
  return await prisma.employee.findMany();
};

exports.getById = async (id) => {
  const user = await prisma.employee.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new NotFoundError('Usuario no encontrado');
  return user;
};

exports.create = async (data) => {
  // Formatear las fechas al formato ISO
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString();
  };

  return await prisma.employee.create({ 
    data: {
      firstSurname: data.firstSurname,
      firstName: data.firstName,
      secondSurname: data.secondSurname,
      otherNames: data.otherNames,
      identification: data.identification,
      identificationType: {
        connect: {
          id: data.identificationType
        }
      },
      address: {
        create: {
          address: data.address.address,
          cityId: data.address.city,
          stateId: data.address.state
        }
      },
      paymentData: {
        create: {
          paymentMethodId: data.payment.paymentMethod,
          accountNumber: data.payment.bankAccount,
          bankEntity: data.payment.bank,
          isActive: true
        }
      },
      contracts: {
        create: {
          pensionRisk: data.contract.risk,
          integralSalary: data.contract.integralSalary,
          salary: data.contract.salary,
          startDate: formatDate(data.contract.startDate),
          endDate: formatDate(data.contract.endDate),
          position: data.contract.position,
          workerType: {
            connect: {
              id: data.contract.workerType
            }
          },
          workerSubtype: {
            connect: {
              id: data.contract.workerSubtype
            }
          },
          contractType: {
            connect: {
              id: data.contract.type
            }
          },
          address: {
            create: {
              address: data.address.address,
              cityId: data.address.city,
              stateId: data.address.state
            }
          }
        }
      }
    } 
  });
};

exports.update = async (id, data) => {
  return await prisma.employee.update({
    where: { id: parseInt(id) },
    data
  });
};

exports.remove = async (id) => {
  return await prisma.employee.delete({ where: { id: parseInt(id) } });
};
