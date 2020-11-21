const Router = require('koa-router')
const router = new Router()
const { getAll, add } = require('./customer')
const { getUserInfo } = require('./user')
const { upload, uploadChunk, mergeChunks } = require('./upload')

router.get('/customer', getAll)  //获取所有数据
      .post('/addcustomer', add)  //添加用户
      .get('/getUserInfo', getUserInfo) //获取用户信息
      .post('/uploadFile', upload)  //上传文件
      .post('/file/uploadChunk', uploadChunk) //切片上传
      .post('/file/merge_chunks', mergeChunks)        //合并切片   
module.exports = { router }