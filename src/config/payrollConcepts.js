const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient;

let payrollConcepts = [];

let incomeConcepts = [];
let vacationConcepts = [];
let ibcConcepts = [];
let regularConcepts = ['101', '127', '204', '208'];

async function loadPayrollConcepts(next) {
    try {
        const conceptsFromDB = await prisma.payrollConcept.findMany();
        payrollConcepts = conceptsFromDB;

        incomeConcepts = payrollConcepts.filter(concept => concept.isIncome === true);
        vacationConcepts = payrollConcepts.filter(concept => concept.isVacation === true);
        ibcConcepts = payrollConcepts.filter(concept => concept.isIBC === true);
    } catch (error) {
        next(error)
    }
}

function getPayrollConceptById(conceptId){
    return payrollConcepts.find(concept => concept.id === conceptId);
}

function getAllPayrollConcepts() {
    return [...payrollConcepts];
}

function getBaseType(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.base;
}

function getCalculationType(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.calculationType;
}

function getConceptFactor(conceptId) {
    return payrollConcepts.find(concept => concept.id === conceptId)?.factor;
}

function getConceptByCode(conceptCode) {
    return payrollConcepts.find(concept => concept.code === conceptCode);
}

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