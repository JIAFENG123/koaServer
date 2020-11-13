const { sequelize } = require('./initdb')

const { getAllCustomers, addCustomer } = require('./customer')
const {getUser} = require('./user')
module.exports = {
    sequelize,
    getAllCustomers,
    addCustomer,
    getUser
}