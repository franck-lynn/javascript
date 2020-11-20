// https://github.com/academind/yt-graphql-react-event-booking-api/blob/01-basic-setup/app.js
// https://github.com/academind/yt-graphql-react-event-booking-api/blob/02-graphql-start/app.js
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
import bcrypt from "bcrypt";

// 连接 mongodb 数据库
import mongoose from 'mongoose'
import { User, Event } from './model'

import { ObjectId } from 'mongodb'
import { DecimalType } from './DecimalType'
// import { GraphQLDate } from 'graphql-scalars'
import { DateType } from './DateType'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))


const schema = makeExecutableSchema({
    typeDefs: `
      # 使用自定义的标量
      scalar DecimalType
      # 使用标量库里的标量 https: //github.com/excitement-engineer/graphql-iso-date/
      scalar DateType
      # scalar Date
      
      type Event {
          _id: ID!
          title: String!
          description: String!
          price: DecimalType!
          date: DateType
          # date: Date
      }
      input EventInput {
          title: String!
          description: String!
          price: DecimalType!
          date: DateType
          # date: Date
          creator: String
      }
      type User {
          _id: ID!
          email: String!
          password: String!
          
      }
      input UserInput{
          email: String!
          password: String!
      }
      type Query {
          events: [Event!]
      }
      type Mutation {
          createEvent(eventInput: EventInput): Event
          createUser(userInput: UserInput): User
      }
    `,
    // https://github.com/academind/yt-graphql-react-event-booking-api/blob/04-database-models/app.js
    resolvers: {
        // 自定义的标量在这里引入
        DecimalType, 
        DateType: DateType,
        // Date: GraphQLDate,
        Query: {
            // 解析器函数或者分开定义指令解析器, 查询解析器resolvers也可以分开定义
            events: async () => {
                try {
                    const events = await Event.find()
                    return events.map(e => ({ ...e._doc, _id: e.id }))
                } catch (error) {
                    console.log(error)
                }
            }
        },
        Mutation: {
            createEvent: async (_, args) => {
                console.log('打印出时间" ', args.eventInput.date) 
                const event = new Event({
                    // _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    // 日期字符串通过 Date 自定义标量解析成日期格式, 给数据库使用
                    // 数据库取出日期格式时, 转化成日期字符串给客户端使用
                    date: args.eventInput.date, 
                    creator: args.eventInput.creator // 事件的创建者
                })
                let result
                try {
                    result = await event.save()
                } catch (error) {
                    console.log("1---> ", error)
                }
                // 重新组装 event
                let createdEvent = { ...result._doc, _id: result._doc._id.toString() }
                // 根据 userId 朝朝 user, 如果没找到, 抛出错误, 找到了, 在 user 里增加 event
                let user
                try {
                    user = await User.findById(ObjectId(args.eventInput.creator))
                } catch (error) {
                    console.log("2---> ", error)
                }
                if (!user) {
                    throw new Error('用户没找到')
                }
                // console.log("user是: ----> ", user)
                // 将 event 加入 user 的 createEvent 字段
                user.createEvents.push(event)
                try {
                    await user.save()
                } catch (error) {
                    console.log("3---> ", error)
                }
                return createdEvent
            },
            createUser: async (_, args) => {
                // 获取传过来的参数, 在数据库中查找
                const u = await User.findOne({ email: args.userInput.email })
                if (u) {
                    throw new Error('用户已经存在')
                }
                // 如果用户不存在, 先加密密码
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
                // 生成用户对象
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                // 保存到数据库
                try {
                    const result = await user.save()
                    console.log(result)
                    return { ...result._doc, password: null, _id: result.id }
                } catch (e) {
                    console.log(e)
                }
            }
        }
    },
})

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


// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000/graphql`)
})

// nodemon -r esm 01-event-booking-api.js --experimental_top_level_await