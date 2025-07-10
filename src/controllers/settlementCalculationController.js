/**
 * @fileoverview Controlador para el motor de cálculo de liquidaciones
 * @module controllers/settlementCalculationController
 */

const { processSettlement } = require('../services/settlementCalculationEngine');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { verifyId } = require('../utils/verifyId');
const { getAllPayrollConcepts } = require('../config/payrollConcepts');

/**
 * Procesa una liquidación completa con orden topológico de dependencias
 * 
 * @async
 * @function processCompleteSettlement
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la liquidación
 * @param {number} req.body.employeeId - ID del empleado
 * @param {string} req.body.startDate - Fecha de inicio (YYYY-MM-DD)
 * @param {string} req.body.endDate - Fecha de fin (YYYY-MM-DD)
 * @param {Array<Object>} req.body.concepts - Conceptos a procesar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con el resultado de la liquidación
 */
exports.processCompleteSettlement = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate, concepts } = req.body;
        
        // Validaciones básicas
        if (!employeeId || !startDate || !endDate || !concepts) {
            throw new ValidationError('Faltan campos requeridos: employeeId, startDate, endDate, concepts');
        }
        
        if (!Array.isArray(concepts) || concepts.length === 0) {
            throw new ValidationError('El campo concepts debe ser un array no vacío');
        }
        
        // Validar que el empleado existe
        const isValidEmployee = await verifyId(parseInt(employeeId, 10), 'employee');
        if (!isValidEmployee) {
            throw new NotFoundError(`Empleado con ID ${employeeId} no encontrado`);
        }
        
        // Validar formato de fechas
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            throw new ValidationError('Las fechas deben tener formato YYYY-MM-DD');
        }
        
        // Validar que startDate <= endDate
        if (new Date(startDate) > new Date(endDate)) {
            throw new ValidationError('La fecha de inicio debe ser menor o igual a la fecha de fin');
        }
        
        // Obtener conceptos completos de la configuración
        const allConcepts = getAllPayrollConcepts();
        const conceptsToProcess = [];
        
        // Validar y preparar conceptos para el procesamiento
        for (const conceptRequest of concepts) {
            const { conceptCode, quantity } = conceptRequest;
            
            if (!conceptCode) {
                throw new ValidationError('Cada concepto debe tener un conceptCode');
            }
            
            // Buscar el concepto en la configuración
            const concept = allConcepts.find(c => c.code === conceptCode);
            if (!concept) {
                throw new ValidationError(`Concepto con código ${conceptCode} no encontrado`);
            }
            
            // Agregar cantidad si se proporciona
            const conceptWithQuantity = {
                ...concept,
                quantity: quantity || 1
            };
            
            conceptsToProcess.push(conceptWithQuantity);
        }
        
        // Procesar la liquidación
        const result = await processSettlement(
            parseInt(employeeId, 10),
            startDate,
            endDate,
            conceptsToProcess
        );
        
        res.status(200).json({
            message: 'Liquidación procesada exitosamente',
            data: result
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Valida conceptos para una liquidación sin procesarla
 * 
 * @async
 * @function validateSettlementConcepts
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la validación
 * @param {Array<Object>} req.body.concepts - Conceptos a validar
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} Respuesta JSON con el resultado de la validación
 */
exports.validateSettlementConcepts = async (req, res, next) => {
    try {
        const { concepts } = req.body;
        
        if (!Array.isArray(concepts) || concepts.length === 0) {
            throw new ValidationError('El campo concepts debe ser un array no vacío');
        }
        
        const allConcepts = getAllPayrollConcepts();
        const conceptsToValidate = [];
        const errors = [];
        
        // Validar cada concepto
        for (const conceptRequest of concepts) {
            const { conceptCode } = conceptRequest;
            
            if (!conceptCode) {
                errors.push('Cada concepto debe tener un conceptCode');
                continue;
            }
            
            const concept = allConcepts.find(c => c.code === conceptCode);
            if (!concept) {
                errors.push(`Concepto con código ${conceptCode} no encontrado`);
                continue;
            }
            
            conceptsToValidate.push(concept);
        }
        
        if (errors.length > 0) {
            throw new ValidationError('Errores de validación', errors);
        }
        
        // Intentar resolver orden topológico
        const { resolveTopologicalOrder } = require('../services/settlementCalculationEngine');
        const orderedConcepts = resolveTopologicalOrder(conceptsToValidate);
        
        res.status(200).json({
            message: 'Conceptos validados exitosamente',
            data: {
                totalConcepts: conceptsToValidate.length,
                calculationOrder: orderedConcepts.map(c => c.code),
                concepts: conceptsToValidate.map(c => ({
                    code: c.code,
                    name: c.name,
                    type: c.type,
                    calculationType: c.calculationType,
                    base: c.base,
                    factor: c.factor,
                    divisor: c.divisor
                }))
            }
        });
        
    } catch (error) {
        next(error);
    }
}; 