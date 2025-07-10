/**
 * @fileoverview Servicio para la gestión de liquidaciones
 * @module services/settlementService
 */

const { PrismaClient } = require('../../generated/prisma');
const { ValidationError, NotFoundError } = require('../utils/appError');
const prisma = new PrismaClient();

/**
 * Obtiene todas las liquidaciones
 */
exports.getAll = async () => {
    const settlements = await prisma.settlement.findMany({
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return settlements;
};

/**
 * Obtiene una liquidación específica por su ID
 */
exports.getById = async (id) => {
    const settlement = await prisma.settlement.findUnique({
        where: { id: id },
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        }
    });
    if (!settlement) {
        throw new NotFoundError('Settlement not found');
    }
    return settlement;
};

/**
 * Crea una nueva liquidación
 */
exports.create = async (data) => {
    console.log('Está llegando a create settlementService ', data);
    
    // Validar que employeeId esté presente y sea válido
    if (!data.employeeId || data.employeeId === undefined || data.employeeId === null) {
        console.error('❌ employeeId es undefined, null o vacío:', data.employeeId);
        throw new ValidationError('employeeId is required and must be a valid number');
    }
    
    console.log('✅ employeeId válido:', data.employeeId, 'tipo:', typeof data.employeeId);
    
    // Validar que el empleado esté activo
    const employee = await prisma.employee.findUnique({
        where: { id: parseInt(data.employeeId) }
    });
    
    if (!employee) {
        throw new NotFoundError('Employee not found');
    }
    
    if (!employee.isActive) {
        throw new ValidationError('Cannot create settlement for inactive employee');
    }

    // Validar fechas
    if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new ValidationError('Start date must be before end date');
    }

    const newSettlement = await prisma.settlement.create({
        data: {
            employeeId: parseInt(data.employeeId),
            periodId: data.periodId ? parseInt(data.periodId) : null,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: data.status || 'DRAFT',
            earningsValue: data.earningsValue || 0,
            deductionsValue: data.deductionsValue || 0,
            totalValue: data.totalValue || 0
        },
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        }
    });
    
    console.log('✅ Liquidación creada exitosamente:', newSettlement.id);
    return newSettlement;
};

/**
 * Actualiza una liquidación existente
 */
exports.update = async (id, data) => {
    const settlement = await prisma.settlement.findUnique({
        where: { id: id }
    });
    
    if (!settlement) {
        throw new NotFoundError('Settlement not found');
    }

    // Validar fechas si se están actualizando
    if (data.startDate || data.endDate) {
        const startDate = data.startDate || settlement.startDate;
        const endDate = data.endDate || settlement.endDate;
        
        if (new Date(startDate) >= new Date(endDate)) {
            throw new ValidationError('Start date must be before end date');
        }
    }

    const updatedSettlement = await prisma.settlement.update({
        where: { id: id },
        data: data,
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        }
    });
    
    return updatedSettlement;
};

/**
 * Elimina una liquidación (solo si está en DRAFT)
 */
exports.delete = async (id) => {
    const settlement = await prisma.settlement.findUnique({
        where: { id: id },
        include: {
            settlementDetails: true
        }
    });
    
    if (!settlement) {
        throw new NotFoundError('Settlement not found');
    }
    
    if (settlement.status !== 'DRAFT') {
        throw new ValidationError('Only DRAFT settlements can be deleted');
    }
    
    if (settlement.settlementDetails.length > 0) {
        throw new ValidationError('Cannot delete settlement with details');
    }
    
    const deletedSettlement = await prisma.settlement.delete({
        where: { id: id }
    });
    
    return deletedSettlement;
};

/**
 * Busca liquidaciones con filtros
 */
exports.query = async (query) => {
    const settlements = await prisma.settlement.findMany({
        where: query,
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return settlements;
};

/**
 * Cuenta liquidaciones con filtros
 */
exports.count = async (query) => {
    const count = await prisma.settlement.count({
        where: query
    });
    return count;
};

/**
 * Calcula y actualiza los totales de una liquidación
 */
exports.calculateTotals = async (id) => {
    const settlement = await prisma.settlement.findUnique({
        where: { id: id },
        include: {
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        }
    });
    
    if (!settlement) {
        throw new NotFoundError('Settlement not found');
    }
    
    let earningsTotal = 0;
    let deductionsTotal = 0;
    
    for (const detail of settlement.settlementDetails) {
        if (detail.concept.type === 'DEVENGADO') {
            earningsTotal += detail.value;
        } else if (detail.concept.type === 'DEDUCCION') {
            deductionsTotal += detail.value;
        }
    }
    
    const totalValue = earningsTotal - deductionsTotal;
    
    const updatedSettlement = await prisma.settlement.update({
        where: { id: id },
        data: {
            earningsValue: earningsTotal,
            deductionsValue: deductionsTotal,
            totalValue: totalValue
        },
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        }
    });
    
    return updatedSettlement;
};

/**
 * Cambia el estado de una liquidación
 */
exports.changeStatus = async (id, status) => {
    const settlement = await prisma.settlement.findUnique({
        where: { id: id }
    });
    
    if (!settlement) {
        throw new NotFoundError('Settlement not found');
    }
    
    // Validar transiciones de estado
    const validTransitions = {
        'DRAFT': ['OPEN', 'VOID'],
        'OPEN': ['CLOSED', 'DRAFT'],
        'CLOSED': ['OPEN'],
        'VOID': []
    };
    
    if (!validTransitions[settlement.status].includes(status)) {
        throw new ValidationError(`Cannot change status from ${settlement.status} to ${status}`);
    }
    
    const updatedSettlement = await prisma.settlement.update({
        where: { id: id },
        data: { status: status },
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        }
    });
    
    return updatedSettlement;
};

/**
 * Obtiene liquidaciones por empleado
 */
exports.getByEmployee = async (employeeId) => {
    const settlements = await prisma.settlement.findMany({
        where: { employeeId: employeeId },
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return settlements;
};

/**
 * Obtiene liquidaciones por período
 */
exports.getByPeriod = async (periodId) => {
    const settlements = await prisma.settlement.findMany({
        where: { periodId: periodId },
        include: {
            employee: true,
            period: true,
            settlementDetails: {
                include: {
                    concept: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return settlements;
};