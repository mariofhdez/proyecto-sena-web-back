const { getCalculationType, getBaseType, getConceptDivisor, getConceptFactor } = require("../utils/payrollConcepts");
const employeeService = require("./employeeService");

async function calculateConceptValue(conceptId, employeeId, quantity, date){
    const calculationType = getCalculationType(conceptId);

    switch(calculationType){
        case 'LINEAL':
            return await calculateLinealValue(conceptId, quantity, employeeId);
        case 'FACTORIAL':
            return await calculateFactorialValue(conceptId, quantity, employeeId, date);
        default:
            throw new Error(`Calculation type not supported: ${calculationType}`);
    }
}

async function calculateLinealValue(concept, quantity, employee){
    const base = await getBaseValue(concept, employee);
    const value = base * quantity;
    return Math.round(value * 100) / 100;
}

async function calculateFactorialValue(concept, quantity, employee, date){
    const base = await getBaseValue(concept, employee);
    const factor = getConceptFactor(concept);
    const value = base * quantity * factor;
    return Math.round(value * 100) / 100;
}

async function getBaseValue(concept, employeeId){
    const baseType = getBaseType(concept);
    const divisor = getConceptDivisor(concept);
    const employee = await employeeService.getById(employeeId);

    switch(baseType){
        case 'ALLOWANCE':
            return 200000 / divisor;
            
        case 'HOURLY':
            return employee.salary / divisor;
            
        case 'SALARY':
            return employee.salary / divisor;
            
        case 'INCOME':
            return await getPeriodBase(employeeId, date, 'INCOME');
            
        case 'VACATION':
            return await getPeriodBase(employeeId, date, 'VACATION');
            
        case 'IBC':
            return await getPeriodBase(employeeId, date, 'IBC');
            
        case 'ZERO':
            return 0;
            
        default:
            throw new Error(`Tipo de base no soportado: ${baseType}`);
    }
}

async function getPeriodBase(employeeId, date, type){
    const [year, month] = date.split('-').map(Number);

    let query = {
        employeeId: employeeId,
            date: {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month, 0)
            },
    };

    switch(type){
        case 'INCOME':
            query.concept = {
                isIncome: true
            }
            break;
        case 'VACATION':
            query.concept = {
                isVacation: true
            }
            break;
        case 'IBC':
            query.concept = {
                isIBC: true
            }
            break;
        default:
            throw new Error(`Tipo de base no soportado: ${type}`);
    };

    const periodNovelties = await prisma.novelty.findMany({
        where: query,
        include: {
            concept: true
        }
    });

    const total = periodNovelties.reduce((sum, novelty) => sum + novelty.value, 0);

    return total;
}

/**
 * Determina el orden de cálculo de conceptos basado en dependencias
 * @param {Array} concepts - Lista de conceptos a calcular
 * @returns {Array} Conceptos ordenados por dependencias
 */
function getCalculationOrder(concepts) {
    const conceptMap = new Map();
    const dependencies = new Map();
    
    // Crear mapa de conceptos
    concepts.forEach(concept => {
        conceptMap.set(concept.id, concept);
        dependencies.set(concept.id, []);
    });
    
    // Identificar dependencias
    concepts.forEach(concept => {
        const baseType = getBaseType(concept.id);
        if (baseType === 'INCOME' || baseType === 'VACATION' || baseType === 'IBC') {
            // Los conceptos que dependen de INCOME, VACATION o IBC deben calcularse después
            concepts.forEach(otherConcept => {
                if (otherConcept.id !== concept.id) {
                    const otherBaseType = getBaseType(otherConcept.id);
                    if (otherBaseType === baseType || 
                        (otherBaseType === 'SALARY' && baseType === 'INCOME') ||
                        (otherBaseType === 'SALARY' && baseType === 'IBC')) {
                        dependencies.get(concept.id).push(otherConcept.id);
                    }
                }
            });
        }
    });
    
    // Ordenamiento topológico simple
    const visited = new Set();
    const result = [];
    
    function visit(conceptId) {
        if (visited.has(conceptId)) return;
        visited.add(conceptId);
        
        dependencies.get(conceptId).forEach(depId => {
            visit(depId);
        });
        
        result.push(conceptMap.get(conceptId));
    }
    
    concepts.forEach(concept => {
        if (!visited.has(concept.id)) {
            visit(concept.id);
        }
    });
    
    return result;
}

async function generateSettlement(employeeId, periodId, startDate, endDate) {
    // Obtener empleado
    const employee = await employeeService.getById(employeeId);
    if (!employee || !employee.isActive) {
        throw new Error('Empleado no encontrado o inactivo');
    }
    
    // Obtener conceptos regulares
    const regularConcepts = await prisma.concept.findMany({
        where: { isRegularConcept: true }
    });
    
    // Obtener novedades del período
    const novelties = await prisma.novelty.findMany({
        where: {
            employeeId: employeeId,
            status: 'PENDING',
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        },
        include: { concept: true }
    });
    
    // Combinar conceptos regulares y novedades
    const allConcepts = [...regularConcepts, ...novelties.map(n => n.concept)];
    
    // Ordenar por dependencias
    const orderedConcepts = getCalculationOrder(allConcepts);
    
    // Calcular valores
    const settlementDetails = [];
    let earningsTotal = 0;
    let deductionsTotal = 0;
    
    for (const concept of orderedConcepts) {
        let quantity = 1; // Por defecto
        let value = 0;
        
        // Determinar cantidad según el tipo de concepto
        if (concept.calculationType === 'LINEAL') {
            // Para conceptos regulares, usar días del período
            if (concept.isRegularConcept) {
                const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                quantity = daysDiff;
            }
        }
        
        // Buscar novedad específica para este concepto
        const novelty = novelties.find(n => n.conceptId === concept.id);
        if (novelty) {
            quantity = novelty.quantity || quantity;
        }
        
        // Calcular valor
        value = await calculateConceptValue(
            concept.id, 
            employee.id, 
            quantity, 
            endDate, 
        );
        
        // Acumular totales
        if (concept.type === 'DEVENGADO') {
            earningsTotal += value;
        } else {
            deductionsTotal += value;
        }
        
        // Crear detalle de liquidación
        settlementDetails.push({
            conceptId: concept.id,
            employeeId: employee.id,
            date: new Date(endDate),
            quantity: quantity,
            value: value,
            status: 'DRAFT'
        });
        
        // Actualizar estado de novedad si existe
        if (novelty) {
            await prisma.novelty.update({
                where: { id: novelty.id },
                data: { status: 'APPLIED' }
            });
        }
    }
    
    const totalValue = earningsTotal - deductionsTotal;
    
    return {
        employeeId,
        periodId,
        startDate,
        endDate,
        status: 'DRAFT',
        earningsValue: earningsTotal,
        deductionsValue: deductionsTotal,
        totalValue,
        details: settlementDetails
    };
}

module.exports = {
    calculateConceptValue,
    calculateLinealValue,
    calculateFactorialValue,
    getBaseValue,
    getPeriodBase
}