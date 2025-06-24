const settlementService = require('../services/settlementService');
const settlementNewService = require('../services/settlementNewService');
const settlementEarningService = require('../services/settlementEarningService');
const settlementDeductionService = require('../services/settlementDeductionService');
const employeeService = require('../services/employeeService');
const { getConceptByCode, getRegularConcepts } = require('../config/payrollConcepts');
const { validateSettlementNewCreation } = require('../utils/settlementNewValidation');

const {formatDate} = require('../utils/formatDate');
const { fromTimeStampToDate } = require('../utils/typeofValidations');

// 1.1. Crear nómina incluyendo sección devengados y deducciones
exports.createSettlement = async(data) => {
    const settlementData = {
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        status: 'DRAFT',
        earningsValue: 0,
        deductionsValue: 0,
        totalValue: 0,
        employee: {
            connect: { id: data.employeeId }
        },
        earnings: {
            create: {
                value: 0
            }
        },
        deductions: {
            create: {
                value: 0
            }
        },
        period: {
            connect: { id: data.periodId }
        }
    }
    const settlement = await settlementService.create(settlementData);

    return settlement;
}

// 1.2. Crear conceptos recurrentes
exports.createRegularNews = async(employeeId, date) =>{
    try {
        let regularNews =[]
        const employee = await employeeService.getById(employeeId);
        const salaryValue = employee.salary;
        const hasTransportAllowance = employee.transportAllowance;

        const salaryNew = await processNew(salaryValue, date, employeeId, '101');
        if(!salaryNew) throw new Error('Error al crear concepto recurrente: Salario');

        regularNews.push(salaryNew);
        
        if(hasTransportAllowance){
            const transportNew = await processNew(150000, date, employeeId, '127');
            if(!transportNew) throw new Error('Error al crear concepto recurrente: Auxilio de Tansporte');
            regularNews.push(transportNew);
        }
        
        const healthNew = await processNew((salaryValue * 0.04), date, employeeId, '204');
        if(!healthNew) throw new Error('Error al crear concepto recurrente: Salario');
        regularNews.push(healthNew);
        
        const pensionNew = await processNew((salaryValue * 0.04), date, employeeId, '208');
        if(!pensionNew) throw new Error('Error al crear concepto recurrente: Salario');
        regularNews.push(pensionNew);

        return regularNews;
    } catch (error) {
        return { error: error.message };
    }
}

function deleteRegularNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        if (getRegularConcepts(c.concept.code)) {
            console.log('Eliminando concepto recurrente', id);
            return settlementNewService.remove(id);
        }
    }));
}

async function processNew(value, date, employee, code) {
    const concept = getConceptByCode(code);
    let data = {
        date: date,
        quantity: 30,
        conceptId:  concept.id,
        employeeId: employee
    }

    const settlementNew = await createNew(data);
    return settlementNew;
}

async function createNew(data) {
    try {
        const validation = await validateSettlementNewCreation(data);

        const createdSettlementNew = await settlementNewService.create(validation);
        if (!createdSettlementNew) console.log('No se pudo crear la novedad correctamente');

        return createdSettlementNew;
    } catch (error) {
        return{ error: error.message };
    }
}

// 2. Liquidar nómina
exports.settlePayroll = async(settlementId) => {
    try {
        console.log('Está llegando a settlePayroll');
        const settlement = await settlementService.getById(parseInt(settlementId,10));
        const concepts = await retrieveConcepts(settlement.startDate, settlement.endDate, settlement.employeeId);
        console.log(concepts);
        if(!concepts) throw new Error('Error al obtener conceptos');
        const updatedConcepts = await updateSettlementNews(concepts, settlement.earnings[0].id, settlement.deductions[0].id);
        
        if(!updatedConcepts) throw new Error('Error al liquidar nómina');

        const earningsSum = await sumSettlementNews("EARNINGS", settlement.earnings[0].id);
        const deductionsSum = await sumSettlementNews("DEDUCTIONS", settlement.deductions[0].id);
        
        if(!earningsSum || !deductionsSum) throw new Error('Error al obtener sumatoria de conceptos');

        const updatedSettlement = await updateSettlementTotals(earningsSum, deductionsSum, settlement.id, settlement.earnings[0].id, settlement.deductions[0].id);
        if(!updatedSettlement) throw new Error('Error al cargar saldos en nómina')        
        
        return updatedSettlement;
        
    } catch (error) {
        return { error: error.message };
    }
    
}

exports.totals = async(id) => {
    return sumSettlementNews("EARNINGS", id);
}

async function retrieveConcepts (start, end, employee){
    try {
        const query = {
            employeeId: parseInt(employee, 10),
            date: {
                gte: formatDate(start),
                lte: formatDate(end)
            }
        };
        const includes = true;
        const settlementNews = await settlementNewService.query(query, includes);
        return settlementNews;
    } catch (error) {
        return{ error: error.message };
    }
}

async function updateSettlementNews(concepts, earningsId, deductionsId) {

    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        const type = c.conceptId;

        if (type < 41) {
            return settlementNewService.update(id, {
                status: "DRAFT",
                earnings: {
                    connect: { id: earningsId }
                }
            });
        }

        if (type > 40) {
            return settlementNewService.update(id, {
                status: "DRAFT",
                deductions: {
                    connect: { id: deductionsId }
                }
            });
        }
    }));
}

async function draftSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        const type = c.conceptId;

        if (type < 41) {
            return settlementNewService.update(id, {
                status: "DRAFT",
                earnings: {
                    disconnect: true
                }
            });
        }

        if (type > 40) {
            return settlementNewService.update(id, {
                status: "DRAFT",
                deductions: {
                    disconnect: true
                }
            });
        }
    }));
}

async function voidSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);

        return settlementNewService.update(id, {
            status: "NONE"
        });
    }));
}

async function closeSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        return settlementNewService.update(id, {
            status: "CLOSED"
        });
    }));
}

async function openSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        return settlementNewService.update(id, {
            status: "OPEN"
        });
    }));
}
async function sumSettlementNews(type, id) {
    let query = {};
    if(type == "EARNINGS") query = {settlementEarningsId: id};
    if(type == "DEDUCTIONS") query = {settlementDeductionsId: id};
    return await settlementNewService.toAdd(query);
}

async function updateSettlementTotals(earningsSum, deductionsSum, settlementId, earningsId, deductionsId){
    try {
        const earningsValue = earningsSum._sum.value || 0;
        const deductionsValue = deductionsSum._sum.value || 0;
        let totalValue = earningsValue - deductionsValue;
        totalValue = Math.round(totalValue * 100) / 100;
        
        await settlementEarningService.update(earningsId, { 
            value: earningsValue
        });
        await settlementDeductionService.update(deductionsId, { 
            value: deductionsValue
        });
        
        const updatedSettlement = await settlementService.update(settlementId, {
            status: 'OPEN',
            earningsValue: earningsValue,
            deductionsValue: deductionsValue,
            totalValue: totalValue
        });
        return updatedSettlement;
        
    } catch (error) {
        return { error: error.message}
    }
}

async function draftSettlement(settlementId, earningsId, deductionsId){
    try {   
        await settlementEarningService.update(earningsId, { 
            value: 0
        });
        await settlementDeductionService.update(deductionsId, { 
            value: 0
        });
        
        const updatedSettlement = await settlementService.update(settlementId, {
            status: 'DRAFT',
            earningsValue: 0,
            deductionsValue: 0,
            totalValue: 0
        });

        return updatedSettlement;      
    } catch (error) {
        return { error: error.message}
    }
}

exports.closePayroll = async(settlementId) => {
    try {
        const settlement = await settlementService.getById(settlementId);
        const concepts = await retrieveConcepts(settlement.startDate, settlement.endDate, settlement.employeeId);
        const closedConcepts = await closeSettlementNews(concepts);

        if(!closedConcepts) throw new Error('Error closing concepts');

        const closedSettlement = await settlementService.update(settlementId, {
            status: 'CLOSED'
        });
        if (!closedSettlement) throw new Error('Error al cerrar nómina');
        return closedSettlement;
    } catch (error) {
        return { error: error.message };
    }   
}

exports.openPayroll = async(settlementId) => {
    try {
        const settlement = await settlementService.getById(settlementId);
        const concepts = await retrieveConcepts(settlement.startDate, settlement.endDate, settlement.employeeId);
        const openedConcepts = await openSettlementNews(concepts);
        if(!openedConcepts) throw new Error('Error opening concepts');

        const openedSettlement = await settlementService.update(settlementId, {
            status: 'OPEN'
        });
        if (!openedSettlement) throw new Error('Error al abrir nómina');
        return openedSettlement;
    } catch (error) {
        return { error: error.message };
    }
}

exports.draftPayroll = async(settlementId) => {
    try {
        const settlement = await settlementService.getById(parseInt(settlementId,10));
        const concepts = await retrieveConcepts(settlement.startDate, settlement.endDate, settlement.employeeId);
        if(!concepts) throw new Error('Error al obtener conceptos');
        const updatedConcepts = await draftSettlementNews(concepts);
        
        if(!updatedConcepts) throw new Error('Error al revertir nómina');

        const updatedSettlement = await draftSettlement(settlement.id, settlement.earnings[0].id, settlement.deductions[0].id);
        if(!updatedSettlement) throw new Error('Error al cargar saldos en nómina');       
        
        return updatedSettlement;
        
    } catch (error) {
        return { error: error.message };
    }
}

exports.voidPayroll = async(settlementId) => {
    try {
        const settlement = await settlementService.getById(parseInt(settlementId,10));
        
        const concepts = await retrieveConcepts(settlement.startDate, settlement.endDate, settlement.employeeId);
        if(!concepts) throw new Error('Error al obtener conceptos');

        const voidedConcepts = await voidSettlementNews(concepts);
        if(!voidedConcepts) throw new Error('Error al anular nómina');

        const regularNews = await deleteRegularNews(concepts);
        if(!regularNews) throw new Error('Error al eliminar conceptos recurrentes');

        const voidedSettlement = await settlementService.update(settlementId, {
            status: 'VOID'
        });
        if(!voidedSettlement) throw new Error('Error al anular nómina');

        return voidedSettlement;
    } catch (error) {
        return { error: error.message };
    }
}