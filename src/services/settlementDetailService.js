/**
 * @fileoverview Servicio para la gestión de detalles de liquidación
 * @module services/settlementDetailService
 */

const { PrismaClient } = require('../../generated/prisma');
const { ValidationError, NotFoundError } = require('../utils/appError');
const prisma = new PrismaClient();

/**
 * Obtiene todos los detalles de liquidación
 */
exports.getAll = async () => {
    const details = await prisma.settlementDetail.findMany({
        include: {
            settlement: true,
            concept: true,
            employee: true
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return details;
};

/**
 * Obtiene un detalle de liquidación por ID
 */
exports.getById = async (id) => {
    const detail = await prisma.settlementDetail.findUnique({
        where: { id: id },
        include: {
            settlement: true,
            concept: true,
            employee: true
        }
    });
    
    if (!detail) {
        throw new NotFoundError('Settlement detail not found');
    }
    
    return detail;
};

/**
 * Crea un nuevo detalle de liquidación
 */
exports.create = async (data) => {
    // Validar que la liquidación existe
    const settlement = await prisma.settlement.findUnique({
        where: { id: data.settlementId }
    });
    
    if (!settlement) {
        throw new NotFoundError('Settlement not found');
    }
    
    // Validar que el concepto existe
    const concept = await prisma.payrollConcept.findUnique({
        where: { id: data.conceptId }
    });
    
    if (!concept) {
        throw new NotFoundError('Concept not found');
    }
    
    // Validar que el empleado existe y está activo
    const employee = await prisma.employee.findUnique({
        where: { id: data.employeeId }
    });
    
    if (!employee) {
        throw new NotFoundError('Employee not found');
    }
    
    if (!employee.isActive) {
        throw new ValidationError('Cannot create detail for inactive employee');
    }
    
    // Validar que el empleado coincide con la liquidación
    if (settlement.employeeId !== data.employeeId) {
        throw new ValidationError('Employee does not match settlement employee');
    }
    
    // Validar cantidad si es requerida
    if (concept.calculationType === 'LINEAL' && (!data.quantity || data.quantity <= 0)) {
        throw new ValidationError('Quantity is required for LINEAR concepts');
    }
    
    // Validar valor
    if (!data.value || data.value < 0) {
        throw new ValidationError('Value must be greater than or equal to 0');
    }
    
    const newDetail = await prisma.settlementDetail.create({
        data: {
            settlementId: data.settlementId,
            conceptId: data.conceptId,
            employeeId: data.employeeId,
            date: data.date ? new Date(data.date) : new Date(),
            quantity: data.quantity || null,
            value: data.value,
            status: data.status || 'DRAFT'
        },
        include: {
            settlement: true,
            concept: true,
            employee: true
        }
    });
    
    return newDetail;
};

/**
 * Actualiza un detalle de liquidación
 */
exports.update = async (id, data) => {
    const detail = await prisma.settlementDetail.findUnique({
        where: { id: id },
        include: {
            concept: true
        }
    });
    
    if (!detail) {
        throw new NotFoundError('Settlement detail not found');
    }
    
    // Validar que no se pueda modificar si la liquidación está cerrada
    if (detail.settlement.status === 'CLOSED') {
        throw new ValidationError('Cannot modify detail of closed settlement');
    }
    
    // Validar cantidad si es requerida
    if (detail.concept.calculationType === 'LINEAL' && data.quantity !== undefined && data.quantity <= 0) {
        throw new ValidationError('Quantity must be greater than 0 for LINEAR concepts');
    }
    
    // Validar valor
    if (data.value !== undefined && data.value < 0) {
        throw new ValidationError('Value must be greater than or equal to 0');
    }
    
    const updatedDetail = await prisma.settlementDetail.update({
        where: { id: id },
        data: data,
        include: {
            settlement: true,
            concept: true,
            employee: true
        }
    });
    
    return updatedDetail;
};

/**
 * Elimina un detalle de liquidación
 */
exports.delete = async (id) => {
    const detail = await prisma.settlementDetail.findUnique({
        where: { id: id },
        include: {
            settlement: true
        }
    });
    
    if (!detail) {
        throw new NotFoundError('Settlement detail not found');
    }
    
    // Validar que no se pueda eliminar si la liquidación está cerrada
    if (detail.settlement.status === 'CLOSED') {
        throw new ValidationError('Cannot delete detail of closed settlement');
    }
    
    const deletedDetail = await prisma.settlementDetail.delete({
        where: { id: id }
    });
    
    return deletedDetail;
};

/**
 * Busca detalles de liquidación con filtros
 */
exports.query = async (query) => {
    const details = await prisma.settlementDetail.findMany({
        where: query,
        include: {
            settlement: true,
            concept: true,
            employee: true
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return details;
};

/**
 * Obtiene detalles por liquidación
 */
exports.getBySettlement = async (settlementId) => {
    const details = await prisma.settlementDetail.findMany({
        where: { settlement_id: settlementId },
        include: {
            settlement: true,
            concept: true,
            employee: true
        },
        orderBy: {
            created_at: 'asc'
        }
    });
    return details;
};

/**
 * Obtiene detalles por empleado
 */
exports.getByEmployee = async (employeeId) => {
    const details = await prisma.settlementDetail.findMany({
        where: { employee_id: employeeId },
        include: {
            settlement: true,
            concept: true,
            employee: true
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return details;
};

/**
 * Obtiene detalles por concepto
 */
exports.getByConcept = async (conceptId) => {
    const details = await prisma.settlementDetail.findMany({
        where: { concept_id: conceptId },
        include: {
            settlement: true,
            concept: true,
            employee: true
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return details;
};

/**
 * Cambia el estado de un detalle
 */
exports.changeStatus = async (id, status) => {
    const detail = await prisma.settlementDetail.findUnique({
        where: { id: id },
        include: {
            settlement: true
        }
    });
    
    if (!detail) {
        throw new NotFoundError('Settlement detail not found');
    }
    
    // Validar transiciones de estado
    const validTransitions = {
        'DRAFT': ['OPEN', 'VOID'],
        'OPEN': ['CLOSED', 'DRAFT'],
        'CLOSED': ['OPEN'],
        'VOID': []
    };
    
    if (!validTransitions[detail.status] || !validTransitions[detail.status].includes(status)) {
        throw new ValidationError(`Cannot change status from ${detail.status} to ${status}`);
    }
    
    const updatedDetail = await prisma.settlementDetail.update({
        where: { id: id },
        data: { status: status },
        include: {
            settlement: true,
            concept: true,
            employee: true
        }
    });
    
    return updatedDetail;
};

/**
 * Calcula el valor de un detalle según el tipo de concepto
 */
exports.calculateValue = async (conceptId, quantity, employeeId, settlementId) => {
    const concept = await prisma.payrollConcept.findUnique({
        where: { id: conceptId }
    });
    
    if (!concept) {
        throw new NotFoundError('Concept not found');
    }
    
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
    });
    
    if (!employee) {
        throw new NotFoundError('Employee not found');
    }
    
    let value = 0;
    
    switch (concept.calculationType) {
        case 'LINEAL':
            if (!quantity || quantity <= 0) {
                throw new ValidationError('Quantity is required for LINEAR concepts');
            }
            value = (employee.salary / 30) * quantity;
            break;
            
        case 'FACTORIAL':
            if (!quantity || quantity <= 0) {
                throw new ValidationError('Quantity is required for FACTORIAL concepts');
            }
            if (!concept.factor || !concept.divisor) {
                throw new ValidationError('Factor and divisor are required for FACTORIAL concepts');
            }
            const base = employee.salary / 30;
            value = (base / concept.divisor) * concept.factor * quantity;
            break;
            
        case 'NOMINAL':
            if (!concept.factor) {
                throw new ValidationError('Factor is required for NOMINAL concepts');
            }
            value = concept.factor;
            break;
            
        default:
            throw new ValidationError(`Unsupported calculation type: ${concept.calculationType}`);
    }
    
    return Math.round(value * 100) / 100;
};

/**
 * Obtiene estadísticas de detalles por liquidación
 */
exports.getSettlementStats = async (settlementId) => {
    const details = await prisma.settlementDetail.findMany({
        where: { settlement_id: settlementId },
        include: {
            concept: true
        }
    });
    
    const stats = {
        totalDetails: details.length,
        earningsCount: 0,
        deductionsCount: 0,
        totalEarnings: 0,
        totalDeductions: 0,
        byStatus: {
            DRAFT: 0,
            OPEN: 0,
            CLOSED: 0,
            VOID: 0
        }
    };
    
    for (const detail of details) {
        stats.byStatus[detail.status]++;
        
        if (detail.concept.type === 'DEVENGADO') {
            stats.earningsCount++;
            stats.totalEarnings += detail.value;
        } else if (detail.concept.type === 'DEDUCCION') {
            stats.deductionsCount++;
            stats.totalDeductions += detail.value;
        }
    }
    
    stats.totalEarnings = Math.round(stats.totalEarnings * 100) / 100;
    stats.totalDeductions = Math.round(stats.totalDeductions * 100) / 100;
    
    return stats;
}; 