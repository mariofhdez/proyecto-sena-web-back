const employeeService = require('../services/employeeService');
const { isBlankField, isValidStringType, isValidNumericType, isBooleanType, isNull } = require('./typeofValidations');

function validateNewEmployee(employee) {
    let errors = [];

    validateRequiredString(employee.identification, "identification", errors);

    validateRequiredString(employee.firstSurname, "firstSurname", errors);

    validateRequiredString(employee.firstName, "firstName", errors);

    validateSalary(employee.salary, errors);

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

function validateRequiredString(input, name, errors) {
    if (isNull(input)) {
        return errors.push("The field " + name + " is required");
    } else {
        if (!isValidStringType(input)) {
            return errors.push("The field " + name + " must be a string");
        }
        else{
            if (!isBlankField(input)) {
                return errors.push("The field " + name + " cannot be empty");
            }
        }
    }
}

function validateSalary(salary, errors) {
    if (!isValidNumericType(salary)) {
        errors.push("The field salary must be a number");
    }
    if (salary < 0) {
        errors.push("The field salary must be a positive number");
    }
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
        validateSalary(employee.salary, errors);
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
    if(data.transportAllowance) {
        employee.transportAllowance = data.transportAllowance;
    }
    return employee;
}

module.exports = { validateNewEmployee, validateUniqueEmployee, validateUpdatedEmployee, employeeData };