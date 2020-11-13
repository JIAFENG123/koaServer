const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('test', 'root', '88888888', {
    host: 'localhost',
    dialect: 'mysql',
    charset: 'utf8'
})

module.exports = {
    sequelize
}