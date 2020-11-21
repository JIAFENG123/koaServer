
const Koa = require('koa')
const { ApolloServer, gql } = require('apollo-server-koa');
const cors = require('koa-cors');
const koaBodyParser = require('koa-bodyparser')
const { router } = require('./routers')
const koaBody = require('koa-body')
const app = new Koa()
const { sequelize } = require('./db/initdb')
const { QueryTypes } = require('sequelize');
const typeDefs = gql`
  type Query {
    data: String
  }
`;
const resolvers = {
    Query: {
        rows: async () => {
            let result = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT })
            return result
        }
    },
};

// const server = new ApolloServer({ typeDefs, resolvers });

// server.applyMiddleware({ app });
// app.use(koaBodyParser())
app.use(koaBody({
    multipart: true,
    formidable: {
        // maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}))
app.use(cors());
app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    // ctx.set("Access-Control-Allow-Headers", "authorization")
    await next()
})
app.use(
    async (context, next) => {
        try {
            await next()
        } catch (err) {
            // context.type = Json
            context.body = {
                status: -1,
                message: err.message
            }
        }
    }
)

app.use(router.routes())
    .listen(8088, () => {
        console.log('server is ok ....')
        // console.log(`🚀 Server ready at http://localhost:8088${server.graphqlPath}`)
    })