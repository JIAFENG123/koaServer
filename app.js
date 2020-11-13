const Koa = require('koa')
const Router = require('koa-router')
const axios = require('axios')
const Http = require('http')
const https = require('https')
const Querystring = require('querystring')
const { resolve } = require('path')
//实例化
const app = new Koa()
const router = new Router()

const Service = {
    async search(result = '') {
        return new Promise((resolve, reject) => {
            Http.request({
                hostname: 'm.maoyan.com',
                path: '/ajax/search?' + Querystring.stringify({
                    kw: result,
                    cityId: 10
                })
            }, res => {
                res.setEncoding('utf8')
                let data = []
                res.on('data', chunk => {
                    data.push(chunk)
                }).on('end', () => {
                    resolve(data.join(''))
                    // axios.get(url).then(res => {
                    //     console.log(res)
                    //     resolve(res)
                    // },() => {
                    //     reject()
                    // })

                })
            }).end()
        })
    }
}


//render页面
const Render = (data = {}, result = '') => {
    let res = JSON.parse(data)
    let html = ''
    res.movies.list.forEach(e => {
        html += `<span>${e.nm}</span><br>`
    });
    return `<div>${html}</div>`
}


let getJson = (url) => {
    return new Promise((resolve,reject) => {
        https.get(url, res => {
            // console.log(res)
            let data = []
            res.setEncoding('utf8')
            res.on('data', chunk => {
                data.push(chunk)
            }).on('end', () => {
                resolve(data.toString())
            })
        }).on('error', (e) => {
            reject(e)
          });
    })
}
//设置请求路由
router.get('/', async (ctx, next) => {
    let { result } = ctx.query
    let data = await Service.search(result)
    let url = data.match(/".+"/)[0].replace('amp;', '').replace(/"/g,'')
    console.log(url)
    let res = await getJson(url)
    ctx.body = Render(res, result)
})

//开启服务
app.use(
    router.routes()
)
    .listen(8088, () => {
        console.log('server is ok ....')
    })