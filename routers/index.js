const Router = require('koa-router')
const router = new Router()
const {getAll,add} = require('./customer')
const {getUserInfo} = require('./user')

router.get('/customer', getAll)  //获取所有数据
      .post('/addcustomer',add)  //添加用户
      .get('/getUserInfo',getUserInfo)
module.exports = { router }