// https://github.com/bradtraversy/node_passport_login/blob/master/config/passport.js
// https://github.com/fankaidev/vauth/blob/master/server/sample/session-passport.js
import path from 'path'
import Koa from 'koa'
// ./routes 是路由文件夹, 该文件夹下index.js打包处理所有路由
import routes from './routes'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 加入模板引擎
import views from 'koa-views'
import passport from 'koa-passport'
import { initialize } from './passport-config/passport-config'

const app = new Koa()
// 模拟数据库
import users from './db/users'


// body parser
app.use(bodyParser());
// 模板引擎 https://www.npmjs.com/package/koa-views
// 这个要在 路由之前定义, 才能在路由中加载 render 方法
app.use(views(path.join(__dirname, "./views"), { map: { html: 'ejs' } }))


// 初始化 passport. 3个参数
initialize(
    passport,
    email =>{ 
        // console.log("传给验证器的函数", email)
        return users.find(user => user.email === email)
    },
    id => {
        return users.find(user => {
            // console.log("user.id是否与 id 相等? ", user.id === id)
            return user.id === id
        })
    }
)

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))
app.use(passport.initialize())
app.use(passport.session())


// 批量注册路由
routes(app)



app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})