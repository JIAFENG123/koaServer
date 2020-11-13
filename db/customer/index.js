

const { Customer } = require('../../model')
const { Op } = require('sequelize')

const {sequelize} = require('../initdb')
//查询所有用户信息
async function getAllCustomers() {
    return await Customer.findAndCountAll({
        attributes: ['name', 'sex'],
        order: [
            ['name','DESC']
        ]
    })
}
//增加用户信息
async function addCustomer(query) {
    if(query){
        if(query.name && query.sex && query.address){
            let addsql = `INSERT INTO Employees VALUES (0,'${query.name}','${query.sex}' ,'${query.address}' )`
        } else {
            return 'miss params'
        }
    }else{
        return 'bad request'
    }
    // const [results, metadata] = await sequelize.query(addsql);
    return await sequelize.query(addsql);
}

module.exports = { getAllCustomers, addCustomer }
