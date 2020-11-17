// https://segmentfault.com/a/1190000017451907
import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

import { buildSchema, GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import graphqlHTTP from 'koa-graphql'
const schema = buildSchema(`
    scalar Date # 创建一个新的标量
     type User {
        name: String!
        birthDate: Date
     }
     type Query {
         getUser: User
     }
`)

// 创建一个新的解析器
new GraphQLScalarType({
    name: 'Date', // 字段名, 与 schema 中定义的标量名称一致
    description: '自定义日期类型', // 类型描述
    serialize: (value) => value.toString(),  // 序列化函数, 用于将结果转换成适合 http 传输的数据类型
    parseValue: (value) => { // 解析函数, 用于将客户端通过 variables 参数传递的数据为 Date 类型
        if(typeof value === 'string') return new Date(value)
        throw new Error('参数类型错误')
    },
    // 配置中的 parseValue, parseLiteral 都用于解析客户端参数, 分别处理两种参数传递的方式
    parseLiteral: (ast) => { // 解析函数, 将客户端传递的字面量参数解析为Date 类型
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        return null;
    }
    /*
        variable 参数
        引擎调用 parseValue 函数
        query (before: DateTime){
            users(before: $before){
                id
                name
            }
        }
        variables{
            before: '2020-11-11'
        }
        字面量参数
        引擎调用 parseLiteral 函数
        query {
            user(before: '2020-11-11'){
                id
                name
            }
        }
    */
})
const root = {
    getUser: () => {
        return {
            name: '周芷若',
            birthDate: new Date()
        }
    }
}

// 连接 mongodb 数据库
import mongoose from 'mongoose'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser
app.use(bodyParser());


import Router from 'koa-router'
const router = new Router()
router.all('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true // 是否需要调试
}))
const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}


// 批量注册路由
routes(app)

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/graphql")
})
// nodemon -r esm ./05.日期类型.js