/**
 * @fileoverview Motor de cálculo para liquidaciones con orden topológico de dependencias
 * @module services/settlementCalculationEngine
 */

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const { 
    getCalculationType, 
    getBaseType, 
    getConceptFactor, 
    getConceptDivisor,
    getConceptByCode 
} = require('../config/payrollConcepts');

const employeeService = require('./employeeService');

/**
 * Resuelve el orden topológico de conceptos para evitar dependencias circulares
 * 
 * @function resolveTopologicalOrder
 * @param {Array<Object>} concepts - Lista de conceptos a procesar
 * @returns {Array<Object>} Conceptos ordenados topológicamente
 * @throws {Error} Si se detectan dependencias circulares
 */
function resolveTopologicalOrder(concepts) {
    const graph = new Map();
    const inDegree = new Map();
    const result = [];
    
    // Inicializar grafo y grados de entrada
    concepts.forEach(concept => {
        graph.set(concept.id, []);
        inDegree.set(concept.id, 0);
    });
    
    // Construir grafo de dependencias
    concepts.forEach(concept => {
        if (concept.base && concept.base !== 'ZERO') {
            const baseConcept = concepts.find(c => c.code === concept.base);
            if (baseConcept) {
                graph.get(baseConcept.id).push(concept.id);
                inDegree.set(concept.id, inDegree.get(concept.id) + 1);
            }
        }
    });
    
    // Algoritmo de ordenamiento topológico (Kahn)
    const queue = [];
    inDegree.forEach((degree, conceptId) => {
        if (degree === 0) {
            queue.push(conceptId);
        }
    });
    
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(concepts.find(c => c.id === current));
        
        graph.get(current).forEach(dependent => {
            inDegree.set(dependent, inDegree.get(dependent) - 1);
            if (inDegree.get(dependent) === 0) {
                queue.push(dependent);
            }
        });
    }
    
    // Verificar si hay dependencias circulares
    if (result.length !== concepts.length) {
        throw new Error('Dependencias circulares detectadas en los conceptos');
    }
    
    return result;
}

/**
 * Calcula el valor de un concepto según su tipo
 * 
 * @function calculateConceptValue
 * @param {Object} concept - Concepto a calcular
 * @param {number} quantity - Cantidad (para LINEAL y FACTORIAL)
 * @param {number} employeeId - ID del empleado
 * @param {string} date - Fecha de liquidación
 * @param {Map} calculatedValues - Valores ya calculados para dependencias
 * @returns {number} Valor calculado del concepto
 */
async function calculateConceptValue(concept, quantity, employeeId, date, calculatedValues) {
    const calculationType = getCalculationType(concept.id);
    
    switch (calculationType) {
        case 'LINEAL':
            return await calculateLinealValue(concept, quantity, employeeId);
            
        case 'FACTORIAL':
            return await calculateFactorialValue(concept, quantity, employeeId, date, calculatedValues);
            
        case 'NOMINAL':
            return getConceptFactor(concept.id) || 0;
            
        default:
            throw new Error(`Tipo de cálculo no soportado: ${calculationType}`);
    }
}

/**
 * Calcula valor para concepto LINEAL
 * 
 * @function calculateLinealValue
 * @param {Object} concept - Concepto a calcular
 * @param {number} quantity - Cantidad
 * @param {number} employeeId - ID del empleado
 * @returns {number} Valor calculado
 */
async function calculateLinealValue(concept, quantity, employeeId) {
    const base = await getBaseValue(concept, employeeId);
    const value = base * quantity;
    return Math.round(value * 100) / 100;
}

/**
 * Calcula valor para concepto FACTORIAL
 * 
 * @function calculateFactorialValue
 * @param {Object} concept - Concepto a calcular
 * @param {number} quantity - Cantidad
 * @param {number} employeeId - ID del empleado
 * @param {string} date - Fecha de liquidación
 * @param {Map} calculatedValues - Valores ya calculados
 * @returns {number} Valor calculado
 */
async function calculateFactorialValue(concept, quantity, employeeId, date, calculatedValues) {
    const base = await getBaseValue(concept, employeeId, date, calculatedValues);
    const factor = getConceptFactor(concept.id);
    const divisor = getConceptDivisor(concept.id);
    
    if (divisor === 0) {
        throw new Error(`Divisor no puede ser 0 para el concepto ${concept.code}`);
    }
    
    // Fórmula: (base ÷ divisor) × factor × quantity
    const value = (base / divisor) * factor * quantity;
    return Math.round(value * 100) / 100;
}

/**
 * Obtiene el valor base para un concepto
 * 
 * @function getBaseValue
 * @param {Object} concept - Concepto
 * @param {number} employeeId - ID del empleado
 * @param {string} date - Fecha de liquidación
 * @param {Map} calculatedValues - Valores ya calculados
 * @returns {number} Valor base
 */
async function getBaseValue(concept, employeeId, date, calculatedValues = new Map()) {
    const baseType = getBaseType(concept.id);
    const employee = await employeeService.getById(employeeId);
    
    switch (baseType) {
        case 'ALLOWANCE':
            return 200000 / 30;
            
        case 'HOURLY':
            return employee.salary / 198;
            
        case 'SALARY':
            return employee.salary / 30;
            
        case 'INCOME':
            return await getPeriodBase(employeeId, date, 'INCOME', calculatedValues);
            
        case 'VACATION':
            return await getPeriodBase(employeeId, date, 'VACATION', calculatedValues);
            
        case 'IBC':
            return await getPeriodBase(employeeId, date, 'IBC', calculatedValues);
            
        case 'ZERO':
            return 0;
            
        default:
            // Si es un código de concepto específico, usar el valor calculado
            if (concept.base && calculatedValues.has(concept.base)) {
                return calculatedValues.get(concept.base);
            }
            throw new Error(`Tipo de base no soportado: ${baseType}`);
    }
}

/**
 * Obtiene la base del período para conceptos que dependen de otros
 * 
 * @function getPeriodBase
 * @param {number} employeeId - ID del empleado
 * @param {string} date - Fecha de liquidación
 * @param {string} type - Tipo de base (INCOME, VACATION, IBC)
 * @param {Map} calculatedValues - Valores ya calculados
 * @returns {number} Base del período
 */
async function getPeriodBase(employeeId, date, type, calculatedValues) {
    const [year, month] = date.split('-').map(Number);
    
    // Obtener conceptos del período según el tipo
    const periodConcepts = await prisma.settlementDetail.findMany({
        where: {
            employeeId: employeeId,
            date: {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month, 0)
            },
            concept: {
                ...(type === 'INCOME' && { isIncome: true }),
                ...(type === 'VACATION' && { isVacation: true }),
                ...(type === 'IBC' && { isIBC: true })
            }
        },
        include: {
            concept: true
        }
    });
    
    // Sumar valores calculados
    const total = periodConcepts.reduce((sum, detail) => {
        const calculatedValue = calculatedValues.get(detail.concept.code) || detail.value;
        return sum + calculatedValue;
    }, 0);
    
    return Math.round((total / 30) * 100) / 100;
}

/**
 * Procesa una liquidación completa con orden topológico
 * 
 * @function processSettlement
 * @param {number} employeeId - ID del empleado
 * @param {string} startDate - Fecha de inicio
 * @param {string} endDate - Fecha de fin
 * @param {Array<Object>} conceptsToProcess - Conceptos a procesar
 * @returns {Object} Resultado de la liquidación
 */
async function processSettlement(employeeId, startDate, endDate, conceptsToProcess) {
    try {
        // Resolver orden topológico
        const orderedConcepts = resolveTopologicalOrder(conceptsToProcess);
        
        const calculatedValues = new Map();
        const results = [];
        
        // Calcular conceptos en orden
        for (const concept of orderedConcepts) {
            const quantity = concept.quantity || 1; // Default para NOMINAL
            const value = await calculateConceptValue(concept, quantity, employeeId, startDate, calculatedValues);
            
            calculatedValues.set(concept.code, value);
            
            results.push({
                conceptId: concept.id,
                conceptCode: concept.code,
                conceptName: concept.name,
                type: concept.type,
                calculationType: getCalculationType(concept.id),
                quantity: quantity,
                value: value,
                base: concept.base,
                factor: getConceptFactor(concept.id),
                divisor: getConceptDivisor(concept.id)
            });
        }
        
        // Calcular totales
        const earnings = results.filter(r => r.type === 'DEVENGADO');
        const deductions = results.filter(r => r.type === 'DEDUCCION');
        
        const totalEarnings = earnings.reduce((sum, r) => sum + r.value, 0);
        const totalDeductions = deductions.reduce((sum, r) => sum + r.value, 0);
        const netPayment = totalEarnings - totalDeductions;
        
        return {
            employeeId,
            startDate,
            endDate,
            concepts: results,
            totals: {
                earnings: Math.round(totalEarnings * 100) / 100,
                deductions: Math.round(totalDeductions * 100) / 100,
                netPayment: Math.round(netPayment * 100) / 100
            },
            calculationOrder: orderedConcepts.map(c => c.code)
        };
        
    } catch (error) {
        throw new Error(`Error en el procesamiento de liquidación: ${error.message}`);
    }
}

module.exports = {
    processSettlement,
    resolveTopologicalOrder,
    calculateConceptValue
}; 