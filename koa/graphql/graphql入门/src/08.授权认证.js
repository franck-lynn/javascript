// 教程网址:
// https://www.howtographql.com/graphql-js/6-authentication/
// 代码
// https://github.com/howtographql
// https://www.imooc.com/article/details/id/25650  中文
// https://graphql.cn/learn/pagination/
import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import Router from 'koa-router'
import mongoose from 'mongoose'

import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString } from 'graphql'
import graphqlHTTP from 'koa-graphql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// 根据 请求头的 authorization 解析出用户的 id, 因为在注册时, 对 id
// 进行了签名, 并生成了 token, 这个 token 是放在请求头里面的 
const getUserId = ctx => {
    console.log("解析出的 authorization", ctx.header.authorization)
    console.log("获取 authScope", ctx.authScope)
    const raw = ctx.header.authorization.split(' ').pop()
    if (raw) {
        // console.log("解析出的 用户 id", raw)
        const { userID } = jwt.verify(raw, 'APP_SECRET')

        return userID
    }
    throw new Error('没有认证, Not authenticated')
}

// 定义一个 schema, 
const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID }, // 自增长
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        links: { type: GraphQLList(Link) }
    })
})
const Link = new GraphQLObjectType({
    name: 'Link',
    fields: {
        id: { type: GraphQLID }, // 自增长
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        postedBy: { type: User },
    }
})
const AuthPayload = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: {
        token: { type: GraphQLString },
        user: { type: User },
    }
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        feed: {
            type: new GraphQLList(User), // 这个返回的时一个列表的数据
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
                return
            }
        }
    }
})
// 代表数据库的 users 表
const users = []
// 代表用户提交post 的内容
const links = []

const rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        post: { // 认证后提交
            type: Link,
            args: {
                // 提交时的一些参数
                id: { type: GraphQLID },
                description: { type: GraphQLString },
                url: { type: GraphQLString }
            },
            resolve: async (parent, args, context, info) => {
                // console.log('上下文: ', context.header)
                const userID = getUserId(context)
                // console.log("获取的用户id", context.header.authorization)

                const user = users.find(user => user.id === userID)
                const link = { ...args, user }
                links.push(link)
                return link
            }
        },

        signup: { // 注册
            type: AuthPayload,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                password: { type: GraphQLString },
                email: { type: GraphQLString },
            },
            resolve: async (parent, args, context, info) => {
                // 1.
                const password = await bcrypt.hash(args.password, 10)
                // 2. 写入数据库, 先判断一下数据库里有没有, 根据传过来的 name
                // const hasUser = users.find(user => user.name === args.name)
                // let user
                // if (!hasUser) {
                //     user = { ...args, password }
                //     users.push(user)
                // } else {
                //     throw new Error('数据库里面已经有一个这样的名字了')
                // }
                // 3. 签名 id

                let user = { ...args, password }
                users.push(user)

                const token = jwt.sign({ userID: user.id }, 'APP_SECRET')
                //!!!!! 4. 
                context.header = { authorization: token }
                return { token, user }
                // context.body = { token, user }
            }

        },
        login: {
            type: AuthPayload,
            resolve: async () => { /*  */ }
        }
    }
})


const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: rootMutation
})
//连接 mongodb 数据库, url 带上复制集
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


const router = new Router()
router.all('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true, // 是否需要调试
    context: ({ ctx }) => ctx
    // context: ({ctx}) => {
    //     console.log("获取的上下文", ctx)
    //     return {
    //         // 把上下文中的数据传递给 resolver 使用
    //         authScope: ctx.header.authorization
    //     }
    // }
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

// nodemon -r esm 08.授权认证.js