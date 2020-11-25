import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import Router from 'koa-router'
import graphqlHTTP from 'koa-graphql'

import { makeExecutableSchema } from '@graphql-tools/schema'


import { typeDefs } from './graphql'
import { resolvers } from './resolvers'
import { auth } from './middleware/auth'


const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

const app = new Koa()
const router = new Router()

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// https://graphql.cn/learn/serving-over-http/
// GraphQL 应当被放置在所有身份验证中间件之后，
// 以便你在 HTTP 入口端点处理器中能够访问到相同的会话和用户信息。
app.use(auth)

// 这里加载认证的中间件
router.all('/graphql',  graphqlHTTP({
    schema: schema,
    graphiql: true, 
    context: ({ ctx }) =>{
        console.log("打印ctx上下文.............: ", ctx)
        return ctx
    }
}))

const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}

// 批量注册路由
routes(app)

// body parser`
app.use(bodyParser());


// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(4000, _ => {
    console.log(`Server is running at http://localhost:4000/graphql`)
})

// nodemon -r esm app.js --experimental_top_level_await