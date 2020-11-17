import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

import { buildSchema  } from 'graphql'
import graphqlHTTP from 'koa-graphql'
const schema = buildSchema(`
    type Query{
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`)

const root = {
    rollDice: ({ numDice, numSides }) => {
        const output = []
        for (let i = 0; i < numDice; i++){
            output.push(1 + Math.floor(Math.random() * (numSides || 6)))
        }
        return output
    }
}

// 连接 mongodb 数据库
import mongoose from 'mongoose'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()

import cors from "koa2-cors";
// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

app.use(cors())
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

// nodemon -r esm ./02.传递参数.js

/*
传递参数的查询
{
    rollDice(numDice: 3, numSides: 6)
}
*/