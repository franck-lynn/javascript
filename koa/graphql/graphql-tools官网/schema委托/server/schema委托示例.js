import path from 'path'
import Koa from 'koa'
//! 要建立这2个文件夹， 并各新建index.js文件
// import { resolvers } from './resolvers'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import Router from 'koa-router'
import graphqlHTTP from 'koa-graphql'
import { addResolversToSchema } from '@graphql-tools/schema'


// 连接 mongodb 数据库
// import mongoose from 'mongoose'
//url 带上复制集
// const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
// mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
// mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

//! ===========================================================================================
//! 顶层使用 await
//! 服务器端异步加载 .gql 文件, 
import { loadSchema } from '@graphql-tools/load' 
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
const schema = await loadSchema('./schema.gql', {
    loaders: [new GraphQLFileLoader()] 
})
// console.log("schema: ", schema)
//! 运行的命令是 : nodemon schema委托示例.js --experimental_top_level_await
//! 需要在 package.json 里运行, 并且 package.json 里面设置: "type": "module",
//! ===========================================================================================
import { users, repsitories, issues } from './db.js'


const resolvers = {
    Query: {
        userById: (root, args) => users.find(user => user.id === args.id)
    },
    // 根据 user 查 仓库
    User: {
        repositories: (parent,/*  args, context, info */) => {
            return repsitories.filter(repsitory => repsitory.userId === parent.id)
        }
    },
    // 查看仓库下面有哪些 issues, 多对多的关系
    Repository: {
        issues: (parent) => issues.filter(issue => issue.repositoryId === parent.id)
    }
}

//! 顶层使用 await 导入后, 这里的 schema 与 resolvers 的组合方式不一样了
const schemaWithResolvers = addResolversToSchema({
    schema ,
    resolvers,
})

const app = new Koa()
const router = new Router()

router.all('/graphql', graphqlHTTP({
    schema: schemaWithResolvers,
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
app.use(koaStatic(path.join('../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000/graphql`)
})