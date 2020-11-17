import path from 'path'
import Koa from 'koa'
//! 要建立这2个文件夹， 并各新建index.js文件
// import {typeDefs} from './graphql'
// import { resolvers } from './resolvers'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import Router from 'koa-router'
import graphqlHTTP from 'koa-graphql'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql';

// 连接 mongodb 数据库
import mongoose from 'mongoose'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const typeDefs = `
    directive @upper on FIELD_DEFINITION
    
    type Query {
        hello: String @upper
    }
`
const directiveResolvers = {
    upper: async(next, /* src, args, context */) => {
        const str = await next()
        if(typeof str === 'string') return str.toUpperCase()
        return str
    }
}

const resolvers  = {
    Query: {
        hello: (/* root, arg, context */) => {
            return 'hello world'
        }
    }
}
// 使用自定义指令
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    directiveResolvers,
})

const app = new Koa()
const router = new Router()

router.all('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // 是否需要调试
}))

const query = `
    query UPPER_HELLO {
        hello
    }
`
graphql(schema, query).then(r => console.log("直接在服务器端打印: ", r.data.hello))

const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}
// 批量注册路由
routes(app)

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser
app.use(bodyParser());


// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000/graphql`)
})

// nodemon -r esm 指令解析器.js   