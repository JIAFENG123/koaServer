const Router = require('koa-router')
const router = new Router()
const {getAll,add} = require('./customer')
const {getUserInfo} = require('./user')
const {upload} = require('./upload')

router.get('/customer', getAll)  //获取所有数据
      .post('/addcustomer',add)  //添加用户
      .get('/getUserInfo',getUserInfo) //获取用户信息
      .post('/uploadFile',upload)  //上传文件
module.exports = { router }