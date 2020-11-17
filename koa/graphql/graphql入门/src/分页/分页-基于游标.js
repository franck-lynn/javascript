// 分页最佳实践
// https://relay.dev/graphql/connections.htm#ApplyCursorsToEdges()
// https://relay.dev/graphql/connections.htm  
// 按此教程
// https://www.howtographql.com/graphql-js/8-filtering-pagination-and-sorting/
// https://github.com/howtographql/graphql-js/tree/master/src
// https://github.com/leighhalliday/apollo-pagination-demo

import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import datum  from "../github-response-data.json";
import { buildSchema } from 'graphql'
import graphqlHTTP from 'koa-graphql'
const schema = buildSchema(`
    scalar  Cursor # 一个游标变量
    
    type Post{ # 数据结构的 schema
        name: String!
        kind: String!
        description: String
        fields: [Field]
    }
    type Field { # 子数据 schema
        name : String
    }
    type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        startCursor: Cursor
        endCursor: Cursor
    }
    type PostEdge {
        cursor: Cursor!
        node: Post!
    }
    type PostConnection {
        edges: [PostEdge]!
        pageInfo: PageInfo!
        # 总数量
        count: Int
    }
    type Query {
        # 查询所有用户
        posts (
            page: Int # 分页的起始页
            pageSize: Int  # 分页的数量
        ): [Post!]!
        # 过滤
        feed(filter: String): [Post!]!
    }
    
`)

// https://www.howtographql.com/graphql-js/8-filtering-pagination-and-sorting/
const root = {
    feed: (args) => {
        const where = args.filter
        return datum.data.filter(value => {
            const name = value.name
            return name.includes(where)
        })
    },
    posts: (args) => {
        console.log(args.page, args.pageSize)
        const page = args.page || 1 // 不传入 page 时, 默认的起始页是 第 1 页
        const pageSize = args.pageSize || 10 // 不传入时, 默认就是 10 页
        
        // 对数组进行切片
        return datum.data.slice(page, pageSize)
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