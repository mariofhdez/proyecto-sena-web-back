const { getCalculationType, getBaseType, getConceptDivisor, getConceptFactor } = require("../utils/payrollConcepts");
const employeeService = require("./employeeService");

async function calculateConceptValue(concept, qunatity, date, calculatedValues){
    const calculationType = getCalculationType(concept.id);

    switch(calculationType){
        case 'LINEAL':
            return concept.value * quantity;
        case 'percentage':
            return (concept.value * quantity) / 100;
        case 'formula':
            return eval(concept.formula);
    }
}

async function calculateLinealValue(concept, quantity, employee){
    const base = await getBaseValue(concept, employeeId);
    const value = base * quantity;
    return Math.round(value * 100) / 100;
}

async function calculateFactorialValue(concept, quantity, employee){
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

async function getPeriodBase(employeeId, date, type, calculatedValues){
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

module.exports = {
    calculateConceptValue,
    calculateLinealValue,
    calculateFactorialValue,
    getBaseValue,
    getPeriodBase
}