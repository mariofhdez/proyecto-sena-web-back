const { getCalculationType, getBaseType, getConceptDivisor, getConceptFactor, loadPayrollConcepts, areConceptsLoaded } = require("../utils/payrollConcepts");
const employeeService = require("./employeeService");
const noveltyService = require("./noveltyService");
const conceptService = require("./conceptService");
const { verifyId } = require("../utils/verifyId");
const { ValidationError } = require("../utils/appError");

async function calculateConceptValue(conceptId, employeeId, quantity, date, calculatedValues = new Map()) {
    const calculationType = getCalculationType(conceptId);
    if (quantity < 0) {
        throw new Error('Quantity cannot be negative');
    }

    switch (calculationType) {
        case 'LINEAL':
            return await calculateLinealValue(conceptId, quantity, employeeId, calculatedValues);
        case 'FACTORIAL':
            return await calculateFactorialValue(conceptId, quantity, employeeId, date, calculatedValues);
        default:
            throw new Error(`Calculation type not supported: ${calculationType}`);
    }
}

async function calculateLinealValue(conceptId, quantity, employeeId, calculatedValues = new Map()) {
    const base = await getBaseValue(conceptId, employeeId, calculatedValues);
    const value = base * quantity;
    return Math.round(value * 100) / 100;
}

async function calculateFactorialValue(conceptId, quantity, employeeId, date, calculatedValues = new Map()) {
    const base = await getBaseValue(conceptId, employeeId, date, calculatedValues);
    const factor = getConceptFactor(conceptId);
    const value = base * quantity * factor;
    return Math.round(value * 100) / 100;
}

async function getBaseValue(conceptId, employeeId, date, calculatedValues = new Map()) {
    const baseType = getBaseType(conceptId);
    const divisor = getConceptDivisor(conceptId);
    const employee = await employeeService.getById(employeeId);

    switch (baseType) {
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
            throw new Error(`Tipo de base no soportado: ${baseType}`);
    }
}

async function getPeriodBase(employeeId, date, type, calculatedValues = new Map()) {
    // Crear clave única para este cálculo
    const cacheKey = `${employeeId}-${type}-${date}`;

    // Verificar si ya tenemos el valor calculado
    if (calculatedValues.has(cacheKey)) {
        return calculatedValues.get(cacheKey);
    }

    let total = 0;

    if (type === 'IBC') {
        // Para IBC, necesitamos calcular basado en los conceptos ya procesados
        // Buscar en calculatedValues los conceptos que tienen isIBC = true

        // Obtener todos los conceptos con isIBC = true
        const ibcConcepts = await conceptService.getAll({
            where: { isIBC: true }
        });


        // Sumar los valores de los conceptos IBC que ya se han calculado
        for (const ibcConcept of ibcConcepts) {
            const conceptKey = `${employeeId}-${ibcConcept.id}-${date}`;
            if (calculatedValues.has(conceptKey)) {
                const value = calculatedValues.get(conceptKey);
                total += value;
            }
        }

        // Si no hay conceptos IBC calculados aún, usar el salario como base
        if (total === 0) {
            const employee = await employeeService.getById(employeeId);
            total = employee.salary;
        }

    } else {
        // Para INCOME y VACATION, buscar en novedades
        const [year, month] = date.split('-').map(Number);

        let query = {
            employeeId: employeeId,
            date: {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month, 0)
            },
        };

        switch (type) {
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
            default:
                throw new Error(`Tipo de base no soportado: ${type}`);
        };

        const periodNovelties = await noveltyService.getAllNovelties({
            where: query,
            include: {
                concept: true
            }
        });

        total = periodNovelties.reduce((sum, novelty) => sum + novelty.value, 0);
    }

    // Guardar en caché
    calculatedValues.set(cacheKey, total);

    return total;
}

/**
 * Determina el orden de cálculo de conceptos basado en dependencias
 * @param {Array} concepts - Lista de conceptos a calcular
 * @returns {Array} Conceptos ordenados por dependencias
 */
function getCalculationOrder(concepts) {
    const orderedConcepts = [];

    // 1. Conceptos con baseType null
    const nullBaseConcepts = concepts.filter(concept => getBaseType(concept.id) === null);
    orderedConcepts.push(...nullBaseConcepts);

    // 2. Conceptos independientes (SALARY, ALLOWANCE, HOURLY, ZERO)
    const independentConcepts = concepts.filter(concept => {
        const baseType = getBaseType(concept.id);
        return baseType !== null && ['SALARY', 'ALLOWANCE', 'HOURLY', 'ZERO'].includes(baseType);
    });
    orderedConcepts.push(...independentConcepts);

    // 3. Conceptos IBC
    const ibcConcepts = concepts.filter(concept => concept.isIBC === true);
    orderedConcepts.push(...ibcConcepts);

    // 4. Conceptos dependientes de IBC, INCOME, VACATION
    const dependentConcepts = concepts.filter(concept => {
        const baseType = getBaseType(concept.id);
        return ['IBC', 'INCOME', 'VACATION'].includes(baseType);
    });
    orderedConcepts.push(...dependentConcepts);

    // Eliminar duplicados manteniendo el orden
    const uniqueConcepts = [];
    const seenIds = new Set();
    for (const concept of orderedConcepts) {
        if (!seenIds.has(concept.id)) {
            uniqueConcepts.push(concept);
            seenIds.add(concept.id);
        }
    }
    return uniqueConcepts;
}

async function generateSettlement(employeeId, periodId, startDate, endDate) {
    const periodValidation = await verifyId(periodId, 'period');
    if (!periodValidation) {
        throw new Error('Período no encontrado');
    }

    // Cargar conceptos si no están cargados
    const [year, month] = endDate.split('-').map(Number);
    if (!areConceptsLoaded()) {
        await loadPayrollConcepts();
    }

    // Obtener empleado
    const employee = await employeeService.getById(employeeId);
    if (!employee || !employee.isActive) {
        throw new Error('Empleado no encontrado o inactivo');
    }

    // Obtener conceptos regulares
    let regularConcepts = await conceptService.getAll({
        where: { isRegularConcept: true }
    });

    // Excluir concepto de transporte (code='127') si el empleado no tiene subsidio de transporte
    if (!employee.transportAllowance) {
        regularConcepts = regularConcepts.filter(concept => concept.code !== '127');
    }

    // Obtener novedades del período
    const novelties = await noveltyService.getAllNovelties({
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

    // 🆕 Crear caché para esta liquidación
    const calculatedValues = new Map();

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
                const opEndDate = month === 2 ? new Date(year, month, 30) : new Date(endDate);
                const daysDiff = Math.ceil((opEndDate - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
                quantity = daysDiff > 30 ? 30 : daysDiff;
            }
        }

        // Buscar novedad específica para este concepto
        const novelty = novelties.find(n => n.conceptId === concept.id);
        if (novelty) {
            quantity = novelty.quantity || quantity;
        }

        // 🆕 Calcular valor usando caché
        if (concept.calculationType !== 'NOMINAL') {
            value = await calculateConceptValue(
                concept.id,
                employee.id,
                quantity,
                endDate,
                calculatedValues // 🆕 Pasar el caché
            );
        } else {
            console.log('else: ',concept);
            const novelty = novelties.find(n => n.conceptId === concept.id);
            if (novelty) {
                console.log('novelty: ',novelty);
                value = novelty.value;
            }
        }

        // Guardar el valor calculado en el caché para futuras referencias
        const conceptKey = `${employee.id}-${concept.id}-${endDate}`;
        calculatedValues.set(conceptKey, value);

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
            status: 'OPEN'
        });

        // Actualizar estado de novedad si existe
        if (novelty) {
            await noveltyService.update(
                novelty.id,
                {
                    status: 'APPLIED',
                    period: {
                        connect: {
                            id: periodId
                        }
                    }
                }
            );
        }
    }

    const totalValue = earningsTotal - deductionsTotal;
    if (totalValue < 0) {
        throw new ValidationError('Payroll was not settled', 'Deductions exceed the value of earnings');
    }

    return {
        employeeId,
        periodId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'OPEN',
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
    getPeriodBase,
    getCalculationOrder,
    generateSettlement
}