/**
 * @fileoverview Controlador para la gestión de nómina y liquidaciones
 * @module controllers/payrollController
 */

const settlementService = require('../services/settlementService');
// const settlementNewService = require('../services/settlementNewService');
const settlementEarningService = require('../services/settlementEarningService');
const settlementDeductionService = require('../services/settlementDeductionService');
const employeeService = require('../services/employeeService');
const { getConceptByCode, getRegularConcepts } = require('../utils/payrollConcepts');
// const { validateSettlementNewCreation } = require('../utils/settlementNewValidation');

const {formatDate} = require('../utils/formatDate');
const { fromTimeStampToDate } = require('../utils/typeofValidations');

/**
 * Crea una nueva liquidación de nómina incluyendo sección de devengados y deducciones
 * 
 * @async
 * @function createSettlement
 * @param {Object} data - Datos para crear la liquidación
 * @param {string} data.startDate - Fecha de inicio del período
 * @param {string} data.endDate - Fecha de fin del período
 * @param {number} data.employeeId - ID del empleado
 * @param {number} data.periodId - ID del período
 * @returns {Object} Liquidación creada
 * @throws {Error} Si ocurre un error al crear la liquidación
 */
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

/**
 * Crea conceptos recurrentes para un empleado en una fecha específica
 * 
 * @async
 * @function createRegularNews
 * @param {number} employeeId - ID del empleado
 * @param {string} date - Fecha para crear los conceptos
 * @returns {Array} Lista de conceptos recurrentes creados
 * @throws {Error} Si ocurre un error al crear los conceptos recurrentes
 */
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

/**
 * Elimina conceptos recurrentes de una lista de conceptos
 * 
 * @function deleteRegularNews
 * @param {Array} concepts - Lista de conceptos a procesar
 * @returns {Promise} Promesa que resuelve cuando se eliminan todos los conceptos recurrentes
 */
function deleteRegularNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        if (getRegularConcepts(c.concept.code)) {
            console.log('Eliminando concepto recurrente', id);
            return settlementNewService.remove(id);
        }
    }));
}

/**
 * Procesa la creación de una novedad de liquidación
 * 
 * @async
 * @function processNew
 * @param {number} value - Valor del concepto
 * @param {string} date - Fecha del concepto
 * @param {number} employee - ID del empleado
 * @param {string} code - Código del concepto
 * @returns {Object} Novedad de liquidación creada
 * @throws {Error} Si ocurre un error al procesar la novedad
 */
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

/**
 * Crea una nueva novedad de liquidación
 * 
 * @async
 * @function createNew
 * @param {Object} data - Datos para crear la novedad
 * @param {string} data.date - Fecha de la novedad
 * @param {number} data.quantity - Cantidad del concepto
 * @param {number} data.conceptId - ID del concepto
 * @param {number} data.employeeId - ID del empleado
 * @returns {Object} Novedad de liquidación creada
 * @throws {Error} Si ocurre un error al crear la novedad
 */
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

/**
 * Liquida la nómina de un empleado
 * 
 * @async
 * @function settlePayroll
 * @param {number} settlementId - ID de la liquidación a procesar
 * @returns {Object} Liquidación actualizada con totales calculados
 * @throws {Error} Si ocurre un error durante la liquidación
 */
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

/**
 * Obtiene los totales de devengados para una liquidación
 * 
 * @async
 * @function totals
 * @param {number} id - ID de la liquidación
 * @returns {number} Total de devengados
 */
exports.totals = async(id) => {
    return sumSettlementNews("EARNINGS", id);
}

/**
 * Recupera los conceptos de liquidación para un empleado en un rango de fechas
 * 
 * @async
 * @function retrieveConcepts
 * @param {string} start - Fecha de inicio
 * @param {string} end - Fecha de fin
 * @param {number} employee - ID del empleado
 * @returns {Array} Lista de conceptos de liquidación
 * @throws {Error} Si ocurre un error al consultar los conceptos
 */
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

/**
 * Actualiza las novedades de liquidación conectándolas a devengados o deducciones
 * 
 * @async
 * @function updateSettlementNews
 * @param {Array} concepts - Lista de conceptos a actualizar
 * @param {number} earningsId - ID de devengados
 * @param {number} deductionsId - ID de deducciones
 * @returns {Promise} Promesa que resuelve cuando se actualizan todos los conceptos
 */
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

/**
 * Convierte las novedades de liquidación a estado borrador
 * 
 * @async
 * @function draftSettlementNews
 * @param {Array} concepts - Lista de conceptos a procesar
 * @returns {Promise} Promesa que resuelve cuando se procesan todos los conceptos
 */
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

/**
 * Anula las novedades de liquidación
 * 
 * @async
 * @function voidSettlementNews
 * @param {Array} concepts - Lista de conceptos a anular
 * @returns {Promise} Promesa que resuelve cuando se anulan todos los conceptos
 */
async function voidSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);

        return settlementNewService.update(id, {
            status: "NONE"
        });
    }));
}

/**
 * Cierra las novedades de liquidación
 * 
 * @async
 * @function closeSettlementNews
 * @param {Array} concepts - Lista de conceptos a cerrar
 * @returns {Promise} Promesa que resuelve cuando se cierran todos los conceptos
 */
async function closeSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        return settlementNewService.update(id, {
            status: "CLOSED"
        });
    }));
}

/**
 * Abre las novedades de liquidación
 * 
 * @async
 * @function openSettlementNews
 * @param {Array} concepts - Lista de conceptos a abrir
 * @returns {Promise} Promesa que resuelve cuando se abren todos los conceptos
 */
async function openSettlementNews(concepts) {
    return Promise.all(concepts.map(async c => {
        const id = parseInt(c.id, 10);
        return settlementNewService.update(id, {
            status: "OPEN"
        });
    }));
}

/**
 * Suma los valores de las novedades de liquidación por tipo
 * 
 * @async
 * @function sumSettlementNews
 * @param {string} type - Tipo de concepto ("EARNINGS" o "DEDUCTIONS")
 * @param {number} id - ID de la liquidación
 * @returns {Object} Suma de valores de las novedades
 */
async function sumSettlementNews(type, id) {
    let query = {};
    if(type == "EARNINGS") query = {settlementEarningsId: id};
    if(type == "DEDUCTIONS") query = {settlementDeductionsId: id};
    return await settlementNewService.toAdd(query);
}

/**
 * Actualiza los totales de una liquidación
 * 
 * @async
 * @function updateSettlementTotals
 * @param {number} earningsSum - Suma de devengados
 * @param {number} deductionsSum - Suma de deducciones
 * @param {number} settlementId - ID de la liquidación
 * @param {number} earningsId - ID de devengados
 * @param {number} deductionsId - ID de deducciones
 * @returns {Object} Liquidación actualizada con totales calculados
 * @throws {Error} Si ocurre un error al actualizar los totales
 */
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

/**
 * Convierte una liquidación a estado borrador
 * 
 * @async
 * @function draftSettlement
 * @param {number} settlementId - ID de la liquidación
 * @param {number} earningsId - ID de devengados
 * @param {number} deductionsId - ID de deducciones
 * @returns {Object} Liquidación convertida a borrador
 * @throws {Error} Si ocurre un error al convertir a borrador
 */
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

/**
 * Cierra una liquidación de nómina
 * 
 * @async
 * @function closePayroll
 * @param {number} settlementId - ID de la liquidación a cerrar
 * @returns {Object} Liquidación cerrada
 * @throws {Error} Si ocurre un error al cerrar la liquidación
 */
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

/**
 * Abre una liquidación de nómina
 * 
 * @async
 * @function openPayroll
 * @param {number} settlementId - ID de la liquidación a abrir
 * @returns {Object} Liquidación abierta
 * @throws {Error} Si ocurre un error al abrir la liquidación
 */
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

/**
 * Convierte una liquidación de nómina a estado borrador
 * 
 * @async
 * @function draftPayroll
 * @param {number} settlementId - ID de la liquidación a convertir
 * @returns {Object} Liquidación convertida a borrador
 * @throws {Error} Si ocurre un error al convertir la liquidación
 */
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

/**
 * Anula una liquidación de nómina
 * 
 * @async
 * @function voidPayroll
 * @param {number} settlementId - ID de la liquidación a anular
 * @returns {Object} Liquidación anulada
 * @throws {Error} Si ocurre un error al anular la liquidación
 */
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