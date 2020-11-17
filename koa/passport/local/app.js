
// F:\working\temp\2019-12-22备份\javascript-old\nodejs\nodejs\api\重定向

import path from 'path'
import Koa from 'koa'
// ./routes 是路由文件夹, 该文件夹下index.js打包处理所有路由
import routes from './routes'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 加入模板引擎
import views from 'koa-views'
// 引入 passport
import passport from 'koa-passport'
import { initialize } from './passport-config/passport-config'
import users from './db/users'

const app = new Koa()
// 设置session
app.keys = ['super-secret-key']
app.use(session(app))
// body parser
app.use(bodyParser());

initialize(
    passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)
)

app.use(passport.initialize())
app.use(passport.session())

// 模板引起 https://www.npmjs.com/package/koa-views
// 这个要在 路由之前定义, 才能在路由中加载 render 方法
app.use(views(path.join(__dirname, "./views"), { map: { html: 'ejs' } }))
// 批量注册路由
routes(app)

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})