const { Sequelize } = require('sequelize');
// const { sequelize } = require('../db/initdb')
const { sequelize } = require('../db/initdb');
// console.log(sequelize)
const Customer = sequelize.define('customer', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sex: {
        type: Sequelize.ENUM(['男', '女']),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'Employees',
    timestamps: false
})


module.exports = { Customer } 