const { Model, DataTypes } = require('sequelize');

const EMPLOYEE_TABLE = 'trabajadores';

class Employee extends Model {
    static config(sequelize){
        return{
            sequelize,
            tableName: EMPLOYEE_TABLE,
            modelName: 'trabajadores',
            timestamps:true
        }
    }
}

const EmployeeSchema = {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    documentNumber:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'numero_documento'
    },
    lastName:{
        allowNull:false,
        type:DataTypes.STRING,
        field: 'primer_apellido'
    },
    secondLastName:{
        allowNull: true,
        type: DataTypes.STRING,
        field: 'segundo_apellido'
    },
    firstName:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'primer_nombre'
    },
    middleName:{
        allowNull: true,
        type: DataTypes.STRING,
        field: 'otros_nombres'
    }
}

module.exports={Employee, EmployeeSchema};