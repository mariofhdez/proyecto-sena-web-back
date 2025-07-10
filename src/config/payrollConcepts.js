/**
 * @fileoverview Configuración y gestión de conceptos de nómina
 * @module config/payrollConcepts
 */

const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

let payrollConcepts = [];

let incomeConcepts = [];
let vacationConcepts = [];
let ibcConcepts = [];
let regularConcepts = ['101', '127', '204', '208'];

/**
 * Carga todos los conceptos de nómina desde la base de datos o, si no existen, desde el archivo staticData.json
 * @async
 * @function loadPayrollConcepts
 * @throws {Error} Si ocurre un error al cargar los conceptos
 */
async function loadPayrollConcepts() {
    try {
        let conceptsFromDB = await prisma.payrollConcept.findMany({ orderBy: { code: 'asc' } });
        if (!conceptsFromDB || conceptsFromDB.length === 0) {
            // Cargar desde staticData.json
            const staticPath = path.join(__dirname, '../../prisma/staticData.json');
            const staticData = JSON.parse(fs.readFileSync(staticPath, 'utf8'));
            if (!staticData.PayrollConcept || staticData.PayrollConcept.length === 0) {
                throw new Error('No se encontraron conceptos en staticData.json');
            }
            // Insertar en la base de datos
            await prisma.payrollConcept.createMany({ data: staticData.PayrollConcept });
            conceptsFromDB = await prisma.payrollConcept.findMany({ orderBy: { code: 'asc' } });
            console.log(`✅ Conceptos de nómina cargados automáticamente desde staticData.json: ${conceptsFromDB.length} conceptos`);
        } else {
            console.log(`✅ Conceptos de nómina cargados desde la base de datos: ${conceptsFromDB.length} conceptos`);
        }
        payrollConcepts = conceptsFromDB;
        incomeConcepts = payrollConcepts.filter(concept => concept.isIncome === true);
        vacationConcepts = payrollConcepts.filter(concept => concept.isVacation === true);
        ibcConcepts = payrollConcepts.filter(concept => concept.isIBC === true);
        console.log(`   - Conceptos de ingreso: ${incomeConcepts.length}`);
        console.log(`   - Conceptos de vacaciones: ${vacationConcepts.length}`);
        console.log(`   - Conceptos IBC: ${ibcConcepts.length}`);
    } catch (error) {
        console.error('❌ Error al cargar los conceptos de nómina:', error.message);
        throw new Error('Error al cargar los conceptos de nómina');
    }
}

/**
 * Verifica si los conceptos de nómina están cargados
 * 
 * @function areConceptsLoaded
 * @returns {boolean} true si los conceptos están cargados, false en caso contrario
 */
function areConceptsLoaded() {
    return payrollConcepts.length > 0;
}

/**
 * Obtiene un concepto de nómina por su ID
 * 
 * @function getPayrollConceptById
 * @param {number} conceptId - ID del concepto a buscar
 * @returns {Object|undefined} Concepto encontrado o undefined si no existe
 */
function getPayrollConceptById(conceptId){
    return payrollConcepts.find(concept => concept.id === conceptId);
}

/**
 * Obtiene todos los conceptos de nómina cargados
 * 
 * @function getAllPayrollConcepts
 * @returns {Array<Object>} Lista de todos los conceptos de nómina
 */
function getAllPayrollConcepts() {
    return [...payrollConcepts];
}

/**
 * Obtiene el tipo de base de un concepto por su ID
 * 
 * @function getBaseType
 * @param {number} conceptId - ID del concepto
 * @returns {string|undefined} Tipo de base del concepto o undefined si no existe
 */
function getBaseType(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.base;
}

/**
 * Obtiene el tipo de cálculo de un concepto por su ID
 * 
 * @function getCalculationType
 * @param {number} conceptId - ID del concepto
 * @returns {string|undefined} Tipo de cálculo del concepto o undefined si no existe
 */
function getCalculationType(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.calculationType;
}

/**
 * Obtiene el factor de un concepto por su ID
 * 
 * @function getConceptFactor
 * @param {number} conceptId - ID del concepto
 * @returns {number|undefined} Factor del concepto o undefined si no existe
 */
function getConceptFactor(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.factor;
}

/**
 * Obtiene el divisor de un concepto por su ID
 * 
 * @function getConceptDivisor
 * @param {number} conceptId - ID del concepto
 * @returns {number|undefined} Divisor del concepto o undefined si no existe
 */
function getConceptDivisor(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.divisor;
}

/**
 * Obtiene un concepto por su código
 * 
 * @function getConceptByCode
 * @param {string} conceptCode - Código del concepto a buscar
 * @returns {Object|undefined} Concepto encontrado o undefined si no existe
 */
function getConceptByCode(conceptCode) {
    return payrollConcepts.find(concept => concept.code === conceptCode);
}

/**
 * Verifica si un código de concepto es un concepto regular
 * 
 * @function getRegularConcepts
 * @param {string} conceptCode - Código del concepto a verificar
 * @returns {boolean} true si es un concepto regular, false en caso contrario
 */
function getRegularConcepts(conceptCode) {
    const concept = regularConcepts.find(concept => concept === conceptCode);
    console.log(concept === conceptCode);
    return concept === conceptCode;
}

/**
 * Valida la integridad de los conceptos de nómina cargados
 * 
 * @function validateConceptsIntegrity
 * @returns {Object} Resultado de la validación con errores si los hay
 */
function validateConceptsIntegrity() {
    const errors = [];
    const conceptCodes = new Set();
    
    // Verificar códigos únicos
    for (const concept of payrollConcepts) {
        if (conceptCodes.has(concept.code)) {
            errors.push(`Código duplicado: ${concept.code}`);
        }
        conceptCodes.add(concept.code);
        
        // Verificar que el código tenga exactamente 3 caracteres
        if (concept.code.length !== 3) {
            errors.push(`Código inválido: ${concept.code} debe tener exactamente 3 caracteres`);
        }
    }
    
    // Verificar que los conceptos base referenciados existan
    for (const concept of payrollConcepts) {
        if (concept.base && concept.base !== 'ZERO') {
            const baseConcept = payrollConcepts.find(c => c.code === concept.base);
            if (!baseConcept) {
                errors.push(`Concepto base no encontrado: ${concept.code} referencia a ${concept.base}`);
            }
        }
    }
    
    // Verificar dependencias circulares (simplificado)
    // Un análisis más complejo requeriría un grafo de dependencias
    for (const concept of payrollConcepts) {
        if (concept.base && concept.base !== 'ZERO') {
            const baseConcept = payrollConcepts.find(c => c.code === concept.base);
            if (baseConcept && baseConcept.base === concept.code) {
                errors.push(`Dependencia circular detectada: ${concept.code} ↔ ${baseConcept.code}`);
            }
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        totalConcepts: payrollConcepts.length
    };
}

module.exports = {
    loadPayrollConcepts,
    areConceptsLoaded,
    validateConceptsIntegrity,
    getPayrollConceptById,
    getAllPayrollConcepts,
    getBaseType,
    getCalculationType,
    getConceptFactor,
    getConceptDivisor,
    getConceptByCode,
    getRegularConcepts
}