import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
import session from 'koa-session'
// 连接 mongodb 数据库
import mongoose from 'mongoose'
import { initialize, authenticated, checkAuthenticated } from './passport-initialize'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()
const router = new Router()

// body parser 要在路由注册之前调用
app.use(bodyParser());

// 注册 passport
initialize(app)

router.post('/login', authenticated, async (ctx) => {
    ctx.body = '登录成功'
    // setTimeout(() => {
    //     // console.log("1秒钟后执行跳转", ctx)
    //     ctx.redirect('http:localhost:3000/profile')
    // }, 1000);
    // ctx.redirect('/profile')
})

router.get('/profile', checkAuthenticated, async ctx => {
    ctx.body = '通过检验后返回的值'
})
const routers = [router]
// 批量注册路由函数
const routes = app => {
    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })
}

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// 批量注册路由
routes(app)

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'login.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})