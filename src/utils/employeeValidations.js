function validateEmployee(employee) {
    let errors = [];

    if(!employee.identification) {
        errors.push("The field identification is required");
    }
    if(!employee.firstSurname) {
        errors.push("The field firstSurname is required");
    }
    if(!employee.firstName) {
        errors.push("The field firstName is required");
    }
    if(!employee.salary) {
        errors.push("The field salary is required");
    }
    if(!employee.transportAllowance) {
        errors.push("The field transportAllowance is required");
    }
    if(errors.length > 0) {
        return {
            isValid: false,
            errors: errors
        }
    }
    return {
        isValid: true
    }
}

module.exports = { validateEmployee };
