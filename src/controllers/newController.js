
const factor = {
    "DAYTIME_OVERTIME": 1.25,
    "NIGHT_OVERTIME": 1.75,
    "SUNDAY_HOLIDAY_DAYTIME_OVERTIME": 2,
    "SUNDAY_HOLIDAY_NIGHT_OVERTIME": 2.5,
    "NIGHT_SURCHARGE": 0.35,
    "SUNDAY_HOLIDAY_SURCHARGE": 0.75,
    "SUNDAY_HOLIDAY_NIGHT_SURCHARGE": 1.1,
    "LAY_OFF": 0.08333,
    "INTEREST_ON_LAY_OF": 0.01,
    "LEGAL_BOUNTY": 0.08333,
    "HEALTH": 0.04,
    "PENSION": 0.04,
    "PENSION_SOLIDARITY": 0.005,
    "SUBSISTENCE_1": 0.005,
    "SUBSISTENCE_2": 0.007,
    "SUBSISTENCE_3": 0.009,
    "SUBSISTENCE_4": 0.011,
    "SUBSISTENCE_5": 0.013,
    "SUBSISTENCE_6": 0.015
}

function factorialCalculation(basis, quantity, factor) {
    return basis * quantity * factor;
}

function linearCalculation(basis, quantity) {
    return basis, quantity
}
