import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString } from 'graphql'
import graphqlHTTP from 'koa-graphql'

import Router from 'koa-router'
import { DateType } from './DateType'
import mongoose from 'mongoose'
import cors from "koa2-cors";



// 定义一个 schema, 
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        birthday: { type: DateType }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType), // 这个返回的时一个列表的数据
            args: { _id: { type: GraphQLID } },
            resolve: async () => {
                return [
                    { _id: '0001', name: '周芷若', birthday: new Date('1980-05-16') },
                    { _id: '0002', name: '赵敏', birthday: new Date('1982-09-16') }
                ]
            }
        },
        usersById: {
            type: new GraphQLList(UserType), // 这个返回的时一个列表的数据
            args: { _id: { type: GraphQLID } },
            resolve: async (_, args) => {
                console.log(args)
                return [
                    { _id: '0001', name: '周芷若', birthday: new Date('1980-05-16') },
                    { _id: '0002', name: '赵敏', birthday: new Date('1982-09-16') }
                ].filter(user => user._id === args._id)
            }
        },
        usersByName: {
            type: new GraphQLList(UserType), // 这个返回的是一个列表的数据
            args: { name: { type: GraphQLString } },
            resolve: async (_, args) => {
                console.log(args)
                return [
                    { _id: '0001', name: '周芷若', birthday: new Date('1980-05-16') },
                    { _id: '0002', name: '赵敏', birthday: new Date('1982-09-16') }
                ].filter(user => user.name === args.name)
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery,
})
// 连接 mongodb 数据库

//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()
app.use(cors())
// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser
app.use(bodyParser());



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

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/graphql")
})

/*
执行命令
nodemon - r esm 使用自定义的类型.js
在浏览器中查询
{
    users {
        name
        birthday
    }
}

    {
        users @include(
            if :false) {
            name
            birthday
        }

    }


*/