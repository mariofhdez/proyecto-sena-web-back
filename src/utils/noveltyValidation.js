const { calculateConceptValue } = require("../services/settlementCalculationEngine");
const { NotFoundError } = require("./appError");
const { formatDate } = require("./formatDate");
const { getCalculationType, getRegularConcepts } = require("./payrollConcepts");
const noveltyService = require("../services/noveltyService");
const { validateDateFormat, validateRequiredString, validateRequiredNumber } = require("./typeofValidations");
const { verifyId } = require("./verifyId");

async function validateNoveltyBody(noveltyId, novelty) {
    let errors = [];
    let data = {
        date: null,
        quantity: null,
        value: null,
        status: 'PENDING',
        concept: { connect: { id: null } },
        employee: { connect: { id: null } }
    }

    //validar fecha
    validateRequiredString(novelty.date, 'date', errors);
    validateDateFormat(novelty.date, 'date', errors);
    data.date = formatDate(novelty.date);

    //validar empleado
    validateRequiredNumber(novelty.employeeId, 'employeeId', errors);
    const isValidEmployee = await verifyId(parseInt(novelty.employeeId, 10), 'employee');
    if (!isValidEmployee) throw new NotFoundError('Employee with id \'' + novelty.employeeId + '\' was not found');
    data.employee.connect.id = novelty.employeeId;

    //validar concepto
    validateRequiredNumber(novelty.conceptId, 'conceptId', errors);
    const isValidConcept = await verifyId(parseInt(novelty.conceptId, 10), 'concept');
    if (!isValidConcept) throw new NotFoundError('Concept with id \'' + novelty.conceptId + '\' was not found');

    const isRegularConcept = getRegularConcepts(novelty.conceptId);
    if (isRegularConcept) errors.push('Concept with id \'' + novelty.conceptId + '\' is not available for novelties');
    data.concept.connect.id = novelty.conceptId;

    if (getCalculationType(novelty.conceptId) === 'NOMINAL') {
        validateRequiredNumber(novelty.value, 'value', errors);
        data.value = novelty.value;
    }
    if (getCalculationType(novelty.conceptId) === 'LINEAL' || getCalculationType(novelty.conceptId) === 'FACTORIAL') {
        validateRequiredNumber(novelty.quantity, 'quantity', errors);
        data.quantity = novelty.quantity;

        data.value = await calculateConceptValue(novelty.conceptId, novelty.employeeId, novelty.quantity, novelty.date);
    }

    if(!noveltyId){
        const isUnique = await validateUniqueNovelty(novelty.employeeId, novelty.conceptId, novelty.date);
        if (!isUnique) errors.push('Novelty with the same employee and concept in the same period already exists');
    }

    if (errors.length > 0) return { errors: errors };
    return data;
}

async function validateUniqueNovelty(employee, concept, date) {
    const employeeId = parseInt(employee, 10);
    const conceptId = parseInt(concept, 10);

    const [year, month] = date.split('-').map(Number);

    let query = {
        employeeId: employeeId,
        conceptId: conceptId,
        date: {
            gte: new Date(year, month - 1, '00'),
            lte: new Date(year, month - 1, '32')
        }
    }

    const novelty = await noveltyService.query(query);
    const lenght = novelty.length;
    if (lenght > 0) {
        return false;
    }
    return true;
}

module.exports = {
    validateNoveltyBody
}
