const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../libs/sequelize').sequelize;

const City = sequelize.define(
    'City',
    {
        id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

(async () => {
    await sequelize.sync({alter: true});
})();

module.exports = {
    City
}