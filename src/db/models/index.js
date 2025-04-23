const { Employee, EmployeeSchema } = require('./employee_models');

function setupModels(sequelize){
    Employee.init(EmployeeSchema, Employee.config(sequelize));
}

module.exports = setupModels;