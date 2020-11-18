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


// 连接 mongodb 数据库
import mongoose from 'mongoose'

//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

// 定义模式
const typeDefs = `
    directive @upper on FIELD_DEFINITION
    directive @concat(value: String!) on FIELD_DEFINITION
    
    type Query {
        foo: String @concat(value: "@gmail.com") @upper
    }
`
//! 定义指令解析器 *** 指令 ***
const directiveResolvers = {
    upper: async(next,/*  src, args, context */) => {
        const str = await next()
        if(typeof str === 'string'){
            return str.toUpperCase()
        }
        return str
    }, 
    concat: async (next, src, args, /*context */) => {
        const str = await next()
        if(typeof str !== 'undefined'){
            return `${str}${args.value}`
        }
        return str
    }
}

//! 定义 schema 解析器 *** schema ***
const resolvers = {
    Query: {
        foo: () => 'foo'
    }
}

// 使用自定义指令
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    directiveResolvers
})

const app = new Koa()
const router = new Router()

router.all('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // 是否需要调试
}))

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