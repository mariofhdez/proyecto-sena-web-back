const employeeService = require('../services/employeeService');
const { validateRequiredString, validateRequiredNumber, isBooleanType, isNull } = require('./typeofValidations');

function validateNewEmployee(employee) {
    let errors = [];

    validateRequiredString(employee.identification, "identification", errors);

    validateRequiredString(employee.firstSurname, "firstSurname", errors);

    validateRequiredString(employee.firstName, "firstName", errors);

    validateRequiredNumber(employee.salary, "salary", errors);

    validateTransportAllowance(employee.transportAllowance, errors);

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return {
        isValid: true
    }
}

async function validateUniqueEmployee(identification) {
    const employee = await employeeService.getEmployeeByIdentification(identification);
    const isNullValidation = isNull(employee);
    if(isNullValidation) {
        return true;
    }
    return false;
}

function validateTransportAllowance(transportAllowance, errors) {
    if (!isBooleanType(transportAllowance)) {
        errors.push("The field transportAllowance must be a boolean");
    }
}

function validateUpdatedEmployee(employee) {
    let errors = [];

    if (employee.identification) {
        validateRequiredString(employee.identification, "identification", errors);
        validateUniqueEmployee(employee.identification, errors);
    }

    if (employee.firstSurname) {
        validateRequiredString(employee.firstSurname, "firstSurname", errors);
    }

    if (employee.secondSurname) {
        validateRequiredString(employee.secondSurname, "secondSurname", errors);
    }

    if (employee.firstName) {
        validateRequiredString(employee.firstName, "firstName", errors);
    }

    if (employee.otherNames) {
        validateRequiredString(employee.otherNames, "otherNames", errors);
    }

    if (employee.salary) {
        validateRequiredNumber(employee.salary, errors);
    }

    if (employee.transportAllowance) {
        validateTransportAllowance(employee.transportAllowance, errors);
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return {
        isValid: true
    }
}

function employeeData(data) {
    let employee = {}
    if(data.identification) {
        employee.identification = data.identification;
    }
    if(data.firstSurname) {
        employee.firstSurname = data.firstSurname;
    }
    if(data.secondSurname) {
        employee.secondSurname = data.secondSurname;
    }
    if(data.firstName) {
        employee.firstName = data.firstName;
    }
    if(data.otherNames) {
        employee.otherNames = data.otherNames;
    }
    if(data.salary) {
        employee.salary = data.salary;
    }
    if(data.transportAllowance == true || data.transportAllowance == false) {
        employee.transportAllowance = data.transportAllowance;
    } else {
        employee.transportAllowance = false;
    }
    if(data.position) {
        employee.position = data.position;
    }
    if(data.isActive == true || data.isActive == false) {
        employee.isActive = data.isActive;
    }
    return employee;
}

module.exports = { validateNewEmployee, validateUniqueEmployee, validateUpdatedEmployee, employeeData };