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
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const schema = makeExecutableSchema({
    typeDefs: `
        type Message {
            title: String!
            content: String
        }
        type Query {
            getMessage: Message
        }
    `,
    resolvers: {
        Query: {
            // 解析器函数或者分开定义指令解析器, 查询解析器resolvers也可以分开定义
            getMessage: () => {
                return {
                    title: "标题",
                    content: "内容"
                }
            }
        }
    }
})

const app = new Koa()
const router = new Router()

// 使用其他中间件
// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

const extensions = ({ /* document, variables, operationName,  result, */ context }) => {
    return {
        runTime: Date.now() - context.startTime,
    };
}

router.all('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true, // 是否需要调试
    context: { startTime: Date.now() },
    extensions
}))

const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}
// 批量注册路由
routes(app)



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

// nodemon -r esm koa-graphql基本使用.js
/*
客户端查询语句:
{
    getMessage {
        title
        content
    }
}
*/