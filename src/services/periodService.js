const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { ValidationError } = require('../utils/appError');
const { verifyId } = require('../utils/verifyId');

/**
 * Obtiene todos los períodos de nómina
 */
exports.getAll = async () => {
    const periods = await prisma.period.findMany({
        orderBy: {
            startDate: 'desc'
        }
    });
    return periods;
};

/**
 * Obtiene un período por ID
 */
exports.getById = async (id) => {
    const period = await prisma.period.findUnique({
        where: { id: id },
        include: {
            settlements: {
                include: {
                    employee: true,
                    settlementDetails: {
                        include: {
                            concept: true
                        }
                    }
                }
            }
        }
    });
    if (!period) throw new Error('Period not found');
    return period;
};

/**
 * Crea un nuevo período
 */
exports.create = async (data) => {
    console.log('🔄 Creando nuevo período con datos:', data);
    
    // Validar que no haya otro período abierto
    const openPeriod = await prisma.period.findFirst({
        where: {
            status: 'OPEN'
        }
    });
    
    if (openPeriod && data.status === 'OPEN') {
        console.error('❌ Ya existe un período abierto');
        throw new ValidationError('There is already an open period. Only one period can be open at a time.');
    }

    console.log('✅ No hay conflictos con períodos abiertos, creando período...');
    
    const newPeriod = await prisma.period.create({
        data: {
            period: data.period,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
            status: data.status || 'OPEN',
            employeesQuantity: data.employeesQuantity || 0,
            earningsTotal: data.earningsTotal || 0,
            deductionsTotal: data.deductionsTotal || 0,
            totalValue: data.totalValue || 0
        }
    });
    
    console.log('✅ Período creado exitosamente:', newPeriod.id);

    // --- AUTOMATIZACIÓN: Si el período se crea como OPEN, aplicar automatización ---
    if (newPeriod.status === 'OPEN') {
        // Obtener todos los empleados activos
        const employeeService = require('./employeeService');
        const payrollController = require('../controllers/payrollController');
        const allEmployees = await employeeService.getAll();
        const activeEmployees = allEmployees.filter(e => e.isActive);

        console.log(`🔄 Automatizando período ${newPeriod.period}: ${activeEmployees.length} empleados activos encontrados`);

        // Crear liquidaciones y aplicar conceptos regulares y novedades
        for (const employee of activeEmployees) {
            console.log(`🔄 Creando liquidación para empleado ID: ${employee.id}, Nombre: ${employee.firstName} ${employee.firstSurname}`);
            
            // Crear liquidación para el empleado
            const settlementData = {
                startDate: newPeriod.startDate,
                endDate: newPeriod.endDate,
                employeeId: parseInt(employee.id), // Asegurar que sea número
                periodId: parseInt(newPeriod.id)   // Asegurar que sea número
            };
            console.log('📋 Datos de liquidación:', settlementData);
            
            await payrollController.createSettlement(settlementData);
            // Aplicar conceptos regulares (novedades automáticas)
            await payrollController.createRegularNews(parseInt(employee.id), newPeriod.startDate);
        }

        // --- Automatización de novedades ---
        const noveltyService = require('./noveltyService');
        const settlementDetailService = require('./settlementDetailService');
        
        // Buscar todas las novedades PENDING dentro del rango del período
        const pendingNovelties = await noveltyService.getNovelties({
            status: 'PENDING',
            date: {
                gte: newPeriod.startDate,
                lte: newPeriod.endDate
            }
        });

        if (pendingNovelties.length > 0) {
            console.log(`📝 Procesando ${pendingNovelties.length} novedades pendientes`);
            
            // Obtener todas las liquidaciones del período
            const settlementService = require('./settlementService');
            const settlements = await settlementService.getByPeriod(newPeriod.id);
            
            // Procesar cada novedad PENDING
            for (const novelty of pendingNovelties) {
                try {
                    // Buscar la liquidación del empleado correspondiente
                    const settlement = settlements.find(s => s.employeeId === novelty.employeeId);
                    if (settlement) {
                        console.log(`🔄 Procesando novedad ${novelty.id} para empleado ${novelty.employeeId}`);
                        
                        // Crear SettlementDetail automáticamente
                        const settlementDetailData = {
                            settlementId: settlement.id,
                            conceptId: novelty.conceptId,
                            employeeId: novelty.employeeId,
                            quantity: novelty.quantity,
                            value: novelty.value,
                            date: novelty.date,
                            status: 'OPEN'
                        };
                        
                        console.log('📋 Creando SettlementDetail:', settlementDetailData);
                        await settlementDetailService.create(settlementDetailData);
                        
                        // Actualizar novedad a APPLIED y asociar al período
                        await noveltyService.updateNovelty(novelty.id, { 
                            status: 'APPLIED',
                            periodId: newPeriod.id
                        });
                        
                        console.log(`✅ Novedad ${novelty.id} procesada exitosamente`);
                    } else {
                        console.warn(`⚠️ No se encontró liquidación para empleado ${novelty.employeeId}`);
                    }
                } catch (error) {
                    console.error(`❌ Error procesando novedad ${novelty.id}:`, error.message);
                }
            }
        }

        console.log(`✅ Período ${newPeriod.period} automatizado exitosamente`);
    } else {
        console.log('ℹ️ Período creado sin automatización (no está abierto)');
    }
    
    console.log('🎉 Proceso de creación de período completado');
    return newPeriod;
};

/**
 * Actualiza un período
 */
exports.update = async (id, data) => {
    // Si se está abriendo un período, verificar que no haya otro abierto
    if (data.status === 'OPEN') {
        const openPeriod = await prisma.period.findFirst({
            where: {
                status: 'OPEN',
                id: { not: id }
            }
        });
        
        if (openPeriod) {
            throw new ValidationError('There is already an open period. Only one period can be open at a time.');
        }
    }

    const updatedPeriod = await prisma.period.update({
        where: { id: id },
        data: data,
        include: {
            settlements: {
                include: {
                    employee: true,
                    settlementDetails: {
                        include: {
                            concept: true
                        }
                    }
                }
            }
        }
    });
    
    return updatedPeriod;
};

/**
 * Elimina un período (solo si está cerrado y no tiene liquidaciones)
 */
exports.delete = async (id) => {
    const period = await prisma.period.findUnique({
        where: { id: id },
        include: {
            settlements: true
        }
    });
    
    if (!period) {
        throw new ValidationError('Period not found');
    }
    
    if (period.status !== 'OPEN') {
        throw new ValidationError('Only open periods can be deleted');
    }
    
    if (period.settlements.length > 0) {
        throw new ValidationError('Cannot delete period with associated settlements');
    }
    
    const deletedPeriod = await prisma.period.delete({
        where: { id: id }
    });
    
    return deletedPeriod;
};

/**
 * Busca períodos con filtros
 */
exports.query = async (query) => {
    const periods = await prisma.period.findMany({
        where: query,
        orderBy: {
            startDate: 'desc'
        }
    });
    return periods;
};

/**
 * Obtiene el período abierto actual
 */
exports.getOpenPeriod = async () => {
    const openPeriod = await prisma.period.findFirst({
        where: {
            status: 'OPEN'
        },
        include: {
            settlements: {
                include: {
                    employee: true,
                    settlementDetails: {
                        include: {
                            concept: true
                        }
                    }
                }
            }
        }
    });
    return openPeriod;
};

/**
 * Cierra un período y calcula totales
 */
exports.closePeriod = async (id) => {
    const period = await prisma.period.findUnique({
        where: { id: id },
        include: {
            settlements: {
                include: {
                    settlementDetails: {
                        include: {
                            concept: true
                        }
                    }
                }
            }
        }
    });
    
    if (!period) {
        throw new ValidationError('Period not found');
    }
    
    if (period.status !== 'OPEN') {
        throw new ValidationError('Only open periods can be closed');
    }
    
    // Calcular totales
    let earningsTotal = 0;
    let deductionsTotal = 0;
    let employeesQuantity = period.settlements.length;
    
    for (const settlement of period.settlements) {
        for (const detail of settlement.settlement_details) {
            if (detail.concept.type === 'DEVENGADO') {
                earningsTotal += detail.value;
            } else if (detail.concept.type === 'DEDUCCION') {
                deductionsTotal += detail.value;
            }
        }
    }
    
    const totalValue = earningsTotal - deductionsTotal;
    
    const updatedPeriod = await prisma.period.update({
        where: { id: id },
        data: {
            status: 'CLOSED',
            employeesQuantity: employeesQuantity,
            earningsTotal: earningsTotal,
            deductionsTotal: deductionsTotal,
            totalValue: totalValue
        }
    });
    
    return updatedPeriod;
};

/**
 * Abre un período
 */
exports.openPeriod = async (id) => {
    const period = await prisma.period.findUnique({
        where: { id: id }
    });
    
    if (!period) {
        throw new ValidationError('Period not found');
    }
    
    if (period.status !== 'CLOSED') {
        throw new ValidationError('Only closed periods can be opened');
    }
    
    // Verificar que no haya otro período abierto
    const openPeriod = await prisma.period.findFirst({
        where: {
            status: 'OPEN',
            id: { not: id }
        }
    });
    
    if (openPeriod) {
        throw new ValidationError('There is already an open period. Only one period can be open at a time.');
    }
    
    // --- INICIO AUTOMATIZACIÓN ---
    // Obtener todos los empleados activos
    const employeeService = require('./employeeService');
    const payrollController = require('../controllers/payrollController');
    const allEmployees = await employeeService.getAll();
    const activeEmployees = allEmployees.filter(e => e.isActive);

    // Crear liquidaciones y aplicar conceptos regulares y novedades
    for (const employee of activeEmployees) {
        // Crear liquidación para el empleado
        await payrollController.createSettlement({
            startDate: period.startDate,
            endDate: period.endDate,
            employeeId: employee.id,
            periodId: period.id
        });
        // Aplicar conceptos regulares (novedades automáticas)
        await payrollController.createRegularNews(employee.id, period.startDate);
    }

    // --- Automatización de novedades ---
    const noveltyService = require('./noveltyService');
    const settlementDetailService = require('./settlementDetailService');
    
    // Buscar todas las novedades PENDING dentro del rango del período
    const pendingNovelties = await noveltyService.getNovelties({
        status: 'PENDING',
        date: {
            gte: period.startDate,
            lte: period.endDate
        }
    });
    
    if (pendingNovelties.length > 0) {
        console.log(`📝 Procesando ${pendingNovelties.length} novedades pendientes al abrir período`);
        
        // Obtener todas las liquidaciones del período
        const settlementService = require('./settlementService');
        const settlements = await settlementService.getByPeriod(period.id);
        
        // Procesar cada novedad PENDING
        for (const novelty of pendingNovelties) {
            try {
                // Buscar la liquidación del empleado correspondiente
                const settlement = settlements.find(s => s.employeeId === novelty.employeeId);
                if (settlement) {
                    console.log(`🔄 Procesando novedad ${novelty.id} para empleado ${novelty.employeeId}`);
                    
                    // Crear SettlementDetail automáticamente
                    const settlementDetailData = {
                        settlementId: settlement.id,
                        conceptId: novelty.conceptId,
                        employeeId: novelty.employeeId,
                        quantity: novelty.quantity,
                        value: novelty.value,
                        date: novelty.date,
                        status: 'OPEN'
                    };
                    
                    console.log('📋 Creando SettlementDetail:', settlementDetailData);
                    await settlementDetailService.create(settlementDetailData);
                    
                    // Actualizar novedad a APPLIED y asociar al período
                    await noveltyService.updateNovelty(novelty.id, { 
                        status: 'APPLIED',
                        periodId: period.id
                    });
                    
                    console.log(`✅ Novedad ${novelty.id} procesada exitosamente`);
                } else {
                    console.warn(`⚠️ No se encontró liquidación para empleado ${novelty.employeeId}`);
                }
            } catch (error) {
                console.error(`❌ Error procesando novedad ${novelty.id}:`, error.message);
            }
        }
    }
    // --- Fin automatización de novedades ---

    const updatedPeriod = await prisma.period.update({
        where: { id: id },
        data: {
            status: 'OPEN'
        }
    });
    
    return updatedPeriod;
};