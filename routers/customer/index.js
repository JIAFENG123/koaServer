

const { getAllCustomers, addCustomer } = require('../../db')

async function getAll(context) {
    const customers = await getAllCustomers()
    // context.type = Json
    context.body = {
        status: 0,
        data: customers
    }
}
async function add(ctx) {
    const result = await addCustomer(ctx.request.body)
    if(result === 'miss params'){
        ctx.response.status = 400
        ctx.body = {
            status: -1,
            msg: 'miss params'
        }
    }else if(result === 'bad request'){
        ctx.body = {
            status: -1,
            msg: 'bad request'
        }
    }else{
        ctx.body = {
            status: -1,
            msg: '操作成功'
        }
    }

}



module.exports = { getAll, add }