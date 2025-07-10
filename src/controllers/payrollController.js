/**
 * @fileoverview Controlador para la gestión de nómina y liquidaciones
 * @module controllers/payrollController
 */

const settlementService = require('../services/settlementService');
const noveltyService = require('../services/noveltyService');
const settlementEarningService = require('../services/settlementEarningService');
const settlementDeductionService = require('../services/settlementDeductionService');
const employeeService = require('../services/employeeService');
const { getConceptByCode, getRegularConcepts } = require('../config/payrollConcepts');
const { validateSettlementNewCreation } = require('../utils/settlementNewValidation');

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
    console.log('Está llegando a payrollController ', data);
    
    // Validar que los datos requeridos estén presentes
    if (!data.employeeId || !data.startDate || !data.endDate) {
        throw new Error('Missing required data: employeeId, startDate, endDate');
    }
    
    const settlementData = {
        employeeId: parseInt(data.employeeId),
        periodId: parseInt(data.periodId),
        startDate: data.startDate,
        endDate: data.endDate,
        status: 'DRAFT',
        earningsValue: 0,
        deductionsValue: 0,
        totalValue: 0
    };
    
    console.log('📋 Datos procesados para settlementService:', settlementData);
    
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
        console.log('🔄 Iniciando creación de conceptos regulares para empleado:', employeeId, 'fecha:', date);
        let regularNews = [];
        const employee = await employeeService.getById(employeeId);
        console.log('👤 Empleado encontrado:', employee ? employee.id : 'No encontrado');
        
        const allConcepts = require('../config/payrollConcepts').getAllPayrollConcepts();
        console.log('📋 Total de conceptos cargados:', allConcepts.length);
        
        // Filtrar solo los conceptos regulares
        const regularConcepts = allConcepts.filter(c => c.isRegularConcept === true);
        console.log('🔄 Conceptos regulares encontrados:', regularConcepts.length);
        console.log('📝 Códigos de conceptos regulares:', regularConcepts.map(c => c.code));
        
        for (const concept of regularConcepts) {
            console.log(`🔄 Procesando concepto regular: ${concept.code} - ${concept.name}`);
            let value = 0;
            // Lógica de valor por defecto según el concepto
            if (concept.code === '101') {
                value = employee.salary;
                console.log(`💰 Salario básico: ${value}`);
            } else if (concept.code === '127') {
                if (!employee.transportAllowance) {
                    console.log('🚫 Empleado no tiene auxilio de transporte, saltando concepto 127');
                    continue; // Solo si aplica auxilio
                }
                value = 150000;
                console.log(`🚌 Auxilio de transporte: ${value}`);
            } else if (concept.code === '204' || concept.code === '208') {
                value = employee.salary * 0.04;
                console.log(`🏥 Seguridad social (${concept.code}): ${value}`);
            } else {
                // Si hay otros conceptos regulares, definir aquí la lógica de valor por defecto
                value = 0;
                console.log(`❓ Concepto regular sin lógica definida: ${concept.code}, valor: ${value}`);
            }
            
            console.log(`📝 Creando novedad para concepto ${concept.code} con valor ${value}`);
            const news = await processNew(value, date, employeeId, concept.code);
            if (!news) {
                console.error(`❌ Error al crear concepto regular: ${concept.name}`);
                throw new Error(`Error al crear concepto regular: ${concept.name}`);
            }
            console.log(`✅ Novedad creada exitosamente:`, news.id);
            regularNews.push(news);
        }
        
        console.log(`🎉 Proceso completado. Total de novedades creadas: ${regularNews.length}`);
        return regularNews;
    } catch (error) {
        console.error('❌ Error en createRegularNews:', error);
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
            return noveltyService.deleteNovelty(id);
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
    console.log(`🔄 Procesando novedad - valor: ${value}, fecha: ${date}, empleado: ${employee}, código: ${code}`);
    
    const concept = getConceptByCode(code);
    if (!concept) {
        console.error(`❌ Concepto no encontrado para código: ${code}`);
        return null;
    }
    console.log(`📋 Concepto encontrado: ${concept.name} (ID: ${concept.id})`);
    
    let data = {
        date: date,
        quantity: 30,
        conceptId: concept.id,
        employeeId: employee,
        value: value,
        status: 'PENDING'
    }
    
    console.log(`📝 Datos preparados para crear novedad:`, data);
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
        console.log('🔍 Validando datos de novedad...');
        const validation = await validateSettlementNewCreation(data);
        console.log('✅ Datos validados:', validation);

        console.log('📝 Creando novedad en la base de datos...');
        const createdSettlementNew = await noveltyService.createNovelty(validation);
        if (!createdSettlementNew) {
            console.error('❌ No se pudo crear la novedad correctamente');
            return null;
        }

        console.log('✅ Novedad creada exitosamente:', createdSettlementNew.id);
        return createdSettlementNew;
    } catch (error) {
        console.error('❌ Error en createNew:', error);
        return { error: error.message };
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
        const settlementNews = await noveltyService.getNovelties(query);
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
            return noveltyService.updateNovelty(id, {
                status: "DRAFT"
            });
        }

        if (type > 40) {
            return noveltyService.updateNovelty(id, {
                status: "DRAFT"
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
            return noveltyService.updateNovelty(id, {
                status: "DRAFT"
            });
        }

        if (type > 40) {
            return noveltyService.updateNovelty(id, {
                status: "DRAFT"
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

        return noveltyService.updateNovelty(id, {
            status: "CANCELLED"
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
        return noveltyService.updateNovelty(id, {
            status: "APPLIED"
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
        return noveltyService.updateNovelty(id, {
            status: "PENDING"
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
    if(type == "EARNINGS") query = {conceptId: { lt: 41 }};
    if(type == "DEDUCTIONS") query = {conceptId: { gt: 40 }};
    
    const novelties = await noveltyService.getNovelties(query);
    const sum = novelties.reduce((total, novelty) => total + (novelty.value || 0), 0);
    return { _sum: { value: sum } };
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