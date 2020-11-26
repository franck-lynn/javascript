## [认证与授权](https://the-guild.dev/blog/graphql-modules-auth)  

![avatar](https://the-guild.dev/blog-assets/graphql-modules-auth/cover.jpeg)

### 认证/授权 Authentication/Authorization
在 [StackOverflow](https://stackoverflow.com/questions/6367865/is-there-a-difference-between-authentication-and-authorization/6367931#6367931) 上我发现一个比较好的答案, 很好地概括了认证和授权的不同
![avatar](https://the-guild.dev/blog-assets/graphql-modules-auth/stackoverflow-answer.png)

认证与授权有根本的不同, 认证是确定用户的身份, 看起来像是提供这个问题的答案: 
 * 使用者是谁
 * 用户真的是他/她自己吗?    

授权是一种约定机制, 是系统确定哪个层级的人员可以控制系统.   
 *  X 可以授权访问资源R?
 *  X 可以授权操作资源P?
 *  X 可以授权操作基于P的资源R?

### 认证放在哪里?
![avatar](https://the-guild.dev/blog-assets/graphql-modules-auth/where-to-put-graph.png)
基本上, 在上述的图标中每个部分都可以实现 GraphQL 身份验证, 但是，这些点之间存在差异，
这些点会影响服务器的行为，并且可能会限制您以后执行某些事情。

    认证放在 第2步, GraphQL Server 中的 context 进行处理
### 认证开始(模块化配置)
* 目录结构
>
    |📂 apollo-server 
    |-- |-- index.js // apollo 服务器
    |-- app.js // 主程序入口文件
    |📂 auth // 授权认证文件夹
    |📂 |📂 authentication
    |-- |-- |-- auth-helps.js
    |-- |-- |-- authenticated-guard.js
    |📂 |📂 authorization
    |-- |-- |-- validate-role.js
    |📂 graphql // graphql 模式文件夹
    |-- |-- index.js // graphql 模式文件集中处理
    |-- |-- user.gql
    |📂 model // 数据库模式文件夹
    |-- |-- user.js
    |-- package.json // 主程序执行命令文件
    |📂 resolvers // 解析器文件夹
    |-- |-- index.js // resolvers 解析器集中处理
    |-- |-- user.resolvers.js
    |📂 routes // 路由文件夹, restful 路由
    |-- |-- index.js
    |-- |-- user-router.js  // 用户注册, 登录路由
    |📂 test // 客户端测试文件夹
    |-- |-- 测试认证.http
    |-- 认证与授权.md

* koa 通过中间件向客户端提供如下服务:
>    
    register 注册服务
    login 登录服务
    graphql 服务(认证与授权)
    注册, 登录请求是 restful 接口, graphql 请求的接口通过 apollo 服务器处理
    
### 主程序 app.js  
* 主程序 主要是设置一个 koa 服务器, 通过中间件注册 路由 和 graphql 服务器
```
import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import {server} from './apollo-server'
// 连接 mongodb 数据库
import mongoose from 'mongoose'
// 导入批量路由入口文件
import routes from './routes'

//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser, 解析请求体, 要在路由注册之前调用
app.use(bodyParser());

//! 加载 apollo-server 这里注册了 apollo 服务器
server.applyMiddleware({ app })

// 批量注册路由
routes(app)

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))


app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000`)
})

// nodemon -r esm app.js --experimental_top_level_await
```  
### 路由处理 routes    
* 通过 index.js 文件读取所有路由文件, 进行集中注册
```
// 动态的模块加载
// 被加载的文件导出是有要求的, 只能导出一个,export default xxx 或者 export {} 都可以
import fs from 'fs'
import path from 'path'

const readfiles = (dir, ignore = null, list = [], deep = 0) => {
    const files = fs.readdirSync(dir, 'utf-8')
    for (let i = 0; i < files.length; i++) {
        const stat = fs.statSync(dir + path.sep + files[i])
        if (stat.isDirectory()) {
            readfiles(dir + path.sep + files[i], ignore, list, deep + 1)
        } else {
            // 忽略掉第1层的要忽略的文件, 如不需要这个功能, 去掉 deep 即可
            // 数组, 字符串忽略都可以
            if (!deep && ignore && ignore.indexOf(files[i]) !== -1) continue
            list.push(dir + path.sep + files[i])
        }
    }
    return list
}

// 动态导入模块
const loader = (dir, ignore = null, list = [], deep = 0) => {
    const files = readfiles(dir, ignore, list, deep)
    return files.map(filename => {
        if (!/\.js$/.test(filename)) return
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const rs = require(filename)
        return rs[Object.keys(rs)[0]]
    })
}

//* 自动加载 routes 文件夹下的路由文件
//! 要忽略掉 index.js 和 'loader.js 这2个不是路由的文件
//! routes 文件夹除了这2个文件外, 其他的 js 文件应该都是路由文件.
//! 自动导入的时候才不会报错
const routers = loader(__dirname, ['index.js'])

const routes = app => {
    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })
}
export default routes
```
* 用户注册登录路由. user-touters.js
```
import path from 'path'
import Router from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../model/user'
import dotenv from 'dotenv'

// 环境变量 中设置 口令
const SECRET = dotenv.config({ path: path.resolve('../../../../', '.env') }).parsed.SECRET

const userRouter = new Router()

userRouter.post('/login', async (ctx) => {
    // 登录时判断用户名和密码
    const { name, password } = ctx.request.body
    const user = await User.findOne({ name: name })
    if (!user) {
        ctx.status = 422
        return ctx.body = { err: '用户名不存在' }
    }
    const isPasswordValid = await bcrypt.compare(
        password, user.password
    )
    if (!isPasswordValid) {
        ctx.status = 422
        return ctx.body = { err: '密码无效' }
    }
    // 5秒后 token 失效
    const token = jwt.sign({ id: String(user._id) }, SECRET, { expiresIn: '1h' })
    // ctx.header.authorization = token 
    ctx.body = { user, token } // 是给页面用的的
    // return { user, token }
})

userRouter.post('/register', async (ctx) => {
    // 注册的时候, 客户端要传过来用户信息, 通过 ctx.request.body
    const { username, email, password } = ctx.request.body
    // 在数据库里查找
    const hasEmail = await User.findOne({ email })

    if (hasEmail) { // 要用return, 否则继续往下走
        return ctx.body = { msg: '已经注册过了' }
    }

    // 如果没有注册过, 对密码明文进行加密加盐
    const pwd = await bcrypt.hash(password, 12)
    // 生成用户对象
    const user = new User({
        username,
        email,
        password: pwd
    })
    ctx.body = await user.save()
})


export { userRouter }
```
### Graphql 服务器
```
import { ApolloServer } from 'apollo-server-koa'
import { tradeTokenForUser } from '../auth/authentication/auth-helps'

import { typeDefs } from '../graphql'
import { resolvers } from '../resolvers'

const HEADER_NAME = 'authorization'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ ctx }) => {
        // 当客户端访问 graphql 接口时, 带来了 auth 请求头
        let authToken = null
        let currentUser = null
        authToken = ctx.headers[HEADER_NAME]
        try {
            if (authToken) {
                currentUser = await tradeTokenForUser(authToken)
            }
        } catch {
            console.warn(`不能认证的口令: ${authToken}`);
        }
        return { authToken, currentUser }
    }
})

export { server }
```
* 这里的关键是 context 的配置.
  当用户登录后, 会给客户端签发一个口令, 这里有个问题, 前端如何
  拿到这个令牌存起来, 访问的时候带上这个令牌. 如何存, 如何带?
  js 里的对象 localStorage
  登录成功时, 后端返回的数据 result, 前端会拿到这个数据(令牌token),
  前端可以把这个令牌存过来.
  localStorge.token = result.data 这样就存储起来了.
  前端请求时在请求头中放入前端存储的请求头中携带token.
  可以通过 fetch 进行设置.
  
  













