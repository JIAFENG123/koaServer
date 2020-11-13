

const { getUser } = require('../../db')

async function getUserInfo(context) {
    console.log(context.query)
    const user = await getUser(context.query)
    console.log(user)
    if(user.length === 0){
        context.body = {
            status: 0,
            msg: "用户不存在"
        }
    }else{
        context.body = {
            status: 0,
            data: user[0].username,
            msg: '执行成功'
        }
    }
    
}
// async function add(ctx) {
//     const result = await addCustomer(ctx.request.body)
//     if(result === 'miss params'){
//         ctx.response.status = 400
//         ctx.body = {
//             status: -1,
//             msg: 'miss params'
//         }
//     }else if(result === 'bad request'){
//         ctx.body = {
//             status: -1,
//             msg: 'bad request'
//         }
//     }else{
//         ctx.body = {
//             status: -1,
//             msg: '操作成功'
//         }
//     }
// }



module.exports = { getUserInfo }