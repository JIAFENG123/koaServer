
const Koa = require('koa')
const { ApolloServer, gql } = require('apollo-server-koa');
const koaBodyParser = require('koa-bodyparser')
const { router } = require('./routers')
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
app.use(koaBodyParser())
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