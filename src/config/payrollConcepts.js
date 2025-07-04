/**
 * @fileoverview Configuración y gestión de conceptos de nómina
 * @module config/payrollConcepts
 */

const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient;

let payrollConcepts = [];

let incomeConcepts = [];
let vacationConcepts = [];
let ibcConcepts = [];
let regularConcepts = ['101', '127', '204', '208'];

/**
 * Carga todos los conceptos de nómina desde la base de datos
 * 
 * @async
 * @function loadPayrollConcepts
 * @param {Function} next - Función para manejar errores (opcional)
 * @throws {Error} Si ocurre un error al cargar los conceptos
 */
async function loadPayrollConcepts() {
    try {
        const conceptsFromDB = await prisma.payrollConcept.findMany();
        payrollConcepts = conceptsFromDB;

        incomeConcepts = payrollConcepts.filter(concept => concept.isIncome === true);
        vacationConcepts = payrollConcepts.filter(concept => concept.isVacation === true);
        ibcConcepts = payrollConcepts.filter(concept => concept.isIBC === true);
    } catch (error) {
        throw new Error('Error al cargar los conceptos de nómina');
    }
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

module.exports = {
    loadPayrollConcepts,
    getPayrollConceptById,
    getAllPayrollConcepts,
    getBaseType,
    getCalculationType,
    getConceptFactor,
    getConceptByCode,
    getRegularConcepts
}