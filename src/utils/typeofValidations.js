
function isValidNumericType(input) {
    const numberRegex = /^\d+$/;
    return typeof input === 'number' && numberRegex.test(input);
}

function isNull(input) {
    if (!input || input === null) {
        return true;
    }
    return false;
}

function isValidStringType(input) {
    if (typeof input !== 'string') {
        return false;
    }
    return true;
}

function isBlankField(input) {   
    if (input.trim().length === 0) {
        return false;
    }
    return true;
}

function isBooleanType(input) { 
    return typeof input === 'boolean';
}

module.exports = { isValidNumericType, isNull, isValidStringType, isBlankField, isBooleanType };