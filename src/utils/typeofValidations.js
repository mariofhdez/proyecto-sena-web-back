
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

function isValidDateFormat(input) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // Check if input is a string and matches YYYY-MM-DD pattern
    if (typeof input !== 'string' || !dateRegex.test(input)) {
        return false;
    }

    // Parse the date parts
    const [year, month, day] = input.split('-').map(Number);

    // Create a date object and verify the date is valid
    const date = new Date(year, month - 1, day); // month is 0-based

    // Check if the date parts match what we passed in
    // This catches invalid dates like 2025-02-30
    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

function validateRequiredString(input, name, errors) {
    if (isNull(input)) {
        return errors.push("The field " + name + " is required");
    } else {
        if (!isValidStringType(input)) {
            return errors.push("The field " + name + " must be a string");
        }
        else {
            if (!isBlankField(input)) {
                return errors.push("The field " + name + " cannot be empty");
            }
        }
    }
}

function validateRequiredNumber(input, name, errors) {
    if (isNull(input)) {
        return errors.push("The field " + name + " is required");
    }
    else {
        if (!isValidNumericType(input)) {
            errors.push("The field " + name + " must be a number");
        }
    }
}

function validateDateFormat(input, field, errors) {
    if (!isValidDateFormat(input)) {
        errors.push("The field " + field + " must be a valid date");
    }
}

function splitDate(date) {
    const [year, month, day] = date.split('-').map(Number);
    return {
        year: year,
        month: month,
        day: day
    }
}

function fromTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const newDate = date.toISOString().split('T')[0];
    return newDate;
}

module.exports = {
    isValidNumericType,
    isNull,
    isValidStringType,
    isBlankField,
    isBooleanType,
    validateRequiredString,
    validateRequiredNumber,
    isValidDateFormat,
    validateDateFormat,
    splitDate,
    fromTimestampToDate
};