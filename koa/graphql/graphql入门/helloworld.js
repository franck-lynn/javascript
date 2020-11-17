import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'

import koaStatic from 'koa-static'

import { buildSchema } from 'graphql'
import graphqlHTTP from 'koa-graphql'

// 定义一个 schema, 表示请求的 是 hello, 是一个字符串
const schema = buildSchema(`
   # 复杂类型的定义
   type  Account {
       name: String
       age: Int
       sex: String
       department: String
   }
   type Query {
       hello: String
       accountName: String
       age: Int
       account: Account
   }
`)
// 定义查询对应的处理器
// 请求 hello 是, 调用的是 hello 函数, 返回 'hello world'
const root = {
    hello: () => {
        return 'hello world'
    },
    accountName: () => {
        return '张三丰'
    },
    age: () => 18,
    account: () => {
        return {
            name: "周芷若",
            age: 28,
            sex: '女',
            department:'峨嵋派掌门'
        }
    }
}
// 运行这个命令
// nodemon - r esm helloworld.js
// 打开浏览器, 在 输入面板中输入 query {hello}, 就可以查询到返回的数据
// 查询的匹配时在 schema 中定义的
// 匹配到了 就在 root 里面找对应的处理函数

const app = new Koa()
const router = new Router()

router.all('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    // 是否需要调试
    graphiql: true
}))
// body parser
app.use(bodyParser());
app.use(router.routes())
app.use(router.allowedMethods());

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/graphql")
})
// 运行这个命令
// nodemon - r esm helloworld.js
// 打开浏览器, 在 输入面板中输入 query {hello}, 就可以查询到返回的数据
// 查询的匹配时在 schema 中定义的
// 匹配到了 就在 root 里面找对应的处理函数

/*
query {
    hello
    accountName
    age
}
*/