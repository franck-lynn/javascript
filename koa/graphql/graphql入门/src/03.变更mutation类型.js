// https://graphql.cn/graphql-js/mutations-and-input-types/
import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

import { buildSchema  } from 'graphql'
import graphqlHTTP from 'koa-graphql'
const schema = buildSchema(`
    # 可以简化 schema 的 关键字 input,
    # 不用再在参数里面分别详细输入类型了
    input MessageInput {
        content: String
        author: String
    }
    type Message {
        id: ID!
        content: String
        author: String
    }
    type Query {
        getMessage(id: ID!): Message
    }
    type Mutation {
        # 相当于输入了参数 {conten: Syring, author: author}
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`)
// 如果 Message 拥有复杂字段，我们把它们放在这个对象里面
// https://graphql.cn/graphql-js/mutations-and-input-types/
class Message {
    constructor (id, {content, author}){
        this.id = id
        this.content = content
        this.author = author
    }
}

const fakeDatabase = {}

const root = {
    getMessage: ({id}) => {
        // 如果数据库里面没有这个ID, 抛出一个错误
        if(!fakeDatabase[id]){
            throw new Error('没有这个id 的消息 ' + id)
        }
        return new Message(id, fakeDatabase[id])
    },
    createMessage: ({input}) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // const id = require('crypto').randomBytes(10).toString('hex');
        const id = 'e94675bdeb8ea4895f79'
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage: ({ id, input }) => {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
}

// 连接 mongodb 数据库
import mongoose from 'mongoose'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
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

// nodemon -r esm ./03.变更类型.js