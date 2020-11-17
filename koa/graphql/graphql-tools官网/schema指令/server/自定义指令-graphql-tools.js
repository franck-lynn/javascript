// schema 指令
// 定义一个指令

import path from 'path'
import Koa from 'koa'
// import { ApolloServer } from 'apollo-server-koa'
//! 要建立这2个文件夹， 并各新建index.js文件
// import {typeDefs} from './graphql'
// import { resolvers } from './resolvers'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import Router from 'koa-router'
// 连接 mongodb 数据库
import mongoose from 'mongoose'

import graphqlHTTP from 'koa-graphql'
// import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils'
// import { defaultFieldResolver } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

// 自定义一个指令
/* 
function upperDirective(directiveName) {
    // console.log("指令名称---> ", directiveName)
    return {
        upperDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
        upperDirectiveTransformer: (schema) => mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                // console.log("有没有使用到?", fieldConfig)
                const directives = getDirectives(schema, fieldConfig);
                if (directives[directiveName]) {
                    const { resolve = defaultFieldResolver } = fieldConfig;
                    fieldConfig.resolve = async function(source, args, context, info) {
                        const result = await resolve(source, args, context, info);
                        if (typeof result === 'string') {
                            return result.toUpperCase();
                        }
                        return result;
                    }
                    return fieldConfig;
                }
            }
        })
    };
}
 */

 import { upperDirectiveTypeDefs, upperDirectiveTransformer, upperCaseDirectiveTypeDefs, upperCaseDirectiveTransformer } from "./upperDirective";
 
// const { upperDirectiveTypeDefs, upperDirectiveTransformer } = upperDirective

// console.log("1----> ", upperDirectiveTypeDefs, upperDirectiveTransformer)

// const { upperCaseDirectiveTypeDefs, upperCaseDirectiveTransformer } = upperCaseDirective
    
// console.log("2----> ", upperCaseDirectiveTypeDefs, upperCaseDirectiveTransformer)

// 使用自定义指令
const schema = makeExecutableSchema({
    typeDefs: [upperDirectiveTypeDefs, upperCaseDirectiveTypeDefs, `
            type Query {
              hello: String @upper
              hello2: String @upperCase
            } `],
    resolvers: {
        Query: {
            hello()  {
                return 'hello world!!!';
            },
            hello2() {
                return 'hello world';
            },
        },
    },
    schemaTransforms: [upperDirectiveTransformer, upperCaseDirectiveTransformer],
});


// const schema = makeExecutableSchema({
//     typeDefs,
//     schemaTransforms: [renameDirective('rename')]
// })



// const server = new ApolloServer({
//     typeDefs,
//     resolvers
// })

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



// apollo 服务器注册到 koa app
// server.applyMiddleware({app})

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000/graphql`)
})