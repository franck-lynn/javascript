import path from 'path'
import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
//! 要建立这2个文件夹， 并各新建index.js文件
// import {typeDefs} from './graphql'
// import { resolvers } from './resolvers'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

// 连接 mongodb 数据库
import mongoose from 'mongoose'
import { SchemaDirectiveVisitor, gql } from 'apollo-server'
// import gql from 'graphql-tag'

//! 1. 引入外部包
// import { gql, SchemaDirectiveVistor } from 'apollo-server'
import { defaultFieldResolver } from  'graphql' 

//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

//! 2. 定义 directive
class UpperCaseDirective extends SchemaDirectiveVisitor {
    //! 2-1. 复写字段
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;
        //! 2-2. 更改 field 的 resolve function
        field.resolve = async function (...args){
            //! 2-3. 取得原先的 field resolver 的计算结果, 因为 field resolver 
            //! 传回来的有可能是 promise 故使用 await
            const result = await resolve.apply(this, args) 
            //! 2-4. 将取得的结果再做预取的计算 (toUpperCase)
            if(typeof result === 'string'){
                return result.toUpperCase();
            }
            //! 2-5. 回传给前端最终值
            return result
        }
    } 
} 

//! 3. 定义新的 directive
const typeDefs = gql`
    directive @upper on FIELD_DEFINITION
    
    type Query {
        hello: String @upper
    }
`
//! 4. 为 schema 提供 resolver
const resolvers = {
    Query: {
        hello: (/* root, args, context, info */) => {
            return 'hello world'
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers, 
    //! 5. 将 schema 的 directive 的实例做连接并传入 ApolloServer
    schemaDirectives: {
        upper: UpperCaseDirective
    }
})

const app = new Koa()

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser
app.use(bodyParser());



// apollo 服务器注册到 koa app
server.applyMiddleware({app})

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000${server.graphqlPath}`)
})